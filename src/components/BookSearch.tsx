'use client';

import { useState } from 'react';
import { Book, BookSearchParams } from '@/types/book';
import { bookApi } from '@/lib/api';
import BookSearchResult from './BookSearchResult';

interface BookSearchProps {
  onSelectBook: (book: Book) => void;
}

export default function BookSearch({ onSelectBook }: BookSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'author' | 'isbn'>('title');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params: BookSearchParams = {
        query: searchQuery,
        searchType,
        page: 1,
        limit: 20,
      };

      const response = await bookApi.search(params);
      setResults(response.books);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search books. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search for a Book</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter book title, author, or ISBN..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'title' | 'author' | 'isbn')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="isbn">ISBN</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching books...</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">No books found. Try a different search query.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Found {results.length} book{results.length !== 1 ? 's' : ''}
          </h3>
          <div className="grid gap-4">
            {results.map((book) => (
              <BookSearchResult
                key={book.isbn}
                book={book}
                onSelect={onSelectBook}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}