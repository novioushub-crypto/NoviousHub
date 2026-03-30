import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
  ]

  // Only fetch dynamic routes in production runtime, not during build
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Fetch dynamic product routes from your API
      const productsResponse = await fetch(`${apiUrl}/products/`, {
        next: { revalidate: 3600 }, // Revalidate every hour
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      
      let productRoutes: MetadataRoute.Sitemap = []
      
      if (productsResponse.ok) {
        const products = await productsResponse.json()
        productRoutes = products.results?.map((product: any) => ({
          url: `${baseUrl}/products/${product.slug}`,
          lastModified: new Date(product.updated_at || product.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })) || []
      }

      // Fetch dynamic category routes
      const categoriesResponse = await fetch(`${apiUrl}/products/categories/`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      })
      
      let categoryRoutes: MetadataRoute.Sitemap = []
      
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json()
        categoryRoutes = categories.map((category: any) => ({
          url: `${baseUrl}/category/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      }

      return [...staticRoutes, ...productRoutes, ...categoryRoutes]
    } catch (error) {
      console.log('Sitemap: Using static routes only (API not available during build)')
      return staticRoutes
    }
  }

  // Return static routes during build
  return staticRoutes
}
