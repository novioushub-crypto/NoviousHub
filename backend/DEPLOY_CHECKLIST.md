# Fly.io Deployment Checklist

## Before Deploying

Make sure you have set ALL these environment variables on Fly.io:

```bash
# 1. Database (Supabase)
fly secrets set DATABASE_URL="postgresql://postgres:SzMz4vD24Vdje6iR@db.alhhmgbylcfggrgolcdv.supabase.co:5432/postgres"

# 2. Django Secret Key (generate a new one!)
fly secrets set SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"

# 3. Django Settings
fly secrets set DEBUG="False"
fly secrets set DJANGO_SETTINGS_MODULE="config.settings.production"

# 4. Cloudinary
fly secrets set CLOUDINARY_CLOUD_NAME="dpcrsepms"
fly secrets set CLOUDINARY_API_KEY="639394495474588"
fly secrets set CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_SECRET"

# 5. Allowed Hosts & CORS
fly secrets set ALLOWED_HOSTS="noviious-backend.fly.dev,.fly.dev,.vercel.app,www.noviious.com,noviious.com"
fly secrets set CORS_ALLOWED_ORIGINS="https://www.noviious.com,https://noviious.com"

# 6. Frontend URL
fly secrets set FRONTEND_URL="https://www.noviious.com"
```

## Check Current Secrets

```bash
fly secrets list
```

## Deploy

```bash
fly deploy
```

## Check Logs

```bash
fly logs
```

## Common Issues

### Health Check Timeout
- Increase grace_period in fly.toml
- Check if DATABASE_URL is set correctly
- Check logs: `fly logs`

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Supabase is accessible
- Test connection: `fly ssh console` then `python manage.py dbshell`

### Static Files Not Loading
- Run: `fly ssh console`
- Then: `python manage.py collectstatic --noinput`

### App Crashes on Startup
- Check logs: `fly logs`
- Check secrets: `fly secrets list`
- SSH into machine: `fly ssh console`
