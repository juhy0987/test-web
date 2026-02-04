'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { CreatePostRequest } from '@/types/post';
import { postApi } from '@/lib/api';
import { extractHashtags } from '@/lib/utils';
import BookSearch from '@/components/BookSearch';
import StarRating from '@/components/StarRating';
import ImageUploader from '@/components/ImageUploader';
import ContentEditor from '@/components/ContentEditor';
import Image from 'next/image';

export default function CreatePostPage() {
  const router = useRouter();
  const [step, setStep] = useState<'search' | 'editor'>('search');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setStep('editor');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedBook(null);
  };

  const canPublish = selectedBook !== null && rating > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canPublish) {
      setError('Please select a book and provide a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const hashtags = extractHashtags(content);
      
      const postData: CreatePostRequest = {
        book: {
          isbn: selectedBook!.isbn,
          title: selectedBook!.title,
          author: selectedBook!.author,
          publisher: selectedBook!.publisher,
          coverImage: selectedBook!.coverImage,
        },
        rating,
        content,
        images,
        hashtags,
      };

      const newPost = await postApi.create(postData);
      router.push(`/posts/${newPost.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      setSubmitting(false);
    }
  };

  if (step === 'search') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">First, search for the book you want to review</p>
        </div>
        <BookSearch onSelectBook={handleSelectBook} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={handleBackToSearch}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Book Display */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Selected Book</h2>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-32 bg-gray-200 rounded">
                {selectedBook?.coverImage && (
                  <Image
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{selectedBook?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Author: {selectedBook?.author}</p>
              <p className="text-sm text-gray-600">Publisher: {selectedBook?.publisher}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rating <span className="text-red-500">*</span>
          </h2>
          <StarRating rating={rating} onChange={setRating} />
          {rating === 0 && (
            <p className="text-sm text-gray-500 mt-2">Please select a rating (required)</p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Review</h2>
          <ContentEditor content={content} onChange={setContent} maxLength={2000} />
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Images</h2>
          <ImageUploader images={images} onChange={setImages} maxImages={5} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canPublish || submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}