import { PaginationParams, SearchParams } from '../types/api';

// Convert pagination params to query string
export const getPaginationQuery = (params: PaginationParams): string => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('limit', params.limit.toString());
  
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  
  if (params.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }
  
  return queryParams.toString();
};

// Convert search params to query string
export const getSearchQuery = (params: SearchParams): string => {
  const queryParams = new URLSearchParams();
  
  // Add pagination params
  queryParams.append('page', params.page.toString());
  queryParams.append('limit', params.limit.toString());
  
  // Add search params
  if (params.query) {
    queryParams.append('query', params.query);
  }
  
  if (params.category) {
    queryParams.append('category', params.category);
  }
  
  if (params.location) {
    queryParams.append('location', params.location);
  }
  
  if (params.priceRange) {
    queryParams.append('minPrice', params.priceRange.min.toString());
    queryParams.append('maxPrice', params.priceRange.max.toString());
  }
  
  if (params.rating) {
    queryParams.append('rating', params.rating.toString());
  }
  
  if (params.availability) {
    queryParams.append('day', params.availability.day);
    queryParams.append('time', params.availability.time);
  }
  
  // Add sorting params
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  
  if (params.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }
  
  return queryParams.toString();
};

// Format date for API
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format time for API
export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0];
};

// Handle file upload
export const handleFileUpload = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<FormData> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add file metadata
  formData.append('filename', file.name);
  formData.append('mimetype', file.type);
  formData.append('size', file.size.toString());
  
  return formData;
};

// Validate file size and type
export const validateFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']
): boolean => {
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  return true;
};

// Handle API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An error occurred';
  }
};

// Generate cache key for API requests
export const generateCacheKey = (endpoint: string, params: any): string => {
  return `${endpoint}:${JSON.stringify(params)}`;
};

// Debounce function for API calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Retry function for failed API calls
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
}; 