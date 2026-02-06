import React, { useState, useEffect } from 'react'
import CommentSection from '../components/CommentSection/CommentSection'
import './PostDetail.css'

/**
 * PostDetail Page Component
 * Displays a single post with its comment section
 * 
 * @param {Object} props
 * @param {number} props.postId - The ID of the post to display
 */
const PostDetail = ({ postId }) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, fetch post data from API
    // For now, using mock data
    fetchPost(postId)
  }, [postId])

  const fetchPost = async (id) => {
    try {
      setLoading(true)
      
      // Mock post data
      // In production, replace with: const response = await postService.getPost(id)
      setTimeout(() => {
        setPost({
          id: id,
          title: '게시물 제목 예시: 리액트로 만드는 현대적인 웹 애플리케이션',
          content: `안녕하세요! 이 게시물에서는 리액트를 사용하여 현대적인 웹 애플리케이션을 만드는 방법에 대해 이야기해보려고 합니다.

리액트는 사용자 인터페이스를 구축하기 위한 강력한 라이브러리입니다. 컴포넌트 기반 아키텍처를 통해 재사용 가능한 코드를 작성할 수 있으며, Virtual DOM을 통해 성능을 최적화할 수 있습니다.

특히 댓글 기능과 같은 대화형 기능을 구현할 때, 리액트의 상태 관리와 컴포넌트 구조가 큰 도움이 됩니다.

여러분의 생각은 어떠신가요? 아래 댓글로 의견을 나눠주세요!`,
          author: {
            id: 1,
            nickname: '개발자',
            profilePicture: null
          },
          createdAt: '2026-02-01T10:30:00Z',
          views: 1234,
          likes: 56
        })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching post:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="post-detail">
        <div className="post-detail__loading">
          <div className="post-detail__spinner"></div>
          <p>게시물을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post-detail">
        <div className="post-detail__error">
          <p>게시물을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="post-detail">
      {/* Post Header */}
      <header className="post-detail__header">
        <h1 className="post-detail__title">{post.title}</h1>
        
        <div className="post-detail__meta">
          <div className="post-detail__author">
            <img
              src={post.author.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.nickname)}&background=random`}
              alt={post.author.nickname}
              className="post-detail__author-avatar"
            />
            <span className="post-detail__author-name">{post.author.nickname}</span>
          </div>
          
          <div className="post-detail__stats">
            <span className="post-detail__stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                <path d="M8 5.5a.5.5 0 01.5.5v2.086l1.207 1.207a.5.5 0 11-.707.707l-1.5-1.5A.5.5 0 017 8V6a.5.5 0 01.5-.5z"/>
              </svg>
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </span>
            <span className="post-detail__stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a.5.5 0 01.5.5v5h5a.5.5 0 010 1h-5v5a.5.5 0 01-1 0v-5h-5a.5.5 0 010-1h5v-5A.5.5 0 018 2z"/>
              </svg>
              조회 {post.views.toLocaleString()}
            </span>
            <span className="post-detail__stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              좋아요 {post.likes}
            </span>
          </div>
        </div>
      </header>

      {/* Post Content */}
      <article className="post-detail__content">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="post-detail__paragraph">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Comment Section */}
      <div className="post-detail__comments">
        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}

export default PostDetail
