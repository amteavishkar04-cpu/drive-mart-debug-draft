/**
 * DriveMart Authentication & Authorization Middleware
 */

import crypto from 'crypto';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'torqo_production_jwt_secret_key_2026';

// Token → user lookup cache (60-second TTL)
// Prevents repeated DB scans on every authenticated request under load
const _tokenCache = new Map();
const TOKEN_CACHE_TTL = 60 * 1000; // 60 seconds

function _getCachedUser(token) {
  const entry = _tokenCache.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    _tokenCache.delete(token);
    return null;
  }
  return entry.user;
}

function _setCachedUser(token, user) {
  // Evict cache if it grows too large (> 1000 tokens)
  if (_tokenCache.size >= 1000) {
    const firstKey = _tokenCache.keys().next().value;
    _tokenCache.delete(firstKey);
  }
  _tokenCache.set(token, { user, expiresAt: Date.now() + TOKEN_CACHE_TTL });
}

// Base64Url helpers
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Generate standard HMAC-SHA256 JWT token
 */
export function generateToken(payload, expiresInSeconds = 86400 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify HMAC-SHA256 JWT token
 */
export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Express / Connect middleware: Require Authenticated User
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in or provide a valid Bearer token.'
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please log in again.'
      });
    }

    // Check token cache first — skip DB scan for recent requests
    let user = _getCachedUser(token);
    if (!user) {
      user = await db.findUserById(payload.id);
      if (user) _setCachedUser(token, user);
    }

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'User account not found or deactivated.'
      });
    }

    req.user = user;
    if (typeof next === 'function') next();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Role-Based Access Control Guard
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`
      });
    }

    if (typeof next === 'function') next();
  };
}

/**
 * Bike Ownership Guard (Owner can only modify their own vehicle; Admin has full access)
 */
export async function requireBikeOwner(req, res, next) {
  try {
    const bikeId = req.params.id || req.params.bikeId;
    if (!bikeId) {
      return res.status(400).json({ success: false, error: 'Bike ID is required.' });
    }

    const bike = await db.getBikeById(bikeId);
    if (!bike) {
      return res.status(404).json({ success: false, error: 'Vehicle not found.' });
    }

    if (req.user.role === 'ADMIN' || bike.owner_id === req.user.id) {
      req.bike = bike;
      if (typeof next === 'function') next();
    } else {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. You do not have permission to manage this vehicle.'
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
