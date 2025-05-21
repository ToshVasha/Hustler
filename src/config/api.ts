export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
    },
    services: {
      list: '/services',
      create: '/services',
      update: (id: string) => `/services/${id}`,
      delete: (id: string) => `/services/${id}`,
      details: (id: string) => `/services/${id}`,
    },
    bookings: {
      list: '/bookings',
      create: '/bookings',
      update: (id: string) => `/bookings/${id}`,
      cancel: (id: string) => `/bookings/${id}/cancel`,
    },
    reviews: {
      list: '/reviews',
      create: '/reviews',
      update: (id: string) => `/reviews/${id}`,
      delete: (id: string) => `/reviews/${id}`,
    },
    users: {
      profile: '/users/profile',
      update: '/users/profile',
      upload: '/users/upload',
    },
  },
  headers: {
    'Content-Type': 'application/json',
  },
}; 