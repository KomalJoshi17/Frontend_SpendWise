import axios from 'axios';

// FIXED ENV VARIABLE (Matches Vercel env)
const API_URL = import.meta.env.VITE_API_BASE_URL;

// FALLBACK FOR DEV ONLY
const BASE_URL = API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
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

// AUTH APIs
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),

  // FIXED GOOGLE OAUTH (NO LOCALHOST)
  googleAuth: () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  },
};

// TRANSACTION APIs
export const transactionAPI = {
  create: (data) => api.post('/api/transactions', data),
  getAll: () => api.get('/api/transactions'),
  update: (id, data) => api.put(`/api/transactions/${id}`, data),
  delete: (id) => api.delete(`/api/transactions/${id}`),
};

// INSIGHTS APIs
export const insightsAPI = {
  getMonthly: (income) =>
    api.get('/api/insights/monthly', income ? { params: { income } } : {}),
};

// PROFILE APIs
export const profileAPI = {
  get: () => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
  changePassword: (data) => api.put('/api/profile/password', data),
  requestEmailChange: (newEmail) =>
    api.post('/api/profile/request-email-change', { newEmail }),
  verifyEmailOTP: (otp) =>
    api.post('/api/profile/verify-email-otp', { otp }),
};

// AI APIs
export const aiAPI = {
  categorize: (description) => api.post('/api/ai/categorize', { description }),
  getSavingsRecommendations: () => api.get('/api/ai/savings'),
  chat: (message, context) => api.post('/api/ai/chat', { message, context }),
  getTip: () => api.post('/api/ai/tip'),
  getTwin: () => api.get('/api/ai/twin'),
};

export default api;
