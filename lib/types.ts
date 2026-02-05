export interface Book {
  isbn: string
  title: string
  author: string
  publisher: string
  coverImage: string
  pubDate?: string
  description?: string
}

export interface Post {
  id: number
  userId: number
  book: Book
  rating: number
  content: string
  images: string[]
  hashtags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  book: Book
  rating: number
  content: string
  images: string[]
  hashtags: string[]
}

export interface UpdatePostData {
  rating?: number
  content?: string
  images?: string[]
  hashtags?: string[]
}
