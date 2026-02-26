// API Service with Performance Tracking & Request Optimization
import { debounce, requestCache, fetchWithRetry } from '../utils/requestOptimization';
import { perfMonitor } from '../utils/performanceMonitor';

const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Wrapper to track API performance
const fetchWithTracking = async (endpoint, options = {}) => {
  const startTime = performance.now();
  try {
    const response = await fetchWithRetry(`${API_URL}${endpoint}`, {
      ...options,
      headers: getAuthHeaders()
    });
    const duration = performance.now() - startTime;
    perfMonitor.trackApiCall(endpoint, duration);
    return response;
  } catch (err) {
    const duration = performance.now() - startTime;
    perfMonitor.trackApiCall(endpoint, duration);
    throw err;
  }
};

export const authAPI = {
  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetchWithTracking('/auth/logout', { method: 'POST' });
    return response.json();
  },

  getMe: async () => {
    const response = await fetchWithTracking('/auth/me');
    return response.json();
  }
};

export const adminAPI = {
  getUsers: async () => {
    // Check cache first
    const cacheKey = 'admin/users';
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey);
    }

    const response = await fetchWithTracking('/admin/users');
    const data = await response.json();
    
    // Cache the result
    requestCache.set(cacheKey, data);
    return data;
  },

  getStats: async () => {
    const cacheKey = 'admin/stats';
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey);
    }

    const response = await fetchWithTracking('/admin/stats');
    const data = await response.json();
    requestCache.set(cacheKey, data);
    return data;
  },

  createUser: async (user) => {
    const response = await fetchWithTracking('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
    // Clear cache after mutation
    requestCache.clear();
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetchWithTracking(`/admin/users/${id}`, {
      method: 'DELETE'
    });
    // Clear cache after mutation
    requestCache.clear();
    return response.json();
  },

  // Debounced search for users
  searchUsers: debounce(async (query) => {
    if (!query) return { users: [] };
    const response = await fetchWithTracking(`/admin/users?search=${query}`);
    return response.json();
  }, 500)
};

export default authAPI;
