/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dpcrsepms/**',
      },
      {
        protocol: 'https',
        hostname: 'noviious-backend.fly.dev',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Increase timeout for static page generation
  staticPageGenerationTimeout: 180,
  // Enable compression
  compress: true,
  // Generate ETags for caching
  generateEtags: true,
  // Power page optimization
  poweredByHeader: false,
  // Strict mode for better SEO
  reactStrictMode: true,
  // Optimize fonts
  optimizeFonts: true,
  // Enable SWC minification
  swcMinify: true,
}

module.exports = nextConfig
