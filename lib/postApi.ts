import api from './api'
import { Post, CreatePostData, UpdatePostData } from './types'

/**
 * Create a new post
 */
export async function createPost(data: CreatePostData): Promise<Post> {
  const response = await api.post('/api/posts', data)
  return response.data
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: number,
  data: UpdatePostData
): Promise<Post> {
  const response = await api.put(`/api/posts/${postId}`, data)
  return response.data
}

/**
 * Delete a post
 */
export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/api/posts/${postId}`)
}

/**
 * Get a single post
 */
export async function getPost(postId: number): Promise<Post> {
  const response = await api.get(`/api/posts/${postId}`)
  return response.data
}

/**
 * Get all posts with pagination
 */
export async function getPosts(params?: {
  page?: number
  limit?: number
}): Promise<{ posts: Post[]; total: number }> {
  const response = await api.get('/api/posts', { params })
  return response.data
}
