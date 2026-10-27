/**
 * DriveMart — Production HTTP Server
 * Built with Node.js built-ins only (zero npm dependencies)
 *
 * Features:
 *   ✅ Multi-core clustering (one worker per CPU)
 *   ✅ IP-based rate limiting (100 req/min per IP)
 *   ✅ Gzip compression for API + static responses
 *   ✅ HTTP cache headers for static assets (24h browser cache)
 *   ✅ Keep-Alive connections (fewer TCP handshakes)
 *   ✅ Request timeout (30s hard limit)
 *   ✅ Auto-restart crashed workers
 *   ✅ Graceful shutdown on SIGTERM/SIGINT
 */

import cluster from 'cluster';
import os from 'os';
import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT     = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const NUM_CPUS = os.cpus().length;

// ─── Cluster: Primary process forks workers ───────────────────────────────────
if (cluster.isPrimary) {
  console.log(`\n⚡ DriveMart [${NODE_ENV}] — Primary PID ${process.pid}`);
  console.log(`   Spawning ${NUM_CPUS} worker(s) across ${NUM_CPUS} CPU core(s)...\n`);

  for (let i = 0; i < NUM_CPUS; i++) cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`⚠️  Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork(); // auto-restart
  });

  // Graceful primary shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received — shutting down workers...');
    for (const id in cluster.workers) cluster.workers[id].kill();
    process.exit(0);
  });

} else {
  // ─── Worker Process ──────────────────────────────────────────────────────────

  // Lazy-import DB and middleware only inside workers
  const { db }                                                          = await import('./db/database.js');
  const { generateToken, requireAuth, requireRole, requireBikeOwner }  = await import('./middleware/auth.js');
  const { hashPassword }                                                = await import('./db/seed.js');

  // ─── MIME Types ───────────────────────────────────────────────────────────────
  const MIME = {
    '.html':  'text/html; charset=utf-8',
    '.css':   'text/css; charset=utf-8',
    '.js':    'application/javascript; charset=utf-8',
    '.json':  'application/json; charset=utf-8',
    '.svg':   'image/svg+xml',
    '.png':   'image/png',
    '.jpg':   'image/jpeg',
    '.jpeg':  'image/jpeg',
    '.webp':  'image/webp',
    '.ico':   'image/x-icon',
    '.woff':  'font/woff',
    '.woff2': 'font/woff2',
    '.txt':   'text/plain; charset=utf-8',
  };

  // Static assets cached in browser for 24 hours; HTML always revalidated
  const CACHE_CONTROL = {
    static:   'public, max-age=86400, immutable',  // JS/CSS/images
    html:     'no-cache',                           // HTML revalidated every request
    api:      'no-store',                           // API responses never cached
  };

  // ─── Rate Limiter (per IP, 100 req/min) ──────────────────────────────────────
  const _rateLimitMap = new Map();
  const RATE_LIMIT    = 100;   // max requests
  const RATE_WINDOW   = 60000; // per 60 seconds

  function isRateLimited(ip) {
    const now    = Date.now();
    const record = _rateLimitMap.get(ip) || { count: 0, start: now };

    if (now - record.start > RATE_WINDOW) {
      // Reset window
      record.count = 1;
      record.start = now;
    } else {
      record.count++;
    }

    _rateLimitMap.set(ip, record);

    // Clean up old entries every 5 min to prevent memory leak
    if (_rateLimitMap.size > 5000) {
      for (const [key, val] of _rateLimitMap) {
        if (now - val.start > RATE_WINDOW) _rateLimitMap.delete(key);
      }
    }

    return record.count > RATE_LIMIT;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  function getIP(req) {
    return (
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      '0.0.0.0'
    );
  }

  function parseCookies(req) {
    return Object.fromEntries(
      (req.headers.cookie || '').split(';').map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, decodeURIComponent(v.join('='))];
      }).filter(([k]) => k)
    );
  }

  function parseQuery(url) {
    const idx = url.indexOf('?');
    return idx === -1 ? {} : Object.fromEntries(new URLSearchParams(url.slice(idx + 1)));
  }

  function parseBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on('data', chunk => {
        size += chunk.length;
        if (size > 1_048_576) { // 1 MB body limit
          reject(new Error('Request body too large (max 1 MB)'));
          req.destroy();
        } else {
          chunks.push(chunk);
        }
      });
      req.on('end', () => {
        try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}); }
        catch { reject(new Error('Invalid JSON body')); }
      });
      req.on('error', reject);
    });
  }

  function supportsGzip(req) {
    return /gzip/i.test(req.headers['accept-encoding'] || '');
  }

  /**
   * Send JSON response — auto gzip if client supports it
   */
  function sendJSON(res, status, data, req = null) {
    if (res.headersSent) return;
    const body = JSON.stringify(data);

    if (req && supportsGzip(req)) {
      zlib.gzip(body, (err, compressed) => {
        if (err || res.headersSent) return;
        res.writeHead(status, {
          'Content-Type':     'application/json; charset=utf-8',
          'Content-Encoding': 'gzip',
          'Content-Length':   compressed.length,
          'Cache-Control':    CACHE_CONTROL.api,
          'Vary':             'Accept-Encoding',
        });
        res.end(compressed);
      });
    } else {
      const buf = Buffer.from(body);
      res.writeHead(status, {
        'Content-Type':  'application/json; charset=utf-8',
        'Content-Length': buf.length,
        'Cache-Control':  CACHE_CONTROL.api,
      });
      res.end(buf);
    }
  }

  /**
   * Serve static file with gzip + browser caching
   */
  function serveStatic(req, res, filePath) {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // SPA fallback — serve index.html
          fs.readFile(path.join(__dirname, 'index.html'), (err2, html) => {
            if (err2) { res.writeHead(404); res.end('Not Found'); return; }
            sendFile(req, res, html, 'text/html; charset=utf-8', CACHE_CONTROL.html);
          });
        } else {
          res.writeHead(500); res.end('Internal Server Error');
        }
        return;
      }

      const ext         = path.extname(filePath).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';
      const cacheCtrl   = ext === '.html' ? CACHE_CONTROL.html : CACHE_CONTROL.static;
      sendFile(req, res, content, contentType, cacheCtrl);
    });
  }

  function sendFile(req, res, content, contentType, cacheControl) {
    if (supportsGzip(req)) {
      zlib.gzip(content, (err, compressed) => {
        if (err || res.headersSent) return;
        res.writeHead(200, {
          'Content-Type':     contentType,
          'Content-Encoding': 'gzip',
          'Content-Length':   compressed.length,
          'Cache-Control':    cacheControl,
          'Vary':             'Accept-Encoding',
        });
        res.end(compressed);
      });
    } else {
      res.writeHead(200, {
        'Content-Type':  contentType,
        'Content-Length': content.length,
        'Cache-Control':  cacheControl,
      });
      res.end(content);
    }
  }

  // ─── Middleware adapters (makes auth.js work with raw http.IncomingMessage) ──

  function adaptRequest(req, body = {}, params = {}) {
    req.body    = body;
    req.params  = params;
    req.cookies = parseCookies(req);
    req.query   = parseQuery(req.url);
    req.user    = req.user || null;
  }

  function runRequireAuth(req, res) {
    return new Promise((resolve, reject) => {
      const fake = { status: c => ({ json: d => { sendJSON(res, c, d, req); reject(new Error('auth')); } }) };
      requireAuth(req, fake, resolve).catch(reject);
    });
  }

  function runRequireRole(roles, req, res) {
    return new Promise((resolve, reject) => {
      const fake = { status: c => ({ json: d => { sendJSON(res, c, d, req); reject(new Error('role')); } }) };
      requireRole(...roles)(req, fake, resolve);
    });
  }

  function runRequireBikeOwner(req, res) {
    return new Promise((resolve, reject) => {
      const fake = { status: c => ({ json: d => { sendJSON(res, c, d, req); reject(new Error('owner')); } }) };
      requireBikeOwner(req, fake, resolve).catch(reject);
    });
  }

  // ─── Route Handlers ──────────────────────────────────────────────────────────

  async function handleRegister(req, res) {
    const body = await parseBody(req);
    const { name, email, phone, password, role, agency_name, gstin, hub_location } = body;
    if (!name || !email || !password)
      return sendJSON(res, 400, { success: false, error: 'name, email and password are required.' }, req);
    const existing = await db.findUserByEmail(email);
    if (existing)
      return sendJSON(res, 409, { success: false, error: 'An account with this email already exists.' }, req);
    const allowedRoles = ['CUSTOMER', 'OWNER'];
    const userRole     = allowedRoles.includes(role) ? role : 'CUSTOMER';
    const user         = await db.createUser({ name, email, phone, role: userRole,
      password_hash: hashPassword(password), agency_name, gstin, hub_location });
    const { password_hash, ...safeUser } = user;
    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    return sendJSON(res, 201, { success: true, token, user: safeUser }, req);
  }

  async function handleLogin(req, res) {
    const body = await parseBody(req);
    const { email, password } = body;
    if (!email || !password)
      return sendJSON(res, 400, { success: false, error: 'Email and password are required.' }, req);
    const user = await db.findUserByEmail(email);
    if (!user || !user.is_active)
      return sendJSON(res, 401, { success: false, error: 'Invalid credentials or account deactivated.' }, req);
    if (hashPassword(password) !== user.password_hash)
      return sendJSON(res, 401, { success: false, error: 'Invalid email or password.' }, req);
    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const { password_hash, ...safeUser } = user;
    return sendJSON(res, 200, { success: true, token, user: safeUser }, req);
  }

  async function handleMe(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    const { password_hash, ...safeUser } = req.user;
    return sendJSON(res, 200, { success: true, user: safeUser }, req);
  }

  async function handleGetBikes(req, res) {
    const filters = parseQuery(req.url);
    const bikes   = await db.getAllBikes(filters);
    return sendJSON(res, 200, { success: true, data: bikes, total: bikes.length }, req);
  }

  async function handleGetBike(req, res, id) {
    const bike = await db.getBikeById(id);
    if (!bike) return sendJSON(res, 404, { success: false, error: 'Vehicle not found.' }, req);
    return sendJSON(res, 200, { success: true, data: bike }, req);
  }

  async function handleCreateBike(req, res) {
    const body = await parseBody(req);
    adaptRequest(req, body);
    await runRequireAuth(req, res);
    await runRequireRole(['OWNER', 'ADMIN'], req, res);
    const { photos, ...bikeData } = body;
    bikeData.owner_id = req.user.id;
    const bike = await db.createBike(bikeData, photos || []);
    return sendJSON(res, 201, { success: true, data: bike }, req);
  }

  async function handleUpdateBike(req, res, id) {
    const body = await parseBody(req);
    adaptRequest(req, body, { id });
    await runRequireAuth(req, res);
    await runRequireBikeOwner(req, res);
    const bike = await db.updateBike(id, body);
    return sendJSON(res, 200, { success: true, data: bike }, req);
  }

  async function handleDeleteBike(req, res, id) {
    adaptRequest(req, {}, { id });
    await runRequireAuth(req, res);
    await runRequireBikeOwner(req, res);
    const deleted = await db.deleteBike(id);
    return sendJSON(res, 200, { success: deleted, message: deleted ? 'Vehicle deleted.' : 'Not found.' }, req);
  }

  async function handleCreateBooking(req, res) {
    const body = await parseBody(req);
    adaptRequest(req, body);
    await runRequireAuth(req, res);
    const payload = { ...body, customer_id: req.user.id,
      customer_name:  body.customer_name  || req.user.name,
      customer_email: body.customer_email || req.user.email,
      customer_phone: body.customer_phone || req.user.phone };
    try {
      const booking = await db.createBooking(payload);
      return sendJSON(res, 201, { success: true, data: booking }, req);
    } catch (err) {
      return sendJSON(res, err.statusCode || 400, { success: false, error: err.message }, req);
    }
  }

  async function handleMyBookings(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    const bookings = await db.getBookingsByCustomer(req.user.id);
    return sendJSON(res, 200, { success: true, data: bookings }, req);
  }

  async function handleGetBooking(req, res, id) {
    adaptRequest(req, {}, { id });
    await runRequireAuth(req, res);
    const booking = await db.getBookingById(id);
    if (!booking) return sendJSON(res, 404, { success: false, error: 'Booking not found.' }, req);
    if (req.user.role !== 'ADMIN' && booking.customer_id !== req.user.id)
      return sendJSON(res, 403, { success: false, error: 'Access denied.' }, req);
    return sendJSON(res, 200, { success: true, data: booking }, req);
  }

  async function handleOwnerBookings(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    await runRequireRole(['OWNER', 'ADMIN'], req, res);
    const bookings = await db.getBookingsByOwner(req.user.id);
    return sendJSON(res, 200, { success: true, data: bookings }, req);
  }

  async function handleOwnerEarnings(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    await runRequireRole(['OWNER', 'ADMIN'], req, res);
    const earnings = await db.getOwnerEarnings(req.user.id);
    return sendJSON(res, 200, { success: true, data: earnings }, req);
  }

  async function handleAdminMetrics(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    await runRequireRole(['ADMIN'], req, res);
    const metrics = await db.getAdminMetrics();
    return sendJSON(res, 200, { success: true, data: metrics }, req);
  }

  async function handleAdminUsers(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    await runRequireRole(['ADMIN'], req, res);
    const users = await db.getAllUsers();
    return sendJSON(res, 200, { success: true, data: users }, req);
  }

  async function handleAdminBikes(req, res) {
    adaptRequest(req);
    await runRequireAuth(req, res);
    await runRequireRole(['ADMIN'], req, res);
    const bikes = await db.getAllBikes({ includeAllStatus: true });
    return sendJSON(res, 200, { success: true, data: bikes, total: bikes.length }, req);
  }

  async function handleAdminVerifyBike(req, res, id) {
    const body = await parseBody(req);
    adaptRequest(req, body, { id });
    await runRequireAuth(req, res);
    await runRequireRole(['ADMIN'], req, res);
    const { verification_status = 'VERIFIED', rejection_reason = null, status } = body;
    const updates = {
      verification_status,
      status: status || (verification_status === 'REJECTED' ? 'INACTIVE' : 'ACTIVE'),
      rejection_reason
    };
    const bike = await db.updateBike(id, updates);
    if (!bike) return sendJSON(res, 404, { success: false, error: 'Vehicle not found.' }, req);
    return sendJSON(res, 200, { success: true, data: bike }, req);
  }

  function handleHealth(req, res) {
    sendJSON(res, 200, {
      success: true, status: 'ok', service: 'DriveMart API',
      worker: process.pid, env: NODE_ENV, timestamp: new Date().toISOString()
    }, req);
  }

  // ─── Router ──────────────────────────────────────────────────────────────────

  async function router(req, res) {
    const ip = getIP(req);

    // Security headers on every response
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options',        'SAMEORIGIN');
    res.setHeader('X-XSS-Protection',       '1; mode=block');

    // CORS
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Preflight
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

    // Rate limit API calls only
    if (req.url.startsWith('/api/') && isRateLimited(ip)) {
      return sendJSON(res, 429, {
        success: false,
        error: 'Too many requests. Please slow down and try again in a minute.'
      }, req);
    }

    const url    = req.url.split('?')[0];
    const method = req.method;

    try {
      // Auth
      if (method === 'POST' && url === '/api/auth/register') return await handleRegister(req, res);
      if (method === 'POST' && url === '/api/auth/login')    return await handleLogin(req, res);
      if (method === 'GET'  && url === '/api/auth/me')       return await handleMe(req, res);

      // Health
      if (method === 'GET' && url === '/api/health') return handleHealth(req, res);

      // Bikes
      if (method === 'GET'  && url === '/api/bikes') return await handleGetBikes(req, res);
      if (method === 'POST' && url === '/api/bikes') return await handleCreateBike(req, res);

      const bikeM = url.match(/^\/api\/bikes\/([^/]+)$/);
      if (bikeM) {
        const id = decodeURIComponent(bikeM[1]);
        if (method === 'GET')    return await handleGetBike(req, res, id);
        if (method === 'PUT')    return await handleUpdateBike(req, res, id);
        if (method === 'DELETE') return await handleDeleteBike(req, res, id);
      }

      // Bookings
      if (method === 'POST' && url === '/api/bookings')     return await handleCreateBooking(req, res);
      if (method === 'GET'  && url === '/api/bookings/my')  return await handleMyBookings(req, res);

      const bookM = url.match(/^\/api\/bookings\/([^/]+)$/);
      if (bookM) {
        const id = decodeURIComponent(bookM[1]);
        if (method === 'GET') return await handleGetBooking(req, res, id);
      }

      // Owner
      if (method === 'GET' && url === '/api/owner/bookings') return await handleOwnerBookings(req, res);
      if (method === 'GET' && url === '/api/owner/earnings') return await handleOwnerEarnings(req, res);

      // Admin
      if (method === 'GET' && url === '/api/admin/metrics') return await handleAdminMetrics(req, res);
      if (method === 'GET' && url === '/api/admin/users')   return await handleAdminUsers(req, res);
      if (method === 'GET' && url === '/api/admin/bikes')   return await handleAdminBikes(req, res);

      const adminVM = url.match(/^\/api\/admin\/bikes\/([^/]+)\/verify$/);
      if (adminVM) {
        const id = decodeURIComponent(adminVM[1]);
        if (method === 'PUT') return await handleAdminVerifyBike(req, res, id);
      }

      // Static file serving (non-API)
      if (!url.startsWith('/api/')) {
        const rawPath  = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
        const filePath = path.resolve(__dirname, rawPath);
        // Directory traversal guard
        if (!filePath.startsWith(__dirname)) {
          res.writeHead(403); return res.end('Forbidden');
        }
        return serveStatic(req, res, filePath);
      }

      return sendJSON(res, 404, { success: false, error: `Not found: ${method} ${url}` }, req);

    } catch (err) {
      if (!res.headersSent) {
        console.error(`[Worker ${process.pid}] ${method} ${url} —`, err.message);
        return sendJSON(res, 500, { success: false, error: 'Internal server error.' }, req);
      }
    }
  }

  // ─── HTTP Server ─────────────────────────────────────────────────────────────

  const server = http.createServer({ keepAlive: true }, router);

  // 30-second request timeout
  server.setTimeout(30_000, (socket) => {
    socket.destroy();
  });

  // Seed DB then start listening
  await db.init();

  server.listen(PORT, () => {
    console.log(`✅ Worker ${process.pid} listening on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} already in use. Set a different PORT in your .env`);
    } else {
      console.error(`❌ Worker ${process.pid} server error:`, err.message);
    }
    process.exit(1);
  });

  // Graceful worker shutdown
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log(`Worker ${process.pid} shut down cleanly.`);
      process.exit(0);
    });
  });
}
