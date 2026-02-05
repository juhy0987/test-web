import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">모두의 책</h1>
        <p className="text-xl text-gray-600 mb-8">
          책에 대한 이야기를 나누는 공간
        </p>
        <Link
          href="/posts/create"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          게시물 작성하기
        </Link>
      </div>
    </div>
  )
}
