import axios from 'axios';
import { Experience, Slot, BookingRequest, BookingResponse, PromoValidationResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const experienceAPI = {
  getAll: async (): Promise<Experience[]> => {
    const response = await api.get('/experiences');
    return response.data;
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },

  getSlots: async (id: number): Promise<Slot[]> => {
    const response = await api.get(`/experiences/${id}/slots`);
    return response.data;
  },
};

export const bookingAPI = {
  create: async (data: BookingRequest): Promise<BookingResponse> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getById: async (bookingId: string): Promise<any> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },
};

export const promoAPI = {
  validate: async (code: string): Promise<PromoValidationResponse> => {
    const response = await api.post('/promo/validate', { code });
    return response.data;
  },
};

export default api;