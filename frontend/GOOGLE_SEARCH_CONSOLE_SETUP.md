# Google Search Console Setup - Quick Start Guide

## Step-by-Step Setup Process

### 1. Verify Your Website (5 minutes)

1. **Go to Google Search Console**
   - Visit: https://search.google.com/search-console
   - Sign in with your Google account

2. **Add Your Property**
   - Click "Add Property"
   - Choose "URL prefix" method
   - Enter: `https://noviious.com`
   - Click "Continue"

3. **Verify Ownership** (Choose ONE method)

   **Method A: HTML Tag (Recommended)**
   - Copy the meta tag provided by Google
   - Open `frontend/app/layout.tsx`
   - Replace `'your-google-verification-code'` with your actual code
   - Example: `google: 'abc123xyz456'`
   - Deploy your site
   - Click "Verify" in Search Console

   **Method B: HTML File**
   - Download the HTML file from Google
   - Place it in `frontend/public/` folder
   - Deploy your site
   - Click "Verify" in Search Console

   **Method C: DNS Record**
   - Add TXT record to your domain DNS
   - Wait for DNS propagation (can take up to 48 hours)
   - Click "Verify" in Search Console

### 2. Submit Your Sitemap (2 minutes)

1. **Access Sitemaps Section**
   - In Search Console, click "Sitemaps" in the left menu

2. **Submit Sitemap URL**
   - Enter: `sitemap.xml`
   - Click "Submit"
   - Status should show "Success" within a few minutes

3. **Verify Sitemap**
   - Check that your sitemap is accessible at: `https://noviious.com/sitemap.xml`
   - Should show XML with all your pages listed

### 3. Request Indexing for Priority Pages (10 minutes)

1. **Use URL Inspection Tool**
   - Click "URL Inspection" at the top
   - Enter your homepage URL: `https://noviious.com`
   - Click "Request Indexing"

2. **Index These Priority Pages First**
   ```
   https://noviious.com
   https://noviious.com/products
   https://noviious.com/about
   https://noviious.com/contact
   [Your top 5-10 product pages]
   ```

3. **Wait for Indexing**
   - Initial indexing: 1-7 days
   - Full site indexing: 2-4 weeks
   - Check status in "Coverage" report

### 4. Set Up Additional Search Engines

#### Bing Webmaster Tools
1. Visit: https://www.bing.com/webmasters
2. Sign in with Microsoft account
3. Add your site
4. Import settings from Google Search Console (easiest method)
5. Or verify manually using HTML tag method
6. Submit sitemap: `https://noviious.com/sitemap.xml`

#### Yandex Webmaster (Optional - for Russian market)
1. Visit: https://webmaster.yandex.com
2. Add and verify your site
3. Submit sitemap

### 5. Configure Google Analytics (5 minutes)

1. **Create GA4 Property**
   - Visit: https://analytics.google.com
   - Click "Admin" (bottom left)
   - Click "Create Property"
   - Enter property name: "Noviious"
   - Set timezone and currency
   - Click "Next"

2. **Create Data Stream**
   - Choose "Web"
   - Enter website URL: `https://noviious.com`
   - Enter stream name: "Noviious Website"
   - Click "Create stream"

