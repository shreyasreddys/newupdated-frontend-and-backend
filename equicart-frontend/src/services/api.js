import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token and dynamically route microservices
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Route to the specific Spring Boot Microservice ports
  if (config.url.startsWith('/users')) {
    config.baseURL = 'http://localhost:8081/api';
  } else if (config.url.startsWith('/orders')) {
    config.baseURL = 'http://localhost:8082/api';
  } else if (config.url.startsWith('/products')) {
    config.baseURL = 'http://localhost:8083/api';
  } else {
    config.baseURL = 'http://localhost:8080/api'; // Default Gateway URL
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
