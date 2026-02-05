/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.aladin.co.kr', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.aladin.co.kr',
      },
    ],
  },
}

module.exports = nextConfig
