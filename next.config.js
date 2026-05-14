/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['cashpcwfpkneipdtrfiq.supabase.co'],
  },
}

module.exports = nextConfig
