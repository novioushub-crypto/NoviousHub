# Production Deployment Guide

Complete guide for deploying Noviious to production:
- Frontend: Vercel
- Backend: Fly.io
- Database: Supabase (PostgreSQL)
- Media Storage: Cloudinary

---

## 📋 Prerequisites

Before starting, ensure you have:
- [x] GitHub repository created and code pushed
- [ ] Vercel account (https://vercel.com)
- [ ] Fly.io account (https://fly.io)
- [ ] Supabase account (https://supabase.com)
- [ ] Cloudinary account (https://cloudinary.com)
- [ ] Domain name (optional, but recommended)

---

## 🗄️ STEP 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in details:
   - **Name**: `noviious-production`
   - **Database Password**: Use the password you have: `SzMz4vD24Vdje6iR`
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
4. Click "Create new project" (takes ~2 minutes)

### 1.2 Your Database Credentials

Based on your information:
```
Project ID: alhhmgbylcfggrgolcdv
Database Password: SzMz4vD24Vdje6iR
Connection String: postgresql://postgres:SzMz4vD24Vdje6iR@db.alhhmgbylcfggrgolcdv.supabase.co:5432/postgres
```

Save this for later use!

---

## ☁️ STEP 2: Setup Cloudinary

### 2.1 Your Cloudinary Credentials

Based on your information:
```
Cloud Name: dpcrsepms
API Key: 639394495474588
API Secret: [Your secret key]
Cloudinary URL: cloudinary://639394495474588:YOUR_SECRET@dpcrsepms
```

### 2.2 How Image Upload Works

```
React (Frontend) → Sends image file
    ↓
Django API (Backend) → Receives file
    ↓
Cloudinary → Stores image, returns URL
    ↓
Django → Saves URL to database
    ↓
React → Displays image from Cloudinary URL ✅
```

---

## 🚀 STEP 3: Deploy Backend to Fly.io

## 🚀 STEP 3: Deploy Backend to Fly.io

### 3.1 Install Fly CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 3.2 Login to Fly.io

```bash
fly auth login
```

### 3.3 Launch Fly.io App

```bash
cd backend
fly launch --no-deploy
```

Answer the prompts:
- **App name**: `noviious-backend` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `iad` for US East)
- **PostgreSQL**: No (we're using Supabase)
- **Redis**: No (not needed yet)

### 3.4 Set Environment Variables on Fly.io

Run these commands one by one:

```bash
# Database (Supabase)
fly secrets set DATABASE_URL="postgresql://postgres:SzMz4vD24Vdje6iR@db.alhhmgbylcfggrgolcdv.supabase.co:5432/postgres"

# Django Secret Key (generate a new one)
fly secrets set SECRET_KEY="your-super-secret-key-generate-new-one"

# Django Settings
fly secrets set DEBUG="False"
fly secrets set DJANGO_SETTINGS_MODULE="config.settings.production"

# Cloudinary
fly secrets set CLOUDINARY_CLOUD_NAME="dpcrsepms"
fly secrets set CLOUDINARY_API_KEY="639394495474588"
fly secrets set CLOUDINARY_API_SECRET="your-cloudinary-secret"
fly secrets set CLOUDINARY_URL="cloudinary://639394495474588:YOUR_SECRET@dpcrsepms"

# Frontend URL (update after deploying to Vercel)
fly secrets set FRONTEND_URL="https://www.noviious.com"
fly secrets set CORS_ALLOWED_ORIGINS="https://www.noviious.com,https://noviious.com"
fly secrets set ALLOWED_HOSTS="noviious-backend.fly.dev,.fly.dev,.vercel.app,www.noviious.com,noviious.com"
```

**To generate a new SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3.5 Deploy to Fly.io

```bash
fly deploy
```

This will:
- Build the Docker image
- Install all dependencies
- Deploy to Fly.io
- Start the application

### 3.6 Run Database Migrations

```bash
fly ssh console
cd /app
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_db
exit
```

### 3.7 Test Backend

```bash
fly open
```

Visit these URLs to test:
- Health check: `https://noviious-backend.fly.dev/api/v1/health/`
- Products: `https://noviious-backend.fly.dev/api/v1/products/`
- Admin: `https://noviious-backend.fly.dev/admin/`

---

## 🌐 STEP 4: Deploy Frontend to Vercel

## 🌐 STEP 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment Variables

The frontend needs to know where the backend API is. Create/update `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://noviious-backend.fly.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
```

### 4.2 Update next.config.js for Cloudinary Images

Update `frontend/next.config.js` to allow images from Cloudinary:

```javascript
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
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
}

module.exports = nextConfig
```

### 4.3 Deploy to Vercel (Recommended Method)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `novioushub-crypto/NoviousHub`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://noviious-backend.fly.dev
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
   ```
6. Click "Deploy"

### 4.4 Alternative: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

### 4.5 Get Your Vercel URL

After deployment, you'll get URLs like:
- Production: `https://www.noviious.com` (if custom domain configured)
- Preview: `https://novious-hub.vercel.app`

---

## 🔄 STEP 5: Update Backend with Frontend URL

Now that you have your Vercel URL, update the backend CORS settings:

```bash
cd backend
fly secrets set FRONTEND_URL="https://www.noviious.com"
fly secrets set CORS_ALLOWED_ORIGINS="https://www.noviious.com,https://noviious.com"
```

Redeploy backend:
```bash
fly deploy
```

---

## 🔐 STEP 6: Configure Google OAuth

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Update **Authorized JavaScript origins**:
   ```
   https://www.noviious.com
   https://noviious.com
   https://noviious-backend.fly.dev
   ```
6. Update **Authorized redirect URIs**:
   ```
   https://www.noviious.com/auth/google/callback
   https://noviious-backend.fly.dev/auth/google/callback
   ```
7. Click "Save"

---

## � STEP 7: Upload Existing Product Images to Cloudinary

You have two options to migrate your existing product images:

### Option A: Manual Upload via Cloudinary Dashboard

1. Go to https://cloudinary.com/console
2. Click "Media Library"
3. Create a folder called "products"
4. Upload your images from `backend/media/products/`
5. Note the URLs for each image

### Option B: Programmatic Upload (Recommended)

Create a management command to upload all existing images:

```bash
fly ssh console
cd /app
python manage.py shell
```

Then run:
```python
import cloudinary.uploader
from apps.products.models import ProductImage

for img in ProductImage.objects.all():
    if img.image:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            img.image.path,
            folder="products",
            public_id=f"product_{img.product.id}_{img.id}"
        )
        # Update the image URL
        img.image_url = result['secure_url']
        img.save()
        print(f"Uploaded: {img.product.name} - {result['secure_url']}")
```

---

## ✅ STEP 8: Final Testing Checklist

### 7.1 Test All Features

- [ ] Homepage loads correctly
- [ ] Products page displays items
- [ ] Product detail pages work
- [ ] Cart functionality works
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Admin dashboard accessible
- [ ] Product creation/edit/delete works
- [ ] Images load properly
- [ ] Theme toggle works
- [ ] Welcome modal appears for new users

### 7.2 Performance Optimization

**Frontend (Vercel):**
- Vercel automatically handles caching and CDN
- Images are optimized via Next.js Image component

**Backend (Fly.io):**
```bash
# Scale up if needed
fly scale vm shared-cpu-1x --memory 512

# Add more regions
fly regions add lax syd
```

### 7.3 Monitoring

**Fly.io Monitoring:**
```bash
fly logs
fly status
fly dashboard
```

**Vercel Monitoring:**
- Go to your project dashboard
- Check Analytics tab
- Monitor deployment logs

---

## 🔧 STEP 8: Custom Domain (Optional)

### 8.1 Add Domain to Vercel

1. Go to your Vercel project
2. Settings → Domains
3. Add your domain: `noviious.com`
4. Follow DNS configuration instructions

### 8.2 Add Domain to Fly.io

```bash
fly certs add api.noviious.com
```

Update DNS:
```
CNAME api.noviious.com -> noviious-backend.fly.dev
```

### 8.3 Update Environment Variables

Update all URLs to use your custom domain.

---

## 🚨 Troubleshooting

### Backend Issues

**Database connection errors:**
```bash
fly ssh console
python manage.py dbshell
```

**Static files not loading:**
```bash
python manage.py collectstatic --noinput
```

**Check logs:**
```bash
fly logs
```

### Frontend Issues

**Build failures:**
- Check Vercel deployment logs
- Verify environment variables are set
- Check for TypeScript errors

**API connection issues:**
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Verify backend is running: `fly status`

### Database Issues

**Run migrations:**
```bash
fly ssh console
python manage.py migrate
```

**Reset database (CAUTION):**
```bash
fly ssh console
python manage.py flush
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_db
```

---

## 📊 Cost Estimates

### Free Tier Limits:

**Supabase Free:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

**Fly.io Free:**
- 3 shared-cpu-1x VMs
- 160 GB bandwidth
- 3 GB persistent volume storage

**Vercel Free:**
- 100 GB bandwidth
- Unlimited deployments
- Automatic SSL

### When to Upgrade:

- **Supabase**: When you exceed 500 MB database
- **Fly.io**: When you need more than 256 MB RAM or multiple regions
- **Vercel**: When you exceed 100 GB bandwidth

---

## 🔄 Continuous Deployment

### Auto-deploy on Git Push

**Vercel:**
- Already configured automatically
- Every push to `main` triggers deployment

**Fly.io:**
Create `.github/workflows/fly-deploy.yml`:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: ./backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Add `FLY_API_TOKEN` to GitHub Secrets:
```bash
fly auth token
```

---

## 📝 Environment Variables Checklist

### Backend (Fly.io):
- [ ] DATABASE_URL
- [ ] SECRET_KEY
- [ ] DEBUG=False
- [ ] DJANGO_SETTINGS_MODULE=config.settings.production
- [ ] GOOGLE_OAUTH2_CLIENT_ID
- [ ] GOOGLE_OAUTH2_CLIENT_SECRET
- [ ] FRONTEND_URL

### Frontend (Vercel):
- [ ] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID

---

## 🎉 You're Done!

Your application is now live:
- **Frontend**: https://novious-hub.vercel.app
- **Backend**: https://noviious-backend.fly.dev
- **Admin**: https://novious-hub.vercel.app/admin

### Next Steps:
1. Set up monitoring and alerts
2. Configure backups for Supabase
3. Add analytics (Google Analytics, Plausible, etc.)
4. Set up error tracking (Sentry)
5. Configure email service (SendGrid, Mailgun)
6. Add payment processing (Stripe, PayPal)
7. Implement caching (Redis)
8. Set up CDN for media files

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Fly.io Docs**: https://fly.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Django Docs**: https://docs.djangoproject.com
- **Next.js Docs**: https://nextjs.org/docs

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Generate new SECRET_KEY for production
- [ ] Enable HTTPS only
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Set up CORS correctly
- [ ] Enable CSRF protection
- [ ] Use environment variables for secrets
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure security headers
- [ ] Set up SSL certificates
- [ ] Enable 2FA for admin accounts

---

Good luck with your deployment! 🚀
