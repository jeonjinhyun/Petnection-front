/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'http://125.132.216.190:9100/api/v1',
  },
  images: {
    domains: ['125.132.216.190'],
  },
}

module.exports = nextConfig 