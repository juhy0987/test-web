import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '모두의 책 - 책에 대한 이야기를 나누는 공간',
  description: '사용자가 읽은 책에 대한 감상과 기록을 공유하는 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <main>{children}</main>
      </body>
    </html>
  )
}
