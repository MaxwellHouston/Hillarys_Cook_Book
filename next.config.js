/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Keep Firebase Storage temporarily until migration script is run
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
}

module.exports = nextConfig
