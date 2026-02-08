import React, { useState, useEffect, useCallback } from 'react'
import { searchBooks } from '../../services/bookService'
import './BookSearch.css'

/**
 * BookSearch Component
 * Allows users to search for books and select one for their post
 * 
 * @param {Object} props
 * @param {Function} props.onBookSelect - Callback when a book is selected
 * @param {Object} props.selectedBook - Currently selected book (optional)
 */
const BookSearch = ({ onBookSelect, selectedBook }) => {
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('title')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)

  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, queryType])

  const handleSearch = async () => {
    if (query.trim().length < 2) {
      setError('검색어를 2자 이상 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await searchBooks({
        query: query.trim(),
        queryType,
        page: 1,
        limit: 10
      })
      
      setResults(data.books || [])
      setShowResults(true)
    } catch (err) {
      console.error('Book search error:', err)
      setError('도서 검색 중 오류가 발생했습니다. 다시 시도해주세요.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookSelect = (book) => {
    onBookSelect(book)
    setShowResults(false)
    setQuery('')
  }

  const handleClearSelection = () => {
    onBookSelect(null)
  }

  // If a book is already selected, show the selected book card
  if (selectedBook) {
    return (
      <div className="book-search">
        <div className="book-search__selected">
          <h3 className="book-search__selected-title">선택한 도서</h3>
          <div className="book-search__selected-card">
            <img 
              src={selectedBook.coverImageUrl || '/placeholder-book.png'} 
              alt={selectedBook.title}
              className="book-search__selected-cover"
            />
            <div className="book-search__selected-info">
              <h4 className="book-search__selected-book-title">{selectedBook.title}</h4>
              <p className="book-search__selected-author">{selectedBook.author}</p>
              <p className="book-search__selected-publisher">{selectedBook.publisher}</p>
            </div>
            <button 
              type="button"
              className="book-search__change-btn"
              onClick={handleClearSelection}
            >
              변경
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="book-search">
      <div className="book-search__header">
        <h3 className="book-search__title">어떤 책에 대한 이야기인가요?</h3>
        <p className="book-search__subtitle">도서를 검색하고 선택해주세요</p>
      </div>

      <div className="book-search__input-wrapper">
        <div className="book-search__input-group">
          <select 
            className="book-search__select"
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="author">저자</option>
            <option value="isbn">ISBN</option>
          </select>
          
          <input
            type="text"
            className="book-search__input"
            placeholder={`도서 ${queryType === 'title' ? '제목' : queryType === 'author' ? '저자' : 'ISBN'}을 입력하세요`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />
          
          <button 
            type="button"
            className="book-search__btn"
            onClick={handleSearch}
            disabled={loading || query.length < 2}
          >
            {loading ? (
              <div className="book-search__spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <div className="book-search__error">
            {error}
          </div>
        )}
      </div>

      {showResults && (
        <div className="book-search__results">
          {loading && (
            <div className="book-search__loading">
              <div className="book-search__spinner"></div>
              <p>검색 중...</p>
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="book-search__no-results">
              <p>검색 결과가 없습니다.</p>
              <p className="book-search__no-results-hint">다른 검색어로 시도해보세요.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="book-search__list">
              {results.map((book) => (
                <div 
                  key={book.isbn}
                  className="book-search__item"
                  onClick={() => handleBookSelect(book)}
                >
                  <img 
                    src={book.coverImageUrl || '/placeholder-book.png'} 
                    alt={book.title}
                    className="book-search__item-cover"
                  />
                  <div className="book-search__item-info">
                    <h4 className="book-search__item-title">{book.title}</h4>
                    <p className="book-search__item-author">{book.author}</p>
                    <p className="book-search__item-publisher">{book.publisher}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BookSearch
