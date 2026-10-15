import { readString } from './storage';

export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, auth = false, signal } = {}) {
  if (!API_URL) {
    throw new ApiError('The API is not configured. Use the demo account to explore EduLearn.', 0);
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = readString('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(data?.message || 'Something went wrong', res.status);
  }
  return data;
}
