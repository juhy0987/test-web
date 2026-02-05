'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BookSearch from '@/components/BookSearch'
import StarRating from '@/components/StarRating'
import ImageUploader from '@/components/ImageUploader'
import TextEditor from '@/components/TextEditor'
import { Book, CreatePostData } from '@/lib/types'
import { createPost } from '@/lib/postApi'
import { extractHashtags, validateHashtagCount } from '@/lib/hashtags'

export default function CreatePostPage() {
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Extract hashtags from content
  const hashtags = extractHashtags(content)

  // Check if form is valid
  const isFormValid = () => {
    if (!selectedBook) return false
    if (rating === 0) return false
    if (content.length > 2000) return false
    if (hashtags.length > 10) return false
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      setError('모든 필수 항목을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const postData: CreatePostData = {
        book: selectedBook!,
        rating,
        content,
        images,
        hashtags: hashtags.slice(0, 10), // Limit to 10 hashtags
      }

      const newPost = await createPost(postData)
      
      // Redirect to post detail page
      router.push(`/posts/${newPost.id}`)
    } catch (err) {
      console.error('Post creation error:', err)
      setError(
        err instanceof Error
          ? err.message
          : '게시물 작성에 실패했습니다.'
      )
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            게시물 작성
          </h1>
          <p className="text-gray-600">
            읽은 책에 대한 당신의 생각을 공유해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Book Search */}
          <div>
            <BookSearch
              onSelectBook={setSelectedBook}
              selectedBook={selectedBook}
            />
          </div>

          {/* Rating */}
          {selectedBook && (
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                별점 <span className="text-red-500">*</span>
              </label>
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>
          )}

          {/* Content Editor */}
          {selectedBook && rating > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <TextEditor
                value={content}
                onChange={setContent}
                maxLength={2000}
                placeholder="이 책에 대한 당신의 생각을 자유롭게 적어주세요. '#'로 시작하는 단어는 해시태그로 자동 분류됩니다."
              />
            </div>
          )}

          {/* Image Uploader */}
          {selectedBook && rating > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <ImageUploader
                images={images}
                onImagesChange={setImages}
                maxImages={5}
              />
            </div>
          )}

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
                {hashtags.length > 10 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    +{hashtags.length - 10} (초과)
                  </span>
                )}
              </div>
              {hashtags.length > 10 && (
                <p className="text-sm text-red-600 mt-2">
                  해시태그는 최대 10개까지만 허용됩니다. 일부 해시태그를 제거해주세요.
                </p>
              )}
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
              {isSubmitting ? '발행 중...' : '발행하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
