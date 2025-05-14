import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

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

// Users API - Note: This will need to be implemented in the Django backend
export const usersApi = {
  getAll: () => api.get('/api/users/'),
  getById: (id) => api.get(`/api/users/${id}/`),
  create: (user) => api.post('/api/users/', user),
  update: (id, user) => api.put(`/api/users/${id}/`, user),
  delete: (id) => api.delete(`/api/users/${id}/`),
};

export default {
  productsApi,
  ordersApi,
  tablesApi,
  usersApi,
};
