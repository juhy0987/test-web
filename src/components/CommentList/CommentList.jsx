import React, { useState, useEffect } from 'react'
import CommentItem from '../CommentItem/CommentItem'
import commentService from '../../services/commentService'
import './CommentList.css'

/**
 * CommentList Component
 * Displays all comments for a post with nested replies
 * Comments are sorted oldest-first, with replies nested under parents
 * 
 * @param {Object} props
 * @param {number} props.postId - The ID of the post
 * @param {Function} props.onCommentCountChange - Callback when comment count changes
 */
const CommentList = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null) // {commentId, authorNickname}

  // Fetch comments on mount and when postId changes
  useEffect(() => {
    fetchComments()
  }, [postId])

  // Notify parent of comment count changes
  useEffect(() => {
    if (onCommentCountChange) {
      const totalCount = comments.length + comments.reduce((sum, c) => sum + (c.replies?.length || 0), 0)
      onCommentCountChange(totalCount)
    }
  }, [comments, onCommentCountChange])

  const fetchComments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await commentService.getComments(postId)
      
      // Organize comments into parent-child structure
      const organized = organizeComments(response.data || response.comments || [])
      setComments(organized)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('댓글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Organize comments into parent-child structure
   * MVP: Only 1 level of nesting
   */
  const organizeComments = (commentsList) => {
    const parentComments = []
    const repliesMap = new Map()

    // First pass: separate parents and replies
    commentsList.forEach(comment => {
      if (comment.parentCommentId) {
        // This is a reply
        if (!repliesMap.has(comment.parentCommentId)) {
          repliesMap.set(comment.parentCommentId, [])
        }
        repliesMap.get(comment.parentCommentId).push(comment)
      } else {
        // This is a parent comment
        parentComments.push(comment)
      }
    })

    // Second pass: attach replies to parents and sort
    const organized = parentComments.map(parent => ({
      ...parent,
      replies: (repliesMap.get(parent.id) || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
    }))

    // Sort parent comments by creation date (oldest first)
    return organized.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  const handleReplyClick = (commentId, authorNickname) => {
    setReplyingTo({ commentId, authorNickname })
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  const handleReplySubmit = async (parentCommentId, authorNickname, content) => {
    try {
      await commentService.createComment(postId, {
        content,
        parentCommentId
      })
      
      // Refresh comments list
      await fetchComments()
      setReplyingTo(null)
    } catch (err) {
      console.error('Error creating reply:', err)
      throw err
    }
  }

  const handleEdit = async (commentId, newContent) => {
    try {
      await commentService.updateComment(commentId, { content: newContent })
      
      // Refresh comments list
      await fetchComments()
    } catch (err) {
      console.error('Error updating comment:', err)
      throw err
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId)
      
      // Refresh comments list
      await fetchComments()
    } catch (err) {
      console.error('Error deleting comment:', err)
      throw err
    }
  }

  if (loading) {
    return (
      <div className="comment-list">
        <div className="comment-list__loading">
          <div className="comment-list__spinner"></div>
          <p>댓글을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="comment-list">
        <div className="comment-list__error">
          <p>{error}</p>
          <button 
            className="comment-list__retry-button"
            onClick={fetchComments}
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="comment-list">
        <div className="comment-list__empty">
          <p>아직 댓글이 없습니다. 처음으로 댓글을 남겨보세요!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="comment-list">
      <div className="comment-list__header">
        <h3 className="comment-list__title">
          댓글 {comments.length + comments.reduce((sum, c) => sum + (c.replies?.length || 0), 0)}개
        </h3>
      </div>

      <div className="comment-list__items">
        {comments.map(comment => (
          <React.Fragment key={comment.id}>
            {/* Parent Comment */}
            <CommentItem
              comment={comment}
              onReply={handleReplyClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showReplyInput={replyingTo?.commentId === comment.id}
              onCancelReply={handleCancelReply}
            />

            {/* Nested Replies (MVP: 1 level only) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="comment-list__replies">
                {comment.replies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={() => {}} // No nested replies in MVP
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isReply={true}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default CommentList
