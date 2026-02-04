'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Post } from '@/types/post';
import { postApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import Link from 'next/link';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Mock user ID - in real app, get from auth context
  const currentUserId = 'user-1';

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await postApi.getById(postId);
      setPost(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeleting(true);
    try {
      await postApi.delete(postId);
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
        <Link href="/" className="text-blue-600 hover:text-blue-700">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = post.userId === currentUserId;

  const renderContent = () => {
    const parts = [];
    const hashtagRegex = /#([\p{L}\p{N}_]+)/gu;
    let lastIndex = 0;
    let match;

    while ((match = hashtagRegex.exec(post.content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>{post.content.substring(lastIndex, match.index)}</span>
        );
      }

      parts.push(
        <span key={`tag-${match.index}`} className="hashtag">
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < post.content.length) {
      parts.push(<span key={`text-${lastIndex}`}>{post.content.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : post.content;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
              {post.updatedAt !== post.createdAt && (
                <p className="text-xs text-gray-400">Updated: {formatDate(post.updatedAt)}</p>
              )}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-44 bg-gray-200 rounded">
                <Image
                  src={post.book.coverImage}
                  alt={post.book.title}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.book.title}</h1>
              <p className="text-gray-600 mb-1">Author: {post.book.author}</p>
              <p className="text-gray-600 mb-4">Publisher: {post.book.publisher}</p>
              <div className="mb-4">
                <StarRating rating={post.rating} onChange={() => {}} readonly />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{renderContent()}</p>
          </div>
        </div>

        {/* Images */}
        {post.images.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.images.map((url, index) => (
                <div key={index} className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}