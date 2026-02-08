import apiClient from './api'

/**
 * Post Service
 * Handles all post-related API calls
 */

/**
 * Create a new post
 * @param {Object} postData - Post data including book info, rating, content, and images
 * @returns {Promise<Object>} - Created post data
 */
export const createPost = async (postData) => {
  try {
    const formData = new FormData()
    
    // Add book information
    formData.append('isbn', postData.isbn)
    formData.append('bookTitle', postData.bookTitle)
    formData.append('bookAuthor', postData.bookAuthor)
    formData.append('publisher', postData.publisher)
    formData.append('coverImageUrl', postData.coverImageUrl)
    
    // Add rating and content
    formData.append('rating', postData.rating)
    formData.append('content', postData.content)
    
    // Add images if any
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image, index) => {
        formData.append('images', image)
      })
    }
    
    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

/**
 * Get a single post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object>} - Post data
 */
export const getPost = async (postId) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}

/**
 * Update an existing post
 * @param {number} postId - Post ID
 * @param {Object} updateData - Updated post data
 * @returns {Promise<Object>} - Updated post data
 */
export const updatePost = async (postId, updateData) => {
  try {
    const formData = new FormData()
    
    // Add rating and content if provided
    if (updateData.rating !== undefined) {
      formData.append('rating', updateData.rating)
    }
    if (updateData.content !== undefined) {
      formData.append('content', updateData.content)
    }
    
    // Add new images if any
    if (updateData.images && updateData.images.length > 0) {
      updateData.images.forEach((image, index) => {
        formData.append('images', image)
      })
    }
    
    // Add images to remove if any
    if (updateData.removeImageIds && updateData.removeImageIds.length > 0) {
      formData.append('removeImageIds', JSON.stringify(updateData.removeImageIds))
    }
    
    const response = await apiClient.patch(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

/**
 * Delete a post
 * @param {number} postId - Post ID
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  try {
    await apiClient.delete(`/posts/${postId}`)
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

/**
 * Get all posts with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Results per page (default: 20)
 * @returns {Promise<Object>} - Posts array with pagination info
 */
export const getPosts = async ({ page = 1, limit = 20 } = {}) => {
  try {
    const response = await apiClient.get('/posts', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

/**
 * Get posts by user
 * @param {number} userId - User ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Posts array with pagination info
 */
export const getUserPosts = async (userId, { page = 1, limit = 20 } = {}) => {
  try {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user posts:', error)
    throw error
  }
}
