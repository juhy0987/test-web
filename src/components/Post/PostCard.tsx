'use client';

import React, { useState } from 'react';
import { Post } from '@/src/services/api';
import { LikeButton } from './LikeButton';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onLikeUpdate?: (postId: number, isLiked: boolean, likeCount: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post: initialPost, onLikeUpdate }) => {
  const [post, setPost] = useState(initialPost);

  const handleLikeChange = (isLiked: boolean, likeCount: number) => {
    setPost(prev => ({
      ...prev,
      isLiked,
      likeCount,
    }));
    
    // Notify parent component if callback provided
    if (onLikeUpdate) {
      onLikeUpdate(post.id, isLiked, likeCount);
    }
  };

  return (
    <article className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{post.authorName}</span>
          <span className={styles.postDate}>
            {new Date(post.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postBody}>{post.content}</p>
      </div>

      <div className={styles.postFooter}>
        <LikeButton
          postId={post.id}
          initialIsLiked={post.isLiked}
          initialLikeCount={post.likeCount}
          onLikeChange={handleLikeChange}
        />
      </div>
    </article>
  );
};
