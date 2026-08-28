import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPromotions = () => api.get('/promotions');
export const getSummary = () => api.get('/promotions/summary');
export const createPromotion = (data) => api.post('/promotions', data);
export const updateStatus = (id, status) => api.patch(`/promotions/${id}/status`, { status });
export const deletePromotion = (id) => api.delete(`/promotions/${id}`);

export default api;