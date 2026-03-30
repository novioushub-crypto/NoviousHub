import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/api/',
          '/auth/verify-otp/',
          '/_next/',
          '/static/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/api/',
          '/auth/verify-otp/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/api/',
          '/auth/verify-otp/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
