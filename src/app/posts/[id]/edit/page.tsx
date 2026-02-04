'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Post, UpdatePostRequest } from '@/types/post';
import { postApi } from '@/lib/api';
import { extractHashtags } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import ImageUploader from '@/components/ImageUploader';
import ContentEditor from '@/components/ContentEditor';
import Link from 'next/link';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - in real app, get from auth context
  const currentUserId = 'user-1';

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await postApi.getById(postId);
      
      // Check if user owns this post
      if (data.userId !== currentUserId) {
        router.push(`/posts/${postId}`);
        return;
      }

      setPost(data);
      setRating(data.rating);
      setContent(data.content);
      setImages(data.images);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const hashtags = extractHashtags(content);
      
      const updateData: UpdatePostRequest = {
        rating,
        content,
        images,
        hashtags,
      };

      await postApi.update(postId, updateData);
      router.push(`/posts/${postId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/" className="text-blue-600 hover:text-blue-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/posts/${postId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Post
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Display (Read-only) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Book</h2>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-32 bg-gray-200 rounded">
                {post?.book.coverImage && (
                  <Image
                    src={post.book.coverImage}
                    alt={post.book.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{post?.book.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Author: {post?.book.author}</p>
              <p className="text-sm text-gray-600">Publisher: {post?.book.publisher}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rating <span className="text-red-500">*</span>
          </h2>
          <StarRating rating={rating} onChange={setRating} />
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
          <Link
            href={`/posts/${postId}`}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}