'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  validateImageFile,
  createImagePreview,
  uploadImage,
} from '@/lib/imageUpload'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    // Check max images limit
    if (images.length + files.length > maxImages) {
      setError(`최대 ${maxImages}개까지 업로드 가능합니다.`)
      return
    }

    setError('')
    setUploading(true)

    try {
      const newImages: string[] = []

      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file)
        if (!validation.valid) {
          setError(validation.error || '')
          continue
        }

        // Create preview first
        const preview = await createImagePreview(file)
        
        // For now, just use preview URLs
        // In production, you would upload to server:
        // const url = await uploadImage(file)
        newImages.push(preview)
      }

      onImagesChange([...images, ...newImages])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.'
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    setError('')
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          이미지 첨부
          <span className="text-gray-500 ml-2">
            ({images.length}/{maxImages})
          </span>
        </label>
        <span className="text-xs text-gray-500">
          JPG, PNG, GIF / 5MB 이하
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square group">
            <Image
              src={image}
              alt={`첫부 이미지 ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="이미지 삭제"
            >
              <svg
                className="w-4 h-4"
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
        ))}

        {/* Add Image Button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="text-xs">업로드 중...</span>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs">추가</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  )
}
