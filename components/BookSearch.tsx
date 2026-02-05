'use client'

import { useState, useEffect, useRef } from 'react'
import { Book } from '@/lib/types'
import { searchBooks } from '@/lib/bookApi'
import Image from 'next/image'

interface BookSearchProps {
  onSelectBook: (book: Book) => void
  selectedBook: Book | null
}

export default function BookSearch({
  onSelectBook,
  selectedBook,
}: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'author' | 'isbn'>(
    'title'
  )
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('검색어를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')
    setShowResults(true)

    try {
      const books = await searchBooks({ query, searchType })
      setResults(books)
      if (books.length === 0) {
        setError('검색 결과가 없습니다.')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '검색에 실패했습니다.'
      )
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBook = (book: Book) => {
    onSelectBook(book)
    setShowResults(false)
    setQuery('')
    setResults([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (selectedBook) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-24 h-32 flex-shrink-0">
            <Image
              src={selectedBook.coverImage}
              alt={selectedBook.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{selectedBook.title}</h3>
            <p className="text-gray-600 text-sm mb-1">{selectedBook.author}</p>
            <p className="text-gray-500 text-sm">{selectedBook.publisher}</p>
          </div>
          <button
            onClick={() => onSelectBook(null!)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="책 선택 취소"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            어떤 책에 대한 이야기인가요?
          </h2>
          <p className="text-gray-600">
            책을 검색하고 선택해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as 'title' | 'author' | 'isbn')
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">제목</option>
              <option value="author">저자</option>
              <option value="isbn">ISBN</option>
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="검색어를 입력하세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '검색 중...' : '검색'}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((book) => (
            <button
              key={book.isbn}
              onClick={() => handleSelectBook(book)}
              className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
            >
              <div className="relative w-16 h-20 flex-shrink-0">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {book.title}
                </h4>
                <p className="text-sm text-gray-600 truncate">{book.author}</p>
                <p className="text-sm text-gray-500 truncate">
                  {book.publisher}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
