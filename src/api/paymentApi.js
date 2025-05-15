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

// Payments API
export const paymentsApi = {
  // Get Stripe configuration (publishable key)
  getConfig: () => api.get('/api/payments/config/'),
  
  // Create a payment intent
  createPaymentIntent: (data) => api.post('/api/payments/create_payment_intent/', data),
  
  // Confirm a payment
  confirmPayment: (data) => api.post('/api/payments/confirm_payment/', data),
};

export default paymentsApi;
