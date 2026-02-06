import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    likeCount: number;
    isLiked: boolean;
  };
}

export const postsApi = {
  /**
   * Get all posts
   */
  getPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get('/api/posts');
    return response.data.data || response.data;
  },

  /**
   * Get a single post by ID
   */
  getPost: async (postId: number): Promise<Post> => {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data.data || response.data;
  },

  /**
   * Like a post
   */
  likePost: async (postId: number): Promise<LikeResponse> => {
    const response = await apiClient.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  /**
   * Unlike a post
   */
  unlikePost: async (postId: number): Promise<LikeResponse> => {
    const response = await apiClient.delete(`/api/posts/${postId}/like`);
    return response.data;
  },
};

export default apiClient;
