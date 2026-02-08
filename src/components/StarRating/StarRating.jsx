import React, { useState } from 'react'
import './StarRating.css'

/**
 * StarRating Component
 * Displays a 5-star rating input with hover effect
 * 
 * @param {Object} props
 * @param {number} props.rating - Current rating (1-5)
 * @param {Function} props.onRatingChange - Callback when rating changes
 * @param {boolean} props.readonly - Whether the rating is readonly (default: false)
 * @param {string} props.size - Size of stars: 'small', 'medium', 'large' (default: 'medium')
 */
const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 'medium' }) => {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const stars = [1, 2, 3, 4, 5]
  const displayRating = hoverRating || rating

  return (
    <div className={`star-rating star-rating--${size} ${readonly ? 'star-rating--readonly' : ''}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`star-rating__star ${star <= displayRating ? 'star-rating__star--filled' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          aria-label={`${star}점`}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill={star <= displayRating ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {!readonly && rating > 0 && (
        <span className="star-rating__label">{rating}점</span>
      )}
    </div>
  )
}

export default StarRating
