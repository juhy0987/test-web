import React, { useState, useRef } from 'react'
import './ImageUploader.css'

/**
 * ImageUploader Component
 * Allows users to upload up to 5 images with preview and delete functionality
 * 
 * @param {Object} props
 * @param {Array} props.images - Array of image files
 * @param {Function} props.onImagesChange - Callback when images change
 * @param {number} props.maxImages - Maximum number of images (default: 5)
 * @param {number} props.maxSizeMB - Maximum file size in MB (default: 5)
 */
const ImageUploader = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  maxSizeMB = 5 
}) => {
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      return 'JPG, PNG, GIF 형식만 업로드 가능합니다.'
    }

    if (file.size > maxSizeBytes) {
      return `파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`
    }

    return null
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setError(null)

    // Check total count
    if (images.length + files.length > maxImages) {
      setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    // Validate each file
    const validFiles = []
    const newPreviews = []

    for (const file of files) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result
        })

        if (newPreviews.length === validFiles.length) {
          const updatedImages = [...images, ...validFiles]
          const updatedPreviews = [...previews, ...newPreviews]
          
          onImagesChange(updatedImages)
          setPreviews(updatedPreviews)
        }
      }
      reader.readAsDataURL(file)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    
    onImagesChange(updatedImages)
    setPreviews(updatedPreviews)
    setError(null)
  }

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-uploader">
      <div className="image-uploader__header">
        <h4 className="image-uploader__title">
          이미지 추가 <span className="image-uploader__count">({images.length}/{maxImages})</span>
        </h4>
        <p className="image-uploader__hint">
          JPG, PNG, GIF 형식, 최대 {maxSizeMB}MB
        </p>
      </div>

      <div className="image-uploader__content">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className="image-uploader__grid">
          {previews.map((preview, index) => (
            <div key={preview.id} className="image-uploader__preview">
              <img 
                src={preview.preview} 
                alt={`Preview ${index + 1}`}
                className="image-uploader__preview-image"
              />
              <button
                type="button"
                className="image-uploader__remove-btn"
                onClick={() => handleRemoveImage(index)}
                aria-label="이미지 삭제"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}

          {images.length < maxImages && (
            <button
              type="button"
              className="image-uploader__add-btn"
              onClick={handleAddClick}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 8v16M8 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>이미지 추가</span>
            </button>
          )}
        </div>

        {error && (
          <div className="image-uploader__error">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUploader
