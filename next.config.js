/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/wordle/:path*',
        destination: 'http://localhost:3100/:path*',
      },
    ]
  },
}

module.exports = nextConfig