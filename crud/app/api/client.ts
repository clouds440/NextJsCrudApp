import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// attach token automatically if stored
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Users API
export const usersAPI = {
  // Get all users
  getAll: (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') =>
    apiClient.get('/users', {
      params: { page, limit, sortBy, sortOrder }
    }),

  // Get user by ID
  getById: (id: string) => apiClient.get(`/users/${id}`),

  // Create user
  create: (userData: any) => apiClient.post('/users', userData),

  // Update user
  update: (id: string, userData: any) => apiClient.put(`/users/${id}`, userData),

  // Soft delete user
  delete: (id: string) => apiClient.delete(`/users/${id}`),

  // Permanent delete user
  permanentDelete: (id: string) => apiClient.delete(`/users/permanent/${id}`),

  // Enable user
  enable: (id: string) => apiClient.post(`/users/enable/${id}`),

  // Search users
  search: (query: string, page = 1, limit = 10) =>
    apiClient.get('/users/search', {
      params: { query, page, limit }
    }),

  // Get users by city
  getByCity: (city: string, page = 1, limit = 10) =>
    apiClient.get('/users/by-city', {
      params: { city, page, limit }
    }),

  // Get statistics
  getStatistics: () => apiClient.get('/users/statistics/dashboard')
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string, secret: string) =>
    apiClient.post('/auth/register', { email, password, secret })
};


export default apiClient;