3. **Copy Measurement ID**
   - Copy the Measurement ID (format: G-XXXXXXXXXX)
   - Add to your `.env.local` and `.env.production`:
   ```env
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

4. **Enable Enhanced Measurement**
   - In your data stream settings
   - Toggle on "Enhanced Measurement"
   - This tracks: page views, scrolls, outbound clicks, site search, video engagement, file downloads

5. **Link to Search Console**
   - In GA4, go to Admin > Product Links
   - Click "Search Console Links"
   - Click "Link"
   - Select your Search Console property
   - Click "Confirm"

### 6. Verify Everything is Working

#### Check Sitemap
```bash
# Visit in browser:
https://noviious.com/sitemap.xml
```
Should display XML with all your pages.

#### Check Robots.txt
```bash
# Visit in browser:
https://noviious.com/robots.txt
```
Should show your robots configuration.

#### Check Structured Data
1. Visit: https://search.google.com/test/rich-results
2. Enter your homepage URL
3. Should show valid Organization and Website schemas

#### Check Page Speed
1. Visit: https://pagespeed.web.dev/
2. Enter your URL
3. Aim for 90+ on both mobile and desktop

#### Check Mobile Friendliness
1. Visit: https://search.google.com/test/mobile-friendly
2. Enter your URL
3. Should pass all mobile tests

### 7. Monitor Your Progress

#### Week 1-2: Initial Indexing
- Check "URL Inspection" tool daily
- Monitor "Coverage" report for indexed pages
- Fix any crawl errors immediately

#### Week 3-4: Full Indexing
- Most pages should be indexed
- Check "Performance" report for search impressions
- Monitor "Enhancements" for any issues

#### Ongoing: Monthly Checks
- Review "Performance" report
- Check for crawl errors
- Monitor Core Web Vitals
- Update sitemap if you add new pages

## Quick Verification Checklist

- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google
- [ ] Priority pages requested for indexing
- [ ] Bing Webmaster Tools configured
- [ ] Google Analytics GA4 set up
- [ ] Analytics linked to Search Console
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Structured data validated
- [ ] Mobile-friendly test passed
- [ ] PageSpeed score > 80
- [ ] HTTPS enabled (SSL certificate)
- [ ] Canonical URLs set correctly
- [ ] Meta descriptions on all pages
- [ ] Open Graph images configured

## Expected Timeline

| Timeframe | What to Expect |
|-----------|----------------|
| Day 1 | Sitemap submitted, verification complete |
| Days 2-7 | First pages start appearing in Google |
| Days 7-14 | Homepage and main pages indexed |
| Days 14-30 | Most pages indexed, search impressions begin |
| Month 2+ | Regular traffic from search engines |

## Common Issues & Solutions

### Issue: Sitemap not found
**Solution:** 
- Verify URL is accessible: `https://noviious.com/sitemap.xml`
- Check that `NEXT_PUBLIC_SITE_URL` is set correctly in environment variables
- Rebuild and redeploy your application

### Issue: Pages not indexing
**Solution:**
- Check robots.txt isn't blocking pages
- Verify pages return 200 status code
- Use URL Inspection tool to see specific errors
- Ensure pages have unique titles and descriptions

### Issue: Structured data errors
**Solution:**
- Use Rich Results Test: https://search.google.com/test/rich-results
- Check JSON-LD syntax in browser console
- Verify all required schema fields are present

### Issue: Duplicate content
**Solution:**
- Ensure canonical URLs are set correctly
- Check for www vs non-www issues
- Verify no duplicate pages exist

## Pro Tips for Faster Indexing

1. **Create Quality Content**
   - Write unique product descriptions
   - Add blog posts regularly
   - Include relevant keywords naturally

2. **Build Backlinks**
   - Share on social media
   - Submit to relevant directories
   - Partner with industry blogs

3. **Optimize Images**
   - Use descriptive file names
   - Add alt text to all images
   - Compress images for faster loading

4. **Internal Linking**
   - Link related products
   - Create category pages
   - Add breadcrumb navigation

5. **Update Regularly**
   - Add new products frequently
   - Update existing content
   - Keep blog active

6. **Mobile Optimization**
   - Test on real devices
   - Ensure touch targets are large enough
   - Optimize for mobile speed

## Support Resources

- **Google Search Console Help:** https://support.google.com/webmasters
- **Google Analytics Help:** https://support.google.com/analytics
- **Next.js SEO Guide:** https://nextjs.org/learn/seo/introduction-to-seo
- **Schema.org Documentation:** https://schema.org/

## Need Help?

If you encounter issues:
1. Check the Search Console "Coverage" report for specific errors
2. Use the URL Inspection tool to diagnose individual pages
3. Review the SEO_SETUP_GUIDE.md for detailed implementation info
4. Test your structured data with Google's Rich Results Test

---

**Last Updated:** March 2026
**Next Review:** After initial indexing (2-4 weeks)
