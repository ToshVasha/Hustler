import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'consumer' | 'business';
  phone?: string;
  location?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  provider_id: string;
  category: string;
  image_url?: string;
  rating?: number;
}

export interface Booking {
  id: string;
  service_id: string;
  consumer_id: string;
  provider_id: string;
  date: string;
  time: string;
  status: string;
  price: number;
}

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const services = {
  getAll: async (category?: string, provider_id?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (provider_id) params.append('provider_id', provider_id);
    const response = await api.get(`/services?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  create: async (service: Omit<Service, 'id'>) => {
    const response = await api.post('/services', service);
    return response.data;
  },
};

export const bookings = {
  getAll: async (user_id: string, user_type: 'consumer' | 'business') => {
    const response = await api.get(`/bookings?user_id=${user_id}&user_type=${user_type}`);
    return response.data;
  },

  create: async (booking: Omit<Booking, 'id'>) => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  updateStatus: async (booking_id: string, status: string) => {
    const response = await api.put(`/bookings/${booking_id}`, { status });
    return response.data;
  },
};

export default api; 