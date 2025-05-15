import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: () => api.get('/api/products/'),
  getById: (id) => api.get(`/api/products/${id}/`),
  create: (product) => api.post('/api/products/', product),
  update: (id, product) => api.put(`/api/products/${id}/`, product),
  delete: (id) => api.delete(`/api/products/${id}/`),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get('/api/orders/'),
  getById: (id) => api.get(`/api/orders/${id}/`),
  getMyOrders: () => api.get('/api/orders/my_orders/'),
  create: (order) => api.post('/api/orders/', order),
  update: (id, order) => api.put(`/api/orders/${id}/`, order),
  delete: (id) => api.delete(`/api/orders/${id}/`),
};

// Tables API
export const tablesApi = {
  getAll: () => api.get('/api/tables/'),
  getById: (id) => api.get(`/api/tables/${id}/`),
  create: (table) => api.post('/api/tables/', table),
  update: (id, table) => api.put(`/api/tables/${id}/`, table),
  delete: (id) => api.delete(`/api/tables/${id}/`),
};

// Users API and Authentication
export const authApi = {
  // Register a new user
  register: (userData) => api.post('/api/users/', userData),
  
  // Login user
  login: (credentials) => api.post('/api/users/login/', credentials),
  
  // Get all users (admin only)
  getAll: () => api.get('/api/users/'),
  
  // Get user by ID (admin only)
  getById: (id) => api.get(`/api/users/${id}/`),
  
  // Update user
  update: (id, userData) => api.put(`/api/users/${id}/`, userData),
  
  // Delete user (admin only)
  delete: (id) => api.delete(`/api/users/${id}/`),
};

export default {
  productsApi,
  ordersApi,
  tablesApi,
  authApi,
};
