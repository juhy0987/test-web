# 모두의 책 - Frontend Web Application

Frontend web application for the "모두의 책" project with a comprehensive comment and reply system.

## 프로젝트 개요 (Project Overview)

This is a React-based frontend application that implements a modern comment and reply feature for post detail pages. The application provides:

- **댓글 작성**: Users can write comments up to 500 characters with a real-time character counter
- **대댓글 기능**: One level of nested replies with @mentions
- **수정/삭제**: Authors can edit and delete their own comments
- **실시간 업데이트**: Comments appear immediately without page refresh
- **반응형 디자인**: Mobile-friendly responsive design

## 기술 스택 (Tech Stack)

- **React 18.2** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **date-fns** - Date formatting utility

## 시작하기 (Getting Started)

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Backend API server (test-api) running

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set your API URL
# VITE_API_URL=http://localhost:5000
```

### Development

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 프로젝트 구조 (Project Structure)

```
src/
├── components/              # Reusable components
│   ├── CommentSection/     # Main comment section container
│   ├── CommentList/        # List of comments with replies
│   ├── CommentItem/        # Individual comment display
│   └── CommentInput/       # Comment input form
├── pages/                  # Page components
│   └── PostDetail.jsx      # Post detail page with comments
├── services/               # API services
│   ├── api.js              # Axios instance configuration
│   └── commentService.js   # Comment-related API calls
├── utils/                  # Utility functions
│   ├── auth.js             # Authentication utilities
│   └── dateFormatter.js    # Date formatting functions
├── App.jsx                 # Root application component
└── main.jsx                # Application entry point
```

## 컴포넌트 설명 (Component Description)

### CommentSection
Main container component that integrates the comment list and input form.
- Handles new comment submission
- Shows login prompt for unauthenticated users
- Manages comment count display

### CommentList
Displays all comments with nested replies.
- Fetches comments from API
- Organizes comments in parent-child structure
- Sorts comments oldest-first
- Handles loading and error states
- Supports 1-level deep nesting (MVP)

### CommentItem
Displays individual comment with actions.
- Shows author profile picture, nickname, timestamp
- "Reply" button to create nested replies
- "..." menu with Edit/Delete for authors
- Inline edit mode
- Delete confirmation dialog
- Visual indentation for replies

### CommentInput
Input form for creating comments or replies.
- 500-character limit with real-time counter
- Auto-mention for replies (@username)
- Submit and cancel buttons
- Loading and error states

## API 연동 (API Integration)

The frontend expects the following API endpoints from the backend:

### GET /api/posts/:postId/comments
Retrieve all comments for a post.
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "Comment text",
      "author": {
        "id": 1,
        "nickname": "Username",
        "profilePicture": "url"
      },
      "parentCommentId": null,
      "createdAt": "2026-02-01T10:30:00Z",
      "updatedAt": "2026-02-01T10:30:00Z",
      "isEdited": false
    }
  ]
}
```

### POST /api/posts/:postId/comments
Create a new comment or reply.
```json
// Request
{
  "content": "Comment text",
  "parentCommentId": 1  // Optional, for replies
}

// Response
{
  "success": true,
  "data": { /* comment object */ }
}
```

### PATCH /api/comments/:commentId
Update an existing comment.
```json
// Request
{
  "content": "Updated text"
}

// Response
{
  "success": true,
  "data": { /* updated comment object */ }
}
```

### DELETE /api/comments/:commentId
Delete a comment.
```json
// Response
{
  "success": true,
  "message": "Comment deleted"
}
```

## 인증 (Authentication)

The application uses JWT token-based authentication:

1. User logs in and receives a token
2. Token is stored in `localStorage` as `authToken`
3. User data is stored in `localStorage` as `currentUser`
4. API calls include token in `Authorization` header
5. Unauthorized requests (401) redirect to login page

### Testing with Mock Authentication

For development/testing, you can set mock authentication in browser console:

```javascript
// Set mock user and token
localStorage.setItem('authToken', 'mock-token-123')
localStorage.setItem('currentUser', JSON.stringify({
  id: 1,
  nickname: 'TestUser',
  email: 'test@example.com',
  profilePicture: null
}))

// Reload page
location.reload()
```

## 테스트 (Testing)

### Manual Testing Checklist

- [ ] Comments display correctly with oldest-first sorting
- [ ] Character counter updates in real-time
- [ ] Character limit (500) is enforced
- [ ] New comments appear without page refresh
- [ ] Reply button shows indented input form
- [ ] @mention appears in reply input
- [ ] Replies display with visual indentation
- [ ] Edit mode allows inline editing
- [ ] Delete shows confirmation dialog
- [ ] Only authors see edit/delete options
- [ ] Unauthenticated users see login prompt
- [ ] Mobile responsive design works correctly

## 주요 기능 (Key Features)

### 1. Real-time Character Counter
- Displays current character count out of 500
- Warning color when approaching limit (50 characters left)
- Error color when over limit
- Submit button disabled when over limit

### 2. Nested Replies (1 Level)
- Click "Reply" to show input form
- Auto-fills @username mention
- Visually indented with left border
- No nested replies within replies (MVP limitation)

### 3. Edit & Delete
- Only visible to comment authors
- Edit mode switches to inline input
- Delete requires confirmation
- Updates reflected immediately

### 4. Date Formatting
- "Just now" for < 1 minute
- "X minutes ago" for < 1 hour
- "X hours ago" for today
- "Yesterday HH:MM" for yesterday
- "Month Day" for this year
- "YYYY.MM.DD" for older dates

## 성능 최적화 (Performance Optimization)

- Component-level code splitting
- Optimized re-renders with React keys
- Lazy loading for large comment lists (future)
- Debounced API calls (future)

## 브라우저 지원 (Browser Support)

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 기여하기 (Contributing)

This project is part of the Eposo platform. For contributions:

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass

## 라이센스 (License)

Proprietary - 모두의 책 Project

## 문의 (Contact)

For questions or issues, please contact the project team through Eposo.
