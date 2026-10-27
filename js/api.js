/**
 * DriveMart API Client
 * Wraps fetch requests to the backend server.
 */

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('torqo_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  return headers;
}

export async function fetchVehicles(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_BASE}/bikes${queryParams ? '?' + queryParams : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch vehicles');
  const data = await response.json();
  return data.data;
}

export async function fetchVehicleById(id) {
  const response = await fetch(`${API_BASE}/bikes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch vehicle');
  const data = await response.json();
  return data.data;
}

export async function createBooking(bookingData) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create booking');
  return data.data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  if (data.token) localStorage.setItem('torqo_token', data.token);
  return data.user;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('torqo_token');
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  } catch {
    return null;
  }
}
