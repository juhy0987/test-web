import React, { useState } from 'react'
import { formatCommentDate, formatFullDate } from '../../utils/dateFormatter'
import { isCommentAuthor } from '../../utils/auth'
import CommentInput from '../CommentInput/CommentInput'
import './CommentItem.css'

/**
 * CommentItem Component
 * Displays a single comment with author info, content, and actions
 * 
 * @param {Object} props
 * @param {Object} props.comment - Comment data object
 * @param {Function} props.onReply - Callback when reply button is clicked
 * @param {Function} props.onEdit - Callback when comment is edited
 * @param {Function} props.onDelete - Callback when comment is deleted
 * @param {boolean} props.isReply - Whether this is a reply (indented)
 * @param {boolean} props.showReplyInput - Whether to show reply input
 * @param {Function} props.onCancelReply - Callback to cancel reply
 */
const CommentItem = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
  showReplyInput = false,
  onCancelReply,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isAuthor = isCommentAuthor(comment.author.id)

  const handleEdit = () => {
    setIsEditing(true)
    setShowMenu(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = async (newContent) => {
    try {
      await onEdit(comment.id, newContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving edit:', error)
      throw error
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
    setShowMenu(false)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(comment.id)
    } catch (error) {
      console.error('Error deleting comment:', error)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const handleReply = () => {
    onReply(comment.id, comment.author.nickname)
  }

  // Get profile picture URL or use default
  const getProfilePicture = () => {
    return comment.author.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.nickname)}&background=random`
  }

  return (
    <div className={`comment-item ${isReply ? 'comment-item--reply' : ''}`}>
      <div className="comment-item__container">
        {/* Profile Picture */}
        <div className="comment-item__avatar">
          <img
            src={getProfilePicture()}
            alt={comment.author.nickname}
            className="comment-item__avatar-img"
          />
        </div>

        {/* Comment Content */}
        <div className="comment-item__content">
          {/* Header */}
          <div className="comment-item__header">
            <div className="comment-item__author-info">
              <span className="comment-item__nickname">
                {comment.author.nickname}
              </span>
              <span 
                className="comment-item__timestamp"
                title={formatFullDate(comment.createdAt)}
              >
                {formatCommentDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="comment-item__edited-badge">
                  (수정됨)
                </span>
              )}
            </div>

            {/* Actions Menu (only for authors) */}
            {isAuthor && !isEditing && (
              <div className="comment-item__menu-wrapper">
                <button
                  className="comment-item__menu-button"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="댓글 메뉴"
                >
                  <span className="comment-item__menu-icon">⋯</span>
                </button>

                {showMenu && (
                  <div className="comment-item__menu">
                    <button
                      className="comment-item__menu-item"
                      onClick={handleEdit}
                    >
                      수정
                    </button>
                    <button
                      className="comment-item__menu-item comment-item__menu-item--danger"
                      onClick={handleDeleteClick}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Text or Edit Mode */}
          {isEditing ? (
            <div className="comment-item__edit-mode">
              <CommentInput
                onSubmit={handleSaveEdit}
                onCancel={handleCancelEdit}
                initialValue={comment.content}
                placeholder="댓글을 수정하세요..."
                autoFocus={true}
              />
            </div>
          ) : (
            <>
              <p className="comment-item__text">{comment.content}</p>

              {/* Reply Button */}
              {!isReply && (
                <button
                  className="comment-item__reply-button"
                  onClick={handleReply}
                >
                  답글 달기
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="comment-item__delete-confirm">
          <p className="comment-item__delete-confirm-text">
            정말 이 댓글을 삭제하시겠습니까?
          </p>
          <div className="comment-item__delete-confirm-actions">
            <button
              className="comment-item__delete-confirm-button comment-item__delete-confirm-button--cancel"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              취소
            </button>
            <button
              className="comment-item__delete-confirm-button comment-item__delete-confirm-button--delete"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      )}

      {/* Reply Input (shown when reply button is clicked) */}
      {showReplyInput && (
        <CommentInput
          onSubmit={async (content) => {
            await onReply(comment.id, comment.author.nickname, content)
          }}
          onCancel={onCancelReply}
          isReply={true}
          mentionUser={comment.author.nickname}
          autoFocus={true}
        />
      )}
    </div>
  )
}

export default CommentItem
