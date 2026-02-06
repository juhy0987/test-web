/**
 * Authentication utilities
 */

/**
 * Get current user from localStorage
 * @returns {Object|null} - Current user object or null
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing current user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  const user = getCurrentUser()
  return !!(token && user)
}

/**
 * Check if current user is the author of a comment
 * @param {number} authorId - The ID of the comment author
 * @returns {boolean} - True if current user is the author
 */
export const isCommentAuthor = (authorId) => {
  const currentUser = getCurrentUser()
  return currentUser && currentUser.id === authorId
}

/**
 * Set current user and auth token
 * @param {Object} user - User object
 * @param {string} token - Authentication token
 */
export const setAuth = (user, token) => {
  localStorage.setItem('currentUser', JSON.stringify(user))
  localStorage.setItem('authToken', token)
}

/**
 * Clear authentication
 */
export const clearAuth = () => {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('authToken')
}
