import React, { useState } from 'react'
import CommentList from '../CommentList/CommentList'
import CommentInput from '../CommentInput/CommentInput'
import commentService from '../../services/commentService'
import { isAuthenticated } from '../../utils/auth'
import './CommentSection.css'

/**
 * CommentSection Component
 * Main component for the comment and reply feature
 * Combines CommentList and CommentInput
 * 
 * @param {Object} props
 * @param {number} props.postId - The ID of the post
 */
const CommentSection = ({ postId }) => {
  const [commentCount, setCommentCount] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const authenticated = isAuthenticated()

  const handleCommentSubmit = async (content) => {
    try {
      await commentService.createComment(postId, { content })
      
      // Trigger CommentList refresh by changing key
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      console.error('Error creating comment:', err)
      throw err
    }
  }

  const handleCommentCountChange = (count) => {
    setCommentCount(count)
  }

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <h2 className="comment-section__title">
          댓글 {commentCount > 0 && `(${commentCount})`}
        </h2>
      </div>

      {/* Comment List */}
      <div className="comment-section__list">
        <CommentList 
          key={refreshKey}
          postId={postId}
          onCommentCountChange={handleCommentCountChange}
        />
      </div>

      {/* Comment Input or Login Prompt */}
      <div className="comment-section__input">
        {authenticated ? (
          <>
            <h3 className="comment-section__input-title">
              댓글 작성
            </h3>
            <CommentInput
              onSubmit={handleCommentSubmit}
              placeholder="댓글을 작성하세요..."
            />
          </>
        ) : (
          <div className="comment-section__login-prompt">
            <p className="comment-section__login-text">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <button 
              className="comment-section__login-button"
              onClick={() => window.location.href = '/login'}
            >
              로그인하기
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CommentSection
