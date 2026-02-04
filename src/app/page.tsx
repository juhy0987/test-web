import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Share Your Book Reviews
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Discover great books and share your thoughts with the community
        </p>
        <Link
          href="/posts/create"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create New Post
        </Link>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h3>
        <div className="text-center text-gray-500 py-12">
          <p>No posts yet. Be the first to share a book review!</p>
        </div>
      </section>
    </div>
  )
}
