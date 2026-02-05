# 모두의 책 (Everyone's Book) - Frontend

책에 대한 이야기를 나누는 공간

## 프로젝트 개요

모두의 책은 사용자들이 읽은 책에 대한 감상과 기록을 공유하는 플랫폼입니다. 사용자는 책을 검색하고, 별점을 매기고, 내용을 작성하며, 사진과 해시태그를 첨부하여 게시물을 작성할 수 있습니다.

## 주요 기능

### 도서 검색 및 선택
- 제목, 저자, ISBN으로 도서 검색
- 알라딘 API 연동
- 도서 표지, 제목, 저자, 출판사 정보 표시

### 게시물 작성
- **필수 항목**: 도서 선택, 별점 (1-5점)
- **선택 항목**: 내용 (최대 2,000자), 이미지 (최대 5개), 해시태그 (최대 10개)
- 실시간 글자 수 표시
- '#'로 시작하는 단어는 자동으로 해시태그로 변환
- 이미지 업로드 (JPG/PNG/GIF, 5MB 제한)
- 미리보기 설네일과 개별 삭제 기능

### 게시물 관리
- 게시물 상세 보기
- 게시물 수정
- 게시물 삭제
- 사용자 권한 찍에서

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Client**: Axios
- **Image Handling**: Next/Image

## 프로젝트 구조

```
test-web/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈 페이지
│   ├── globals.css           # 글로벌 스타일
│   └── posts/
│       ├── create/
│       │   └── page.tsx      # 게시물 작성 페이지
│       └── [id]/
│           ├── page.tsx      # 게시물 상세 페이지
│           └── edit/
│               └── page.tsx  # 게시물 수정 페이지
├── components/              # 재사용 가능한 컴포넌트
│   ├── BookSearch.tsx       # 도서 검색 컴포넌트
│   ├── StarRating.tsx       # 별점 입력 컴포넌트
│   ├── ImageUploader.tsx    # 이미지 업로드 컴포넌트
│   └── TextEditor.tsx       # 텍스트 편집기 컴포넌트
├── lib/                     # 유틸리티 함수
│   ├── api.ts               # API 클라이언트 설정
│   ├── types.ts             # TypeScript 타입 정의
│   ├── bookApi.ts           # 도서 검색 API
│   ├── postApi.ts           # 게시물 API
│   ├── imageUpload.ts       # 이미지 업로드 유틸리티
│   └── hashtags.ts          # 해시태그 처리 유틸리티
└── public/                  # 정적 파일
```

## 설치 및 실행

### 선행 조건

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# API 서버 URL (백엔드 API)
NEXT_PUBLIC_API_URL=http://localhost:3000

# 알라딘 API 키 (도서 검색용)
NEXT_PUBLIC_ALADIN_API_KEY=your_aladin_api_key_here
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 열어 결과를 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## API 연동

이 프로젝트는 `test-api` 백엔드 서버와 통신합니다. 다음 API 엔드포인트가 필요합니다:

### 도서 검색 API

```
GET /api/books/search?q={query}&type={searchType}
```

**Parameters:**
- `q`: 검색어
- `type`: `title` | `author` | `isbn`

**Response:**
```json
{
  "books": [
    {
      "isbn": "9788936433598",
      "title": "책 제목",
      "author": "저자명",
      "publisher": "출판사",
      "coverImage": "https://...",
      "pubDate": "2024-01-01",
      "description": "책 설명"
    }
  ]
}
```

### 게시물 API

#### 게시물 작성

```
POST /api/posts
```

**Request Body:**
```json
{
  "book": {
    "isbn": "9788936433598",
    "title": "책 제목",
    "author": "저자명",
    "publisher": "출판사",
    "coverImage": "https://..."
  },
  "rating": 5,
  "content": "게시물 내용",
  "images": ["https://..."],
  "hashtags": ["tag1", "tag2"]
}
```

#### 게시물 조회

```
GET /api/posts/{id}
```

#### 게시물 수정

```
PUT /api/posts/{id}
```

**Request Body:**
```json
{
  "rating": 4,
  "content": "수정된 내용",
  "images": ["https://..."],
  "hashtags": ["tag1"]
}
```

#### 게시물 삭제

```
DELETE /api/posts/{id}
```

**Authorization:** 모든 게시물 API는 JWT 토큰을 요구합니다.

```
Authorization: Bearer {token}
```

## 주요 컬포넌트 설명

### BookSearch

도서 검색 및 선택 컴포넌트

**Props:**
- `onSelectBook: (book: Book) => void` - 도서 선택 콜백
- `selectedBook: Book | null` - 현재 선택된 도서

**Features:**
- 제목, 저자, ISBN 검색
- 실시간 검색 결과 표시
- 드롭다운 UI

### StarRating

별점 입력 컴포넌트

**Props:**
- `rating: number` - 현재 별점 (1-5)
- `onRatingChange: (rating: number) => void` - 별점 변경 콜백
- `size?: 'sm' | 'md' | 'lg'` - 별 크기
- `readonly?: boolean` - 읽기 전용 모드

**Features:**
- 호버 효과
- 클릭으로 별점 선택
- 읽기 전용 모드 지원

### ImageUploader

이미지 업로드 컴포넌트

**Props:**
- `images: string[]` - 현재 이미지 URL 배열
- `onImagesChange: (images: string[]) => void` - 이미지 변경 콜백
- `maxImages?: number` - 최대 이미지 수 (기본: 5)

**Features:**
- 파일 형식 및 크기 검증 (JPG/PNG/GIF, 5MB)
- 미리보기 설네일
- 개별 이미지 삭제
- 드래그 & 드롭 지원 (향후 구현)

### TextEditor

텍스트 편집기 컴포넌트

**Props:**
- `value: string` - 현재 텍스트
- `onChange: (value: string) => void` - 텍스트 변경 콜백
- `maxLength?: number` - 최대 글자 수 (기본: 2000)
- `placeholder?: string` - 플레이스홀더

**Features:**
- 실시간 글자 수 표시
- 해시태그 자동 감지 및 스타일링
- 자동 높이 조절

## 개발 가이드

### 새로운 컬포넌트 추가

1. `components/` 디렉토리에 컴포넌트 파일 생성
2. TypeScript 타입 정의
3. Props 인터페이스 정의
4. 컴포넌트 구현
5. 스타일링 적용 (Tailwind CSS)

### API 통신 추가

1. `lib/types.ts`에 타입 정의
2. `lib/` 디렉토리에 API 함수 파일 생성
3. `lib/api.ts`의 axios 인스턴스 사용
4. 에러 처리 구현

### 새로운 페이지 추가

1. `app/` 디렉토리에 라우트 폴더 생성
2. `page.tsx` 파일 생성
3. 페이지 컴포넌트 구현
4. 필요한 경우 `layout.tsx` 추가

## 테스트

현재 테스트는 구현되지 않았습니다. 향후 추가될 예정입니다:

- Jest + React Testing Library
- E2E 테스트 (Playwright)

## 배포

### Vercel 배포

1. Vercel 계정에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 확인

### 도커 배포

```bash
# 도커 이미지 빌드
docker build -t test-web .

# 컨테이너 실행
docker run -p 3001:3001 test-web
```

## 기여

기여를 원하신다면:

1. 프로젝트를 포크하세요
2. feature 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 라이센스

MIT License

## 문의

프로젝트에 대한 문의나 제안은 이슈를 통해 등록해주세요.
