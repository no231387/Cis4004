import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const getFlashcards = (params = {}) => api.get('/flashcards', { params });
export const getDashboardStats = () => api.get('/flashcards/stats');
export const getFlashcard = (id) => api.get(`/flashcards/${id}`);
export const createFlashcard = (data) => api.post('/flashcards', data);
export const bulkImportFlashcards = (data) => api.post('/flashcards/import', data);
export const updateFlashcard = (id, data) => api.put(`/flashcards/${id}`, data);
export const deleteFlashcard = (id) => api.delete(`/flashcards/${id}`);
export const updateProficiency = (id, rating) => api.patch(`/flashcards/${id}/proficiency`, { rating });
export const reviewFlashcard = (id, rating) => api.patch(`/flashcards/${id}/review`, { rating });
