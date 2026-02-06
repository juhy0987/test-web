import apiClient from './api'

/**
 * Comment Service
 * Handles all comment-related API calls
 */
const commentService = {
  /**
   * Get all comments for a specific post
   * @param {number} postId - The ID of the post
   * @returns {Promise} - Promise with comments data
   */
  getComments: async (postId) => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  },

  /**
   * Create a new comment or reply
   * @param {number} postId - The ID of the post
   * @param {Object} commentData - Comment data {content, parentCommentId?}
   * @returns {Promise} - Promise with created comment data
   */
  createComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData)
      return response.data
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  /**
   * Update an existing comment
   * @param {number} commentId - The ID of the comment to update
   * @param {Object} updateData - Update data {content}
   * @returns {Promise} - Promise with updated comment data
   */
  updateComment: async (commentId, updateData) => {
    try {
      const response = await apiClient.patch(`/api/comments/${commentId}`, updateData)
      return response.data
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  /**
   * Delete a comment
   * @param {number} commentId - The ID of the comment to delete
   * @returns {Promise} - Promise with deletion result
   */
  deleteComment: async (commentId) => {
    try {
      const response = await apiClient.delete(`/api/comments/${commentId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },
}

export default commentService
