'use client';

import React, { useState, useCallback } from 'react';
import { postsApi } from '@/src/services/api';
import { formatLikeCount } from '@/src/utils/formatNumber';
import styles from './LikeButton.module.css';

interface LikeButtonProps {
  postId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  onLikeChange?: (isLiked: boolean, likeCount: number) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialIsLiked,
  initialLikeCount,
  onLikeChange,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = useCallback(async () => {
    if (isLoading) return;

    // Store previous state for rollback on error
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // Optimistic UI update
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setIsAnimating(true);
    setIsLoading(true);

    // Trigger animation
    setTimeout(() => setIsAnimating(false), 300);

    try {
      // Make API call
      const response = newIsLiked 
        ? await postsApi.likePost(postId)
        : await postsApi.unlikePost(postId);

      // Update with server response to ensure consistency
      const serverLikeCount = response.data.likeCount;
      const serverIsLiked = response.data.isLiked;
      
      setLikeCount(serverLikeCount);
      setIsLiked(serverIsLiked);

      // Notify parent component
      if (onLikeChange) {
        onLikeChange(serverIsLiked, serverLikeCount);
      }
    } catch (error) {
      // Rollback to previous state on error
      console.error('Failed to update like:', error);
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);

      // Notify parent to rollback as well
      if (onLikeChange) {
        onLikeChange(previousIsLiked, previousLikeCount);
      }

      // Show error message to user (you can replace this with a toast notification)
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [isLiked, likeCount, postId, isLoading, onLikeChange]);

  return (
    <button
      className={`${styles.likeButton} ${isAnimating ? styles.animating : ''}`}
      onClick={handleLikeClick}
      disabled={isLoading}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
      aria-pressed={isLiked}
    >
      <span className={styles.iconWrapper}>
        {isLiked ? (
          // Filled heart icon
          <svg
            className={styles.heartIcon}
            viewBox="0 0 24 24"
            fill="#ff0000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          // Empty heart icon
          <svg
            className={styles.heartIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        )}
      </span>
      <span className={styles.likeCount}>{formatLikeCount(likeCount)}</span>
    </button>
  );
};
