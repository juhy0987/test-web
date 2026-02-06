import React, { useState, useEffect } from 'react'
import './CommentInput.css'

const MAX_CHARS = 500

/**
 * CommentInput Component
 * Input form for creating new comments or replies
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback when comment is submitted
 * @param {Function} props.onCancel - Callback when cancel is clicked (for replies)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.initialValue - Initial value for edit mode
 * @param {boolean} props.isReply - Whether this is a reply input
 * @param {string} props.mentionUser - Username to mention (for replies)
 * @param {boolean} props.autoFocus - Whether to auto-focus input
 */
const CommentInput = ({
  onSubmit,
  onCancel,
  placeholder = '댄글을 작성하세요...',
  initialValue = '',
  isReply = false,
  mentionUser = null,
  autoFocus = false,
}) => {
  const [content, setContent] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Set initial mention for replies
  useEffect(() => {
    if (isReply && mentionUser && !initialValue) {
      setContent(`@${mentionUser} `)
    }
  }, [isReply, mentionUser, initialValue])

  const remainingChars = MAX_CHARS - content.length
  const isOverLimit = remainingChars < 0
  const isNearLimit = remainingChars <= 50 && remainingChars >= 0

  const handleChange = (e) => {
    const newValue = e.target.value
    setContent(newValue)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    if (isOverLimit) {
      setError(`댓글은 ${MAX_CHARS}자 이하로 작성해주세요.`)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit(content.trim())
      setContent(isReply && mentionUser ? `@${mentionUser} ` : '')
    } catch (err) {
      setError(err.response?.data?.message || '댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent('')
    setError('')
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form className={`comment-input ${isReply ? 'comment-input--reply' : ''}`} onSubmit={handleSubmit}>
      <div className="comment-input__wrapper">
        <textarea
          className="comment-input__textarea"
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={MAX_CHARS + 50} // Allow typing over limit to show error
          autoFocus={autoFocus}
          disabled={isSubmitting}
        />
        
        <div className="comment-input__footer">
          <div className="comment-input__counter">
            <span 
              className={`
                comment-input__counter-text
                ${isOverLimit ? 'comment-input__counter-text--error' : ''}
                ${isNearLimit ? 'comment-input__counter-text--warning' : ''}
              `}
            >
              {content.length} / {MAX_CHARS}
            </span>
          </div>

          <div className="comment-input__actions">
            {isReply && (
              <button
                type="button"
                className="comment-input__button comment-input__button--cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="comment-input__button comment-input__button--submit"
              disabled={isSubmitting || !content.trim() || isOverLimit}
            >
              {isSubmitting ? '작성 중...' : '게시'}
            </button>
          </div>
        </div>

        {error && (
          <div className="comment-input__error">
            {error}
          </div>
        )}
      </div>
    </form>
  )
}

export default CommentInput
