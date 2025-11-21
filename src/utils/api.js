import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  googleAuth: () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  },
};

export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  getAll: () => api.get('/transactions'),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const insightsAPI = {
  getMonthly: (income) =>
    api.get('/insights/monthly', income ? { params: { income } } : {}),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),

  requestEmailChange: (newEmail) =>
    api.post('/profile/request-email-change', { newEmail }),

  verifyEmailOTP: (otp) =>
    api.post('/profile/verify-email-otp', { otp }),
};

export const aiAPI = {
  categorize: (description) => api.post('/ai/categorize', { description }),
  getSavingsRecommendations: () => api.get('/ai/savings'),
  chat: (message, context) => api.post('/ai/chat', { message, context }),
  getTip: () => api.post('/ai/tip'),
  getTwin: () => api.get('/ai/twin'),
};

export default api;
