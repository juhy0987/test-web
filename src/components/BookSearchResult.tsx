'use client';

import Image from 'next/image';
import { Book } from '@/types/book';

interface BookSearchResultProps {
  book: Book;
  onSelect: (book: Book) => void;
}

export default function BookSearchResult({ book, onSelect }: BookSearchResultProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-24 h-32 bg-gray-200 rounded">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover rounded"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>No Image</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h4>
          <p className="text-sm text-gray-600 mt-1">Author: {book.author}</p>
          <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
          {book.publicationDate && (
            <p className="text-sm text-gray-500 mt-1">
              Published: {new Date(book.publicationDate).getFullYear()}
            </p>
          )}
          {book.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description}</p>
          )}
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => onSelect(book)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}