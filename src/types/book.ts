export interface Book {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImage: string;
  publicationDate?: string;
  description?: string;
}

export interface BookSearchParams {
  query: string;
  searchType?: 'title' | 'author' | 'isbn';
  page?: number;
  limit?: number;
}

export interface BookSearchResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}