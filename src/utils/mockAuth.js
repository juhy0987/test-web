/**
 * Mock Authentication Utility
 * For development and testing purposes
 * 
 * This file provides utilities to set up mock authentication
 * without requiring a real backend authentication flow.
 */

/**
 * Set up mock authentication for testing
 * Call this in the browser console or in development code
 * 
 * @param {Object} user - Mock user object
 * @param {string} token - Mock auth token
 */
export const setMockAuth = (user = null, token = null) => {
  const mockUser = user || {
    id: 1,
    nickname: '테스트사용자',
    email: 'test@example.com',
    profilePicture: null,
  }

  const mockToken = token || 'mock-jwt-token-' + Date.now()

  localStorage.setItem('currentUser', JSON.stringify(mockUser))
  localStorage.setItem('authToken', mockToken)

  console.log('👤 Mock authentication set:', mockUser)
  console.log('🔐 Mock token:', mockToken)
  console.log('🔄 Reload the page to apply changes')

  return { user: mockUser, token: mockToken }
}

/**
 * Create multiple mock users for testing
 * @returns {Array} Array of mock user objects
 */
export const getMockUsers = () => {
  return [
    {
      id: 1,
      nickname: '김철수',
      email: 'kim@example.com',
      profilePicture: null,
    },
    {
      id: 2,
      nickname: '이영희',
      email: 'lee@example.com',
      profilePicture: null,
    },
    {
      id: 3,
      nickname: '박지성',
      email: 'park@example.com',
      profilePicture: null,
    },
    {
      id: 4,
      nickname: 'Developer',
      email: 'dev@example.com',
      profilePicture: null,
    },
  ]
}

/**
 * Clear mock authentication
 */
export const clearMockAuth = () => {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('authToken')
  console.log('🗑️ Mock authentication cleared')
  console.log('🔄 Reload the page to apply changes')
}

/**
 * Switch to a different mock user
 * @param {number} userId - ID of the mock user to switch to
 */
export const switchMockUser = (userId) => {
  const users = getMockUsers()
  const user = users.find(u => u.id === userId)
  
  if (user) {
    setMockAuth(user)
    return user
  } else {
    console.error(`User with ID ${userId} not found`)
    return null
  }
}

// Make functions available in browser console for easy testing
if (typeof window !== 'undefined') {
  window.mockAuth = {
    setMockAuth,
    clearMockAuth,
    switchMockUser,
    getMockUsers,
  }
  
  console.log('\n🔧 Mock Auth Utilities Available:')
  console.log('   window.mockAuth.setMockAuth() - Set up mock auth')
  console.log('   window.mockAuth.clearMockAuth() - Clear mock auth')
  console.log('   window.mockAuth.switchMockUser(id) - Switch to different user')
  console.log('   window.mockAuth.getMockUsers() - Get list of mock users\n')
}

export default {
  setMockAuth,
  clearMockAuth,
  switchMockUser,
  getMockUsers,
}
