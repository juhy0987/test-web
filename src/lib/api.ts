import axios from 'axios';
import { Book, BookSearchParams, BookSearchResponse } from '@/types/book';
import { Post, CreatePostRequest, UpdatePostRequest } from '@/types/post';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Book API
export const bookApi = {
  search: async (params: BookSearchParams): Promise<BookSearchResponse> => {
    const response = await api.get('/books/search', { params });
    return response.data;
  },
};

// Post API
export const postApi = {
  create: async (data: CreatePostRequest): Promise<Post> => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  getById: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdatePostRequest): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  getAll: async (page: number = 1, limit: number = 20): Promise<{ posts: Post[], total: number }> => {
    const response = await api.get('/posts', { params: { page, limit } });
    return response.data;
  },
};

// Image Upload API
export const imageApi = {
  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },
};

export default api;