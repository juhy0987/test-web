'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import BookSearch from '@/components/BookSearch'
import StarRating from '@/components/StarRating'
import ImageUploader from '@/components/ImageUploader'
import TextEditor from '@/components/TextEditor'
import { Book, UpdatePostData } from '@/lib/types'
import { getPost, updatePost } from '@/lib/postApi'
import { extractHashtags } from '@/lib/hashtags'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      const post = await getPost(Number(postId))
      setSelectedBook(post.book)
      setRating(post.rating)
      setContent(post.content)
      setImages(post.images || [])
    } catch (err) {
      console.error('Failed to load post:', err)
      setError('게시물을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const hashtags = extractHashtags(content)

  const isFormValid = () => {
    if (!selectedBook) return false
    if (rating === 0) return false
    if (content.length > 2000) return false
    if (hashtags.length > 10) return false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      setError('모든 필수 항목을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const updateData: UpdatePostData = {
        rating,
        content,
        images,
        hashtags: hashtags.slice(0, 10),
      }

      await updatePost(Number(postId), updateData)
      router.push(`/posts/${postId}`)
    } catch (err) {
      console.error('Post update error:', err)
      setError(
        err instanceof Error
          ? err.message
          : '게시물 수정에 실패했습니다.'
      )
      setIsSubmitting(false)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            게시물 수정
          </h1>
          <p className="text-gray-600">
            게시물을 수정할 수 있습니다. (책 정보는 변경할 수 없습니다)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Book Info (Read-only) */}
          <div>
            <BookSearch
              onSelectBook={() => {}}
              selectedBook={selectedBook}
            />
          </div>

          {/* Rating */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              별점 <span className="text-red-500">*</span>
            </label>
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          </div>

          {/* Content Editor */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <TextEditor
              value={content}
              onChange={setContent}
              maxLength={2000}
              placeholder="이 책에 대한 당신의 생각을 자유롭게 적어주세요."
            />
          </div>

          {/* Image Uploader */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              maxImages={5}
            />
          </div>

          {/* Hashtag Display */}
          {hashtags.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                해시태그 ({hashtags.length}/10)
              </h3>
              <div className="flex flex-wrap gap-2">
                {hashtags.slice(0, 10).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
