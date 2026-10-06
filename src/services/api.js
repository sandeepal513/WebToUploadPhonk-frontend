const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchTracks(subgenre = 'All', search = '') {
  try {
    const params = new URLSearchParams();
    if (subgenre && subgenre !== 'All') params.append('subgenre', subgenre);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/tracks?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch tracks');
    const data = await response.json();
    return data.tracks;
  } catch (err) {
    console.warn('Backend API unreachable, using local fallback:', err.message);
    return null;
  }
}

export async function uploadTrackApi(formData, token) {
  try {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/tracks`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to upload track');
    }
    return await response.json();
  } catch (err) {
    console.error('API Upload error:', err);
    throw err;
  }
}

export async function toggleLikeApi(trackId, token) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/tracks/${trackId}/like`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) throw new Error('Like failed');
    return await response.json();
  } catch (err) {
    console.warn('API Like error:', err);
    return null;
  }
}

export async function registerUserApi(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUserApi(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
