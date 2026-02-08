import apiClient from './api'

/**
 * Book Service
 * Handles all book-related API calls
 */

/**
 * Search books by query
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query (title, author, or ISBN)
 * @param {string} params.queryType - Type of search ('title', 'author', 'isbn')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Results per page (default: 10)
 * @returns {Promise<Object>} - Search results with books array and pagination info
 */
export const searchBooks = async ({ query, queryType = 'title', page = 1, limit = 10 }) => {
  try {
    const response = await apiClient.get('/books/search', {
      params: {
        query,
        queryType,
        page,
        limit
      }
    })
    return response.data
  } catch (error) {
    console.error('Error searching books:', error)
    throw error
  }
}

/**
 * Get book details by ISBN
 * @param {string} isbn - ISBN of the book
 * @returns {Promise<Object>} - Book details
 */
export const getBookByISBN = async (isbn) => {
  try {
    const response = await apiClient.get(`/books/${isbn}`)
    return response.data
  } catch (error) {
    console.error('Error fetching book details:', error)
    throw error
  }
}
