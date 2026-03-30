import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  price?: string
  currency?: string
  availability?: string
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  price,
  currency = 'USD',
  availability = 'in stock',
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      type,
      url: fullUrl,
      title: title || 'Noviious',
      description: description || 'Premium Leather Jackets & Sportswear',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || 'Noviious',
        },
      ],
      siteName: 'Noviious',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'Noviious',
      description: description || 'Premium Leather Jackets & Sportswear',
      images: [fullImageUrl],
      creator: '@noviious',
    },
    alternates: {
      canonical: fullUrl,
    },
  }

  // Add product-specific metadata using other field
  if (price) {
    metadata.other = {
      'product:price:amount': price,
      'product:price:currency': currency,
      'product:availability': availability,
    }
  }

  return metadata
}

// JSON-LD structured data generators
export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  brand?: string
  sku?: string
  availability?: string
  rating?: number
  reviewCount?: number
  url: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Noviious',
    },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}${product.url}`,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Noviious',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Premium Leather Jackets & Sportswear',
    sameAs: [
      'https://facebook.com/noviious',
      'https://twitter.com/noviious',
      'https://instagram.com/noviious',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@noviious.com',
    },
  }
}

export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Noviious',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
