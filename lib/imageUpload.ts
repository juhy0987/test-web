/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'JPG, PNG, GIF 형식만 업로드 가능합니다.',
    }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '파일 크기는 5MB를 초과할 수 없습니다.',
    }
  }

  return { valid: true }
}

/**
 * Upload image to server
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const { default: api } = await import('./api')
    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.url
  } catch (error) {
    console.error('Image upload error:', error)
    throw new Error('이미지 업로드에 실패했습니다.')
  }
}

/**
 * Create a preview URL for an image file
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
