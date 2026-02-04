# Book Review Platform - Frontend (test-web)

A Next.js-based web application for sharing book reviews with an integrated book search feature and rich post creation interface.

## Features

### Book Search
- Search books by title, author, or ISBN
- Integration with external book API (configured for test-api repository)
- Display book cover, title, author, publisher, and description
- Select book to create a review post

### Post Creation
- **Two-step process:**
  1. Book search interface
  2. Review editor with selected book
- **Required fields:**
  - Book selection (from search results)
  - Star rating (1-5 stars)
- **Optional fields:**
  - Review content (up to 2,000 characters)
  - Images (up to 5 images, max 5MB each, JPG/PNG/GIF)
  - Hashtags (auto-detected from content, max 10)

### Post Features
- View post details with book information
- Display star rating
- Render content with clickable hashtags
- Image gallery
- Edit your own posts
- Delete your own posts
- Redirect to post detail page after publication

### Validation Rules
- Book selection is required
- Rating (1-5 stars) is required
- Content limited to 2,000 characters
- Maximum 5 images per post
- Each image max 5MB
- Allowed image formats: JPG, PNG, GIF
- Maximum 10 hashtags (auto-extracted from content)
- Publish button disabled until book selected and rating provided

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** Heroicons

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── posts/
│       ├── create/
│       │   └── page.tsx     # Post creation page
│       └── [id]/
│           ├── page.tsx     # Post detail page
│           └── edit/
│               └── page.tsx # Post edit page
├── components/              # React components
│   ├── BookSearch.tsx       # Book search interface
│   ├── BookSearchResult.tsx # Book search result item
│   ├── ContentEditor.tsx    # Review content editor
│   ├── ImageUploader.tsx    # Image upload component
│   └── StarRating.tsx       # Star rating component
├── lib/                     # Utilities and API clients
│   ├── api.ts              # API client (book, post, image)
│   └── utils.ts            # Utility functions
├── types/                   # TypeScript type definitions
│   ├── book.ts             # Book-related types
│   └── post.ts             # Post-related types
└── styles/
    └── globals.css         # Global styles and Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Running test-api backend (see test-api repository)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## API Integration

This frontend expects the following API endpoints from test-api:

### Book API
- `GET /books/search` - Search books
  - Query params: `query`, `searchType` (title/author/isbn), `page`, `limit`
  - Returns: `{ books: Book[], total: number, page: number, totalPages: number }`

### Post API
- `POST /posts` - Create new post
- `GET /posts/:id` - Get post by ID
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `GET /posts` - Get all posts (with pagination)

### Image API
- `POST /upload` - Upload image file
  - Returns: `{ url: string }`

## Component Usage

### StarRating
```tsx
import StarRating from '@/components/StarRating';

<StarRating 
  rating={rating} 
  onChange={setRating} 
  readonly={false} 
/>
```

### ImageUploader
```tsx
import ImageUploader from '@/components/ImageUploader';

<ImageUploader 
  images={images} 
  onChange={setImages} 
  maxImages={5} 
/>
```

### ContentEditor
```tsx
import ContentEditor from '@/components/ContentEditor';

<ContentEditor 
  content={content} 
  onChange={setContent} 
  maxLength={2000} 
/>
```

### BookSearch
```tsx
import BookSearch from '@/components/BookSearch';

<BookSearch onSelectBook={handleSelectBook} />
```

## Features Implementation

### Hashtag Detection
Hashtags are automatically detected from content using the pattern `#[word]`. The system:
- Detects all words starting with `#`
- Supports Unicode characters (Korean, Japanese, etc.)
- Removes duplicates
- Limits to first 10 hashtags
- Renders hashtags as clickable elements in post view

### Image Validation
Before upload, images are validated for:
- File type (JPG, PNG, GIF only)
- File size (max 5MB)
- Total count (max 5 images)

### Character Counter
The content editor shows:
- Remaining characters out of 2,000
- Warning color when less than 100 characters remain
- Live update as user types

### Publish Button State
The publish button is:
- Disabled until book is selected AND rating is provided
- Shows loading state during submission
- Prevents multiple submissions

## User Flow

1. **Create Post:**
   - Click "Create New Post" button
   - Search for a book (by title, author, or ISBN)
   - Select book from results
   - Provide star rating (required)
   - Write review content (optional, max 2,000 chars)
   - Upload images (optional, max 5 images)
   - Hashtags auto-detected from content
   - Click "Publish" (disabled until book + rating provided)
   - Redirected to post detail page

2. **View Post:**
   - See book information with cover image
   - View star rating
   - Read content with clickable hashtags
   - Browse uploaded images
   - Edit/Delete buttons for post owner

3. **Edit Post:**
   - Click "Edit" button (only for post owner)
   - Modify rating, content, or images
   - Save changes
   - Redirected back to post detail

4. **Delete Post:**
   - Click "Delete" button (only for post owner)
   - Confirm deletion
   - Redirected to home page

## Notes

- User authentication is mocked with `currentUserId = 'user-1'`
- In production, integrate with real authentication system
- Image uploads expect a working `/upload` endpoint in test-api
- Book search expects integration with external book API (Aladin, Kyobo, etc.)

## Backend Requirements (test-api)

The test-api repository must implement:

1. **Book Search Endpoint** (`/books/search`):
   - Integration with external book API (Aladin or Kyobo)
   - Search by title, author, or ISBN
   - Return book data including:
     - isbn, title, author, publisher
     - coverImage URL
     - publicationDate, description (optional)

2. **Post CRUD Endpoints** (`/posts`):
   - Create: Save book info, rating, content, images, hashtags
   - Read: Get post by ID with all related data
   - Update: Allow editing rating, content, images, hashtags
   - Delete: Remove post and cleanup resources
   - List: Get all posts with pagination

3. **Image Upload Endpoint** (`/upload`):
   - Accept multipart/form-data
   - Validate file type and size
   - Store files (local storage, S3, etc.)
   - Return public URL

4. **Data Validation**:
   - Rating: 1-5 integer
   - Content: max 2,000 characters
   - Images: max 5 URLs
   - Hashtags: max 10 strings
   - Book data: all required fields present

## License

This project is part of the Book Review Platform system.