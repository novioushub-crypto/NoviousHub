# Robots.txt Configuration Explained

## What Changed

Removed `/api/` from the disallow list to allow search engines to access any frontend API routes if needed.

## Current Configuration

### What's BLOCKED (Disallowed)
- `/admin/` - Admin dashboard (private)
- `/account/` - User account pages (private)
- `/checkout/` - Checkout process (private)
- `/cart/` - Shopping cart (private)
- `/auth/verify-otp/` - OTP verification (private)
- `/_next/` - Next.js internal files (not useful for SEO)
- `/static/` - Static assets (not useful for SEO)

### What's ALLOWED (Crawlable)
- `/` - Homepage ✅
- `/products` - All product pages ✅
- `/products/[slug]` - Individual products ✅
- `/category/[slug]` - Category pages ✅
- `/about` - About page ✅
- `/contact` - Contact page ✅
- `/faq` - FAQ page ✅
- `/auth/login` - Login page ✅
- `/auth/register` - Register page ✅
- Any API routes (if you have frontend API routes) ✅

## Important Notes

### Frontend vs Backend API
Your robots.txt only affects your **frontend domain** (noviious.com).

- **Frontend:** `https://noviious.com` (controlled by this robots.txt)
- **Backend API:** `https://noviious-backend.fly.dev` (separate domain, separate robots.txt)

The `/api/` in robots.txt would only block Next.js API routes on your frontend, NOT your backend API.

### Why Remove `/api/` from Disallow?
1. Your backend API is on a different domain (not affected by this robots.txt)
2. If you have any frontend API routes, they might need to be crawlable
3. Most Next.js apps don't have frontend API routes that need blocking
4. It's more permissive and won't accidentally block anything important

## Current Robots.txt Output

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /auth/verify-otp/
Disallow: /_next/
Disallow: /static/

User-Agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /auth/verify-otp/

User-Agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/
Disallow: /auth/verify-otp/

Sitemap: https://noviious.com/sitemap.xml
```

## What Google Will Crawl

✅ **Will be indexed:**
- Homepage
- Product listing page
- Individual product pages
- Category pages
- About, Contact, FAQ pages
- Login/Register pages (for navigation)

❌ **Won't be indexed:**
- Admin pages
- User account pages
- Checkout pages
- Shopping cart
- OTP verification

## Testing Your Robots.txt

### 1. View in Browser
Visit: `https://noviious.com/robots.txt`

### 2. Test with Google Search Console
1. Go to: https://search.google.com/search-console
2. Navigate to: Settings > Crawling > robots.txt Tester
3. Test specific URLs to see if they're allowed

### 3. Test Specific URLs
Use Google's robots.txt tester to check:
- ✅ `https://noviious.com/products` - Should be ALLOWED
- ✅ `https://noviious.com/products/leather-jacket` - Should be ALLOWED
- ✅ `https://noviious.com/category/jackets` - Should be ALLOWED
- ❌ `https://noviious.com/admin` - Should be BLOCKED
- ❌ `https://noviious.com/checkout` - Should be BLOCKED

## Best Practices

### ✅ DO Block:
- Admin areas
- User account pages
- Checkout/payment pages
- Private user data
- Duplicate content
- Internal system files

### ❌ DON'T Block:
- Product pages
- Category pages
- Public content pages
- Blog posts
- Landing pages
- Contact/About pages

## If You Need to Block More

Edit `frontend/app/robots.ts` and add to the `disallow` array:

```typescript
disallow: [
  '/admin/',
  '/account/',
  '/your-new-path/',  // Add here
],
```

Then rebuild:
```bash
npm run build
```

## Summary

Your robots.txt is now optimized for SEO:
- ✅ All public pages are crawlable
- ✅ Private pages are blocked
- ✅ Sitemap is referenced
- ✅ Works for all major search engines

Deploy and your site will be ready for indexing! 🚀
