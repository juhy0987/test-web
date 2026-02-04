export interface Post {
  id: string;
  userId: string;
  book: {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    coverImage: string;
  };
  rating: number; // 1-5
  content: string; // max 2000 characters
  images: string[]; // max 5 images
  hashtags: string[]; // max 10 hashtags
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  book: {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    coverImage: string;
  };
  rating: number;
  content: string;
  images: string[];
  hashtags: string[];
}

export interface UpdatePostRequest {
  rating?: number;
  content?: string;
  images?: string[];
  hashtags?: string[];
}