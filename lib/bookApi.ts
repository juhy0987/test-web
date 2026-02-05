import axios from 'axios'
import { Book } from './types'

const ALADIN_API_KEY = process.env.NEXT_PUBLIC_ALADIN_API_KEY || ''
const ALADIN_API_URL = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx'

export interface AladinSearchParams {
  query: string
  queryType?: 'Title' | 'Author' | 'Publisher' | 'Keyword'
  maxResults?: number
  start?: number
}

export interface AladinBook {
  title: string
  author: string
  pubDate: string
  description: string
  isbn13: string
  cover: string
  publisher: string
  categoryName: string
  priceStandard: number
}

interface AladinResponse {
  version: string
  title: string
  link: string
  item: AladinBook[]
  itemsPerPage: number
  startIndex: number
  totalResults: number
}

/**
 * Search books from Aladin API
 */
export async function searchBooksFromAladin(
  params: AladinSearchParams
): Promise<Book[]> {
  try {
    const response = await axios.get<AladinResponse>(ALADIN_API_URL, {
      params: {
        ttbkey: ALADIN_API_KEY,
        Query: params.query,
        QueryType: params.queryType || 'Keyword',
        MaxResults: params.maxResults || 10,
        start: params.start || 1,
        SearchTarget: 'Book',
        output: 'js',
        Version: '20131101',
      },
    })

    if (!response.data || !response.data.item) {
      return []
    }

    return response.data.item.map((item) => ({
      isbn: item.isbn13,
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      coverImage: item.cover,
      pubDate: item.pubDate,
      description: item.description,
    }))
  } catch (error) {
    console.error('Aladin API error:', error)
    throw new Error('도서 검색에 실패했습니다.')
  }
}

/**
 * Search books via backend proxy endpoint
 */
export async function searchBooks(params: {
  query: string
  searchType?: 'title' | 'author' | 'isbn'
}): Promise<Book[]> {
  try {
    const { default: api } = await import('./api')
    const response = await api.get('/api/books/search', {
      params: {
        q: params.query,
        type: params.searchType || 'title',
      },
    })
    return response.data.books || []
  } catch (error) {
    console.error('Book search error:', error)
    // Fallback to direct Aladin API if backend is not available
    return searchBooksFromAladin({
      query: params.query,
      queryType:
        params.searchType === 'title'
          ? 'Title'
          : params.searchType === 'author'
          ? 'Author'
          : 'Keyword',
    })
  }
}
