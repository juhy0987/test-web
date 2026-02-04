# Implementation Guide - Book Review Platform Frontend

## Overview

This document describes the implementation of the book search and post creation feature for the test-web repository.

## Implemented Features

### 1. Book Search Interface

**Location:** `src/components/BookSearch.tsx`

**Features:**
- Search input with type selector (title/author/ISBN)
- Real-time search with loading states
- Error handling with user-friendly messages
- Results display with book details
- Book selection for post creation

**API Integration:**
- Endpoint: `GET /books/search`
- Parameters: query, searchType, page, limit
- Response: books array with book details

### 2. Post Creation Page

**Location:** `src/app/posts/create/page.tsx`

**Two-Step Process:**

**Step 1: Book Search**
- User searches for a book
- Selects from search results
- Transitions to editor view

**Step 2: Post Editor**
- Displays selected book (read-only)
- Star rating component (required)
- Content editor with character counter
- Image uploader (up to 5 images)
- Hashtag auto-detection
- Publish button (disabled until requirements met)

**Validation:**
- Book must be selected
- Rating must be provided (1-5 stars)
- Content limited to 2,000 characters
- Images validated (type, size, count)
- Hashtags limited to 10

**Submission:**
- Extracts hashtags from content
- Sends POST request to `/posts`
- Redirects to post detail page on success

### 3. Star Rating Component

**Location:** `src/components/StarRating.tsx`

**Features:**
- Interactive 5-star rating
- Hover preview
- Readonly mode for display
- Accessible with ARIA labels

### 4. Image Uploader Component

**Location:** `src/components/ImageUploader.tsx`

**Features:**
- Multiple file selection
- File validation (type, size)
- Thumbnail previews
- Individual image deletion
- Progress indication during upload
- Error messages for validation failures

**Validation Rules:**
- Max 5 images per post
- Max 5MB per image
- Allowed formats: JPG, PNG, GIF

**Upload Process:**
1. User selects files
2. Client validates each file
3. Uploads to `/upload` endpoint
4. Receives URL for each image
5. Stores URLs in state

### 5. Content Editor Component

**Location:** `src/components/ContentEditor.tsx`

**Features:**
- Textarea with 2,000 character limit
- Live character counter
- Warning color when nearing limit
- Hashtag detection and display
- Preview of detected hashtags

**Hashtag Detection:**
- Pattern: `#[word]` (supports Unicode)
- Real-time detection as user types
- Displays count and list of detected tags
- Limits to first 10 hashtags
- Shows warning if more than 10 detected

### 6. Post Detail Page

**Location:** `src/app/posts/[id]/page.tsx`

**Features:**
- Book information display
- Star rating (readonly)
- Content with clickable hashtags
- Image gallery
- Edit/Delete buttons (for post owner)
- Timestamps (created, updated)

**Hashtag Rendering:**
- Parses content for hashtags
- Renders hashtags with special styling
- Makes hashtags clickable
- Maintains text formatting

**Ownership Check:**
- Compares post.userId with currentUserId
- Shows edit/delete buttons only to owner
- Redirects non-owners trying to access edit page

### 7. Post Edit Page

**Location:** `src/app/posts/[id]/edit/page.tsx`

**Features:**
- Loads existing post data
- Pre-fills form with current values
- Book display (read-only, cannot change)
- Editable rating, content, images
- Same validation as creation
- Updates post on submission

**Edit Flow:**
1. Load post data
2. Check ownership
3. Pre-fill form fields
4. Allow modifications
5. Validate changes
6. Submit update
7. Redirect to post detail

### 8. API Integration

**Location:** `src/lib/api.ts`

**Implemented APIs:**

**Book API:**
- `bookApi.search()` - Search books with parameters

**Post API:**
- `postApi.create()` - Create new post
- `postApi.getById()` - Get post by ID
- `postApi.update()` - Update existing post
- `postApi.delete()` - Delete post
- `postApi.getAll()` - List all posts (with pagination)

**Image API:**
- `imageApi.upload()` - Upload single image file

**Configuration:**
- Base URL from environment variable
- Axios instance with default headers
- Error handling for all requests

### 9. Utility Functions

**Location:** `src/lib/utils.ts`

**Functions:**

**`extractHashtags(text: string): string[]`**
- Extracts hashtags from text
- Uses regex: `/#([\p{L}\p{N}_]+)/gu`
- Removes duplicates
- Limits to 10 hashtags

**`validateImageFile(file: File): ValidationResult`**
- Checks file type (JPG, PNG, GIF)
- Checks file size (max 5MB)
- Returns validation result with error message

**`formatDate(dateString: string): string`**
- Formats ISO date to readable format
- Uses Korean locale (ko-KR)

**`renderTextWithHashtags(text: string): ReactNode[]`**
- Parses text for hashtags
- Returns array of text and hashtag elements
- Used for rendering clickable hashtags

### 10. Type Definitions

**Location:** `src/types/`

**Book Types (`book.ts`):**
```typescript
interface Book {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImage: string;
  publicationDate?: string;
  description?: string;
}
```

**Post Types (`post.ts`):**
```typescript
interface Post {
  id: string;
  userId: string;
  book: BookInfo;
  rating: number;
  content: string;
  images: string[];
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## User Experience Flow

### Creating a Post

1. User clicks "Create New Post" from home page
2. **Book Search Screen:**
   - Enters search query (title, author, or ISBN)
   - Selects search type
   - Clicks "Search"
   - Reviews search results
   - Clicks "Select" on desired book

3. **Post Editor Screen:**
   - Sees selected book at top (read-only)
   - Clicks on stars to provide rating (required)
   - Writes review content (optional)
   - Uploads images (optional, up to 5)
   - Hashtags auto-detected from content
   - Sees character counter update in real-time
   - "Publish" button enabled when book + rating provided
   - Clicks "Publish"

4. **Post Created:**
   - Redirected to post detail page
   - Can view, edit, or delete the post

### Viewing a Post

1. User navigates to post detail page
2. Sees:
   - Book information with cover image
   - Star rating
   - Review content with clickable hashtags
   - Uploaded images in gallery
   - List of hashtags
   - Edit/Delete buttons (if owner)

### Editing a Post

1. Post owner clicks "Edit" button
2. Redirected to edit page
3. Form pre-filled with existing data
4. Can modify:
   - Rating
   - Content
   - Images (add/remove)
5. Cannot change selected book
6. Clicks "Save Changes"
7. Redirected back to post detail

### Deleting a Post

1. Post owner clicks "Delete" button
2. Confirmation dialog appears
3. User confirms deletion
4. Post deleted from server
5. Redirected to home page

## Validation Rules

### Book Selection
- **Required:** Yes
- **Validation:** Must select a book from search results
- **UI:** Publish button disabled without selection

### Star Rating
- **Required:** Yes
- **Range:** 1-5 stars
- **Validation:** Must be integer between 1 and 5
- **UI:** Publish button disabled without rating

### Content
- **Required:** No
- **Max Length:** 2,000 characters
- **Validation:** Length checked on client and server
- **UI:** Character counter shows remaining chars
- **UI:** Warning color when < 100 chars remaining

### Images
- **Required:** No
- **Max Count:** 5 images
- **Max Size:** 5MB per image
- **Allowed Types:** JPG, PNG, GIF
- **Validation:** Type and size checked before upload
- **UI:** Upload button hidden when limit reached
- **UI:** Error messages for invalid files

### Hashtags
- **Required:** No
- **Max Count:** 10 hashtags
- **Source:** Auto-detected from content
- **Pattern:** Words starting with #
- **Validation:** Only first 10 saved if more detected
- **UI:** Shows detected hashtags in editor
- **UI:** Warning if more than 10 detected

## Technical Implementation Details

### State Management
- React useState for local component state
- No global state management (Redux, Context) needed
- Form state managed in page components
- Component state for UI elements (loading, errors)

### Routing
- Next.js App Router (file-based routing)
- Dynamic routes for post detail/edit: `/posts/[id]`
- Client-side navigation with useRouter
- Programmatic navigation after form submission

### API Communication
- Axios for HTTP requests
- Centralized API client in `lib/api.ts`
- Environment variable for API base URL
- Error handling with try-catch
- User-friendly error messages

### Image Handling
- Next.js Image component for optimization
- `unoptimized` prop for external images
- Relative sizing with fill layout
- Object-cover for aspect ratio preservation

### Styling
- Tailwind CSS utility classes
- Custom CSS for specific components
- Responsive design with Tailwind breakpoints
- Hover states and transitions
- Focus states for accessibility

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators on form elements
- Semantic HTML structure
- Alt text for images

## Environment Configuration

**Required Environment Variables:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**File:** `.env.local` (not committed to git)

**Usage:**
- Loaded by Next.js at build time
- Prefix `NEXT_PUBLIC_` for client-side access
- Used in `lib/api.ts` for API base URL

## Dependencies

**Production:**
- `next`: ^14.0.0 - React framework
- `react`: ^18.2.0 - UI library
- `react-dom`: ^18.2.0 - DOM rendering
- `axios`: ^1.6.0 - HTTP client
- `@heroicons/react`: ^2.0.18 - Icon library

**Development:**
- `typescript`: ^5.0.0 - Type safety
- `@types/*`: Type definitions
- `tailwindcss`: ^3.3.0 - Styling
- `eslint`: ^8.0.0 - Linting
- `postcss`: ^8.4.0 - CSS processing
- `autoprefixer`: ^10.4.0 - CSS vendor prefixes

## Testing Recommendations

### Manual Testing Checklist

**Book Search:**
- [ ] Search by title returns results
- [ ] Search by author returns results
- [ ] Search by ISBN returns results
- [ ] Empty search shows error
- [ ] No results shows appropriate message
- [ ] Select book transitions to editor

**Post Creation:**
- [ ] Publish button disabled without book
- [ ] Publish button disabled without rating
- [ ] Publish button enabled with book + rating
- [ ] Content limited to 2,000 characters
- [ ] Character counter updates correctly
- [ ] Hashtags detected from content
- [ ] Image upload validates file type
- [ ] Image upload validates file size
- [ ] Maximum 5 images enforced
- [ ] Form submission creates post
- [ ] Redirect to post detail after creation

**Post Viewing:**
- [ ] Post details display correctly
- [ ] Book information shows
- [ ] Star rating displays
- [ ] Content renders with clickable hashtags
- [ ] Images display in gallery
- [ ] Edit/Delete buttons show for owner
- [ ] Edit/Delete buttons hidden for non-owner

**Post Editing:**
- [ ] Non-owner redirected from edit page
- [ ] Form pre-filled with current data
- [ ] Book cannot be changed
- [ ] Rating can be updated
- [ ] Content can be updated
- [ ] Images can be added/removed
- [ ] Save updates the post
- [ ] Redirect to post detail after save

**Post Deletion:**
- [ ] Delete confirmation shown
- [ ] Cancel keeps the post
- [ ] Confirm deletes the post
- [ ] Redirect to home after deletion

## Known Limitations

1. **User Authentication:**
   - Currently mocked with hardcoded `currentUserId`
   - Needs integration with real auth system
   - All users appear as same user in current implementation

2. **Image Storage:**
   - Depends on backend `/upload` endpoint
   - No client-side image optimization before upload
   - No image compression

3. **Book API:**
   - Requires backend integration with external API
   - Search results depend on external API response format
   - No caching of search results

4. **Pagination:**
   - Home page doesn't implement post listing
   - No pagination UI for search results
   - getAll API exists but not used in UI

5. **Error Recovery:**
   - Upload errors require manual retry
   - No auto-save of form data
   - No offline support

## Future Enhancements

1. **User Features:**
   - Real authentication integration
   - User profiles
   - Post likes/favorites
   - Comments on posts
   - Follow other users

2. **Post Features:**
   - Draft posts (save without publishing)
   - Post visibility (public/private)
   - Post sharing
   - Print/export post

3. **Search & Discovery:**
   - Search posts by hashtag
   - Filter posts by rating
   - Sort posts (newest, popular, etc.)
   - Related posts recommendations

4. **Performance:**
   - Image optimization
   - Lazy loading
   - Caching strategies
   - Server-side rendering

5. **UX Improvements:**
   - Auto-save drafts
   - Undo/redo in editor
   - Rich text formatting
   - Image cropping/editing
   - Drag-and-drop image upload
   - Keyboard shortcuts

## Conclusion

This implementation provides a complete book review platform frontend with:
- Comprehensive book search
- Rich post creation experience
- Full CRUD operations for posts
- Image upload and management
- Hashtag support
- Validation and error handling
- Responsive design
- Accessible UI

The frontend is ready for integration with the test-api backend that implements the required endpoints.