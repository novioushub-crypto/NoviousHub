# Production Deployment Guide

Complete guide for deploying Noviious to production:
- Frontend: Vercel
- Backend: Fly.io
- Database: Supabase (PostgreSQL)

---

## 📋 Prerequisites

Before starting, ensure you have:
- [x] GitHub repository created and code pushed
- [ ] Vercel account (https://vercel.com)
- [ ] Fly.io account (https://fly.io)
- [ ] Supabase account (https://supabase.com)
- [ ] Domain name (optional, but recommended)

---

## 🗄️ STEP 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in details:
   - **Name**: `noviious-production`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
4. Click "Create new project" (takes ~2 minutes)

### 1.2 Get Database Credentials

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password

### 1.3 Save These Values (You'll need them later):

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
DB_HOST=db.xxxxx.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_PORT=5432
```

---

## 🚀 STEP 2: Deploy Backend to Fly.io

### 2.1 Install Fly CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### 2.2 Login to Fly.io

```bash
fly auth login
```

### 2.3 Update Backend Configuration

First, update `backend/config/settings/production.py`:

```python
# Add at the top
import dj_database_url

# Update DATABASES
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Update ALLOWED_HOSTS
ALLOWED_HOSTS = [
    'noviious-backend.fly.dev',  # Your fly.io domain
    '.vercel.app',  # Your Vercel domain
    'yourdomain.com',  # Your custom domain (if any)
]

# Update CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGINS = [
    'https://noviious.vercel.app',  # Your Vercel domain
    'https://yourdomain.com',  # Your custom domain (if any)
]

# Update CSRF_TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = [
    'https://noviious.vercel.app',
    'https://yourdomain.com',
]
```

### 2.4 Update requirements/production.txt

Add these packages:
```txt
dj-database-url==2.1.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
whitenoise==6.6.0
```

### 2.5 Create/Update fly.toml

The file already exists, but verify it has:

```toml
app = "noviious-backend"
primary_region = "iad"

[build]
  [build.args]
    PYTHON_VERSION = "3.11"

[env]
  PORT = "8000"
  DJANGO_SETTINGS_MODULE = "config.settings.production"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[mounts]
  source = "noviious_media"
  destination = "/app/media"
```

### 2.6 Launch Fly.io App

```bash
cd backend
fly launch --no-deploy
```

Answer the prompts:
- **App name**: `noviious-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **PostgreSQL**: No (we're using Supabase)
- **Redis**: No (not needed yet)

### 2.7 Set Environment Variables

```bash
# Database
fly secrets set DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Django
fly secrets set SECRET_KEY="your-super-secret-key-here-generate-a-new-one"
fly secrets set DEBUG="False"
fly secrets set DJANGO_SETTINGS_MODULE="config.settings.production"

# Google OAuth
fly secrets set GOOGLE_OAUTH2_CLIENT_ID="YOUR-GOOGLE-CLIENT-ID"
fly secrets set GOOGLE_OAUTH2_CLIENT_SECRET="YOUR-GOOGLE-CLIENT-SECRET"

# Frontend URL (update after deploying to Vercel)
fly secrets set FRONTEND_URL="https://noviious.vercel.app"
```

**Generate a new SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.8 Create Volume for Media Files

```bash
fly volumes create noviious_media --size 1
```

### 2.9 Deploy to Fly.io

```bash
fly deploy
```

### 2.10 Run Database Migrations

```bash
fly ssh console
cd /app
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_db
exit
```

### 2.11 Test Backend

```bash
fly open
```

Visit: `https://noviious-backend.fly.dev/api/v1/products/`

---

## 🌐 STEP 3: Deploy Frontend to Vercel

### 3.1 Update Frontend Environment Variables

Create `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://noviious-backend.fly.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
```

### 3.2 Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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

### 3.3 Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

**Option B: Using Vercel Dashboard (Recommended)**

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

### 3.4 Get Your Vercel URL

After deployment, you'll get a URL like:
```
https://novious-hub.vercel.app
```

---

## 🔄 STEP 4: Update Backend with Frontend URL

Now that you have your Vercel URL, update the backend:

```bash
cd backend
fly secrets set FRONTEND_URL="https://novious-hub.vercel.app"
```

Update `backend/config/settings/production.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://novious-hub.vercel.app',  # Your actual Vercel URL
]

CSRF_TRUSTED_ORIGINS = [
    'https://novious-hub.vercel.app',
]
```

Redeploy backend:
```bash
fly deploy
```

---

## 🔐 STEP 5: Update Google OAuth Settings

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Update **Authorized JavaScript origins**:
   ```
   https://novious-hub.vercel.app
   https://noviious-backend.fly.dev
   ```
6. Update **Authorized redirect URIs** (if needed):
   ```
   https://novious-hub.vercel.app/auth/google/callback
   ```
7. Click "Save"

---

## 📦 STEP 6: Upload Media Files

Your product images need to be uploaded to the production server.

### Option A: Using Fly.io SSH

```bash
fly ssh console
cd /app/media
# Upload your images here
```

### Option B: Use Cloud Storage (Recommended for Production)

Consider using AWS S3, Cloudinary, or similar for media files.

**Install django-storages and boto3:**

```bash
pip install django-storages boto3
```

Update `backend/config/settings/production.py`:

```python
# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

# Media files
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
```

---

## ✅ STEP 7: Final Checks

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
