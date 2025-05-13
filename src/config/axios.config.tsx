import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://s9w1h85w-5173.inc1.devtunnels.ms', 
  timeout: 10000, // Optional: set a timeout for requests (in ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors (for auth tokens, error handling, etc.)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle global errors here (e.g., redirect on 401)
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default api;
