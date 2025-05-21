import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Types
interface ApiError {
  message: string;
  code: string;
  status: number;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken,
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle different error types
    const errorMessage = error.response?.data?.message || 'An error occurred';
    const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';
    
    switch (error.response?.status) {
      case 400:
        toast.error('Invalid request: ' + errorMessage);
        break;
      case 401:
        toast.error('Unauthorized: Please login again');
        break;
      case 403:
        toast.error('Access denied: ' + errorMessage);
        break;
      case 404:
        toast.error('Resource not found: ' + errorMessage);
        break;
      case 500:
        toast.error('Server error: Please try again later');
        break;
      default:
        toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    api.get<T, ApiResponse<T>>(url, config),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T, ApiResponse<T>>(url, data, config),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T, ApiResponse<T>>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T, ApiResponse<T>>(url, config),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T, ApiResponse<T>>(url, data, config),
};

export default apiClient; 