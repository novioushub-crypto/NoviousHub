# SEO Setup Guide for Noviious

## Overview
This guide covers the complete SEO implementation for your Next.js application, including sitemap, robots.txt, structured data, and Google Search Console setup.

## Files Created

### 1. Core SEO Files
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt configuration
- `app/manifest.ts` - PWA manifest for mobile optimization
- `lib/seo.ts` - SEO utility functions and schema generators
- `components/seo/StructuredData.tsx` - JSON-LD structured data component

### 2. Analytics Files
- `lib/analytics.ts` - Google Analytics tracking functions
- `components/analytics/GoogleAnalytics.tsx` - GA4 integration component

## Setup Instructions

### Step 1: Environment Variables
Add these to your `.env.local` and `.env.production`:

```env
NEXT_PUBLIC_SITE_URL=https://noviious.com
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Step 2: Google Search Console Setup

1. **Verify Your Site**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your property (https://noviious.com)
   - Choose verification method (HTML tag recommended)
   - Update the verification code in `app/layout.tsx` under `metadata.verification.google`

2. **Submit Sitemap**
   - After verification, go to "Sitemaps" in the left menu
   - Submit: `https://noviious.com/sitemap.xml`
   - Google will automatically discover and index your pages

3. **Request Indexing**
   - Use URL Inspection tool for important pages
   - Request indexing for key pages (homepage, main product pages)

### Step 3: Google Analytics Setup

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com)
   - Create a new GA4 property
   - Copy your Measurement ID (G-XXXXXXXXXX)
   - Add it to your environment variables

2. **Enable Enhanced Measurement**
   - In GA4, go to Admin > Data Streams
   - Click your web stream
   - Enable Enhanced Measurement for automatic event tracking

### Step 4: Bing Webmaster Tools (Optional)

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add and verify your site
3. Submit sitemap: `https://noviious.com/sitemap.xml`
4. Update verification code in `app/layout.tsx` under `metadata.verification.bing`

### Step 5: Create Required Images

Create these images in your `public` folder:

```
public/
├── favicon.ico (32x32)
├── apple-icon.png (180x180)
├── icon-192.png (192x192)
├── icon-512.png (512x512)
├── og-image.jpg (1200x630) - Open Graph image
└── logo.png (your logo)
```

## SEO Features Implemented

### 1. Dynamic Sitemap
- Automatically includes all products and categories
- Updates hourly with new content
- Proper priority and change frequency settings

### 2. Robots.txt
- Allows search engines to crawl public pages
- Blocks admin, checkout, and private areas
- Includes sitemap reference

### 3. Structured Data (JSON-LD)
- Organization schema
- Website schema with search functionality
- Product schema (use in product pages)
- Breadcrumb schema (use in navigation)

### 4. Meta Tags
- Open Graph for social sharing
- Twitter Cards
- Canonical URLs
- Mobile optimization
- Rich metadata for all pages

### 5. Performance Optimizations
- Next.js Image optimization
- Font optimization (Google Fonts)
- Static generation where possible
- ISR (Incremental Static Regeneration) for dynamic content

## Using SEO Utilities in Your Pages

### Product Page Example

```typescript
import { generateSEO, generateProductSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.slug)
  
  return generateSEO({
    title: product.name,
    description: product.description,
    keywords: [product.category, 'leather jacket', 'premium'],
    image: product.image,
    url: `/products/${product.slug}`,
    type: 'product',
    price: product.price.toString(),
  })
}

export default function ProductPage({ product }) {
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    sku: product.sku,
    url: `/products/${product.slug}`,
  })

  return (
    <>
      <StructuredData data={productSchema} />
      {/* Your product content */}
    </>
  )
}
```

### Category Page Example

```typescript
import { generateSEO, generateBreadcrumbSchema } from '@/lib/seo'

export async function generateMetadata({ params }): Promise<Metadata> {
  return generateSEO({
    title: `${params.slug} - Shop Premium Products`,
    description: `Browse our collection of ${params.slug}`,
    url: `/category/${params.slug}`,
  })
}
```

## Monitoring & Optimization

### 1. Google Search Console
- Monitor indexing status
- Check for crawl errors
- Analyze search performance
- Submit new pages for indexing

### 2. Google Analytics
- Track page views and user behavior
- Monitor conversion rates
- Analyze traffic sources
- Set up custom events

### 3. PageSpeed Insights
- Test: https://pagespeed.web.dev/
- Aim for 90+ scores on mobile and desktop
- Monitor Core Web Vitals

### 4. Rich Results Test
- Test structured data: https://search.google.com/test/rich-results
- Ensure product schema is valid

## SEO Best Practices Checklist

- [x] Sitemap.xml generated and submitted
- [x] Robots.txt configured
- [x] Meta tags optimized
- [x] Structured data implemented
- [x] Canonical URLs set
- [x] Open Graph tags added
- [x] Twitter Cards configured
- [x] Google Analytics integrated
- [ ] SSL certificate installed (HTTPS)
- [ ] Site verified in Google Search Console
- [ ] Images optimized (WebP format recommended)
- [ ] Page load time < 3 seconds
- [ ] Mobile-friendly design
- [ ] Internal linking strategy
- [ ] XML sitemap submitted to search engines

## Quick Indexing Tips

1. **Submit to Google Search Console immediately**
2. **Create quality backlinks** from reputable sites
3. **Share on social media** to generate traffic
4. **Update content regularly** to show freshness
5. **Use Google's URL Inspection tool** for priority pages
6. **Create a blog** with regular content updates
7. **Optimize for Core Web Vitals** (LCP, FID, CLS)
8. **Build internal links** between related pages

## Troubleshooting

### Sitemap not showing in Search Console
- Verify the URL is accessible: `https://noviious.com/sitemap.xml`
- Check for XML syntax errors
- Ensure robots.txt allows sitemap access

### Pages not indexing
- Check robots.txt isn't blocking pages
- Verify canonical URLs are correct
- Ensure pages return 200 status code
- Check for noindex meta tags

### Structured data errors
- Use Rich Results Test tool
- Validate JSON-LD syntax
- Ensure all required fields are present

## Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev Performance](https://web.dev/performance/)

## Support

For issues or questions, refer to:
- Next.js documentation
- Google Search Console Help
- Your development team
