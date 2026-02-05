'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import StarRating from '@/components/StarRating'
import { Post } from '@/lib/types'
import { getPost, deletePost } from '@/lib/postApi'

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      const data = await getPost(Number(postId))
      setPost(data)
    } catch (err) {
      console.error('Failed to load post:', err)
      setError(
        err instanceof Error
          ? err.message
          : '게시물을 불러오지 못했습니다.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)

    try {
      await deletePost(Number(postId))
      alert('게시물이 삭제되었습니다.')
      router.push('/')
    } catch (err) {
      console.error('Failed to delete post:', err)
      alert(
        err instanceof Error
          ? err.message
          : '게시물 삭제에 실패했습니다.'
      )
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '게시물을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:underline"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/posts/${postId}/edit`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>

        {/* Book Info */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-44 flex-shrink-0">
              <Image
                src={post.book.coverImage}
                alt={post.book.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {post.book.title}
              </h1>
              <p className="text-gray-600 mb-1">{post.book.author}</p>
              <p className="text-gray-500 text-sm mb-4">{post.book.publisher}</p>
              <StarRating rating={post.rating} onRatingChange={() => {}} readonly />
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`게시물 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              해시태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/search?hashtag=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Post Meta */}
        <div className="text-center text-sm text-gray-500 mt-6">
          작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}
          {post.updatedAt !== post.createdAt && (
            <>
              {' '}
              (수정됨: {new Date(post.updatedAt).toLocaleDateString('ko-KR')})
            </>
          )}
        </div>
      </div>
    </div>
  )
}
