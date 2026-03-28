# 🚀 Backend Deployment Steps

Follow these steps exactly to deploy your backend to Fly.io with Supabase and Cloudinary.

---

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] Supabase project created
- [ ] Supabase DATABASE_URL saved
- [ ] Cloudinary account created
- [ ] Cloudinary credentials saved (Cloud Name, API Key, API Secret)
- [ ] Fly.io account created (https://fly.io/app/sign-up)

---

## STEP 1: Install Fly CLI

### Windows (PowerShell - Run as Administrator):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Mac/Linux:
```bash
curl -L https://fly.io/install.sh | sh
```

After installation, close and reopen your terminal.

---

## STEP 2: Login to Fly.io

```bash
fly auth login
```

This will open your browser. Sign in or create an account.

---

## STEP 3: Navigate to Backend Directory

```bash
cd backend
```

---

## STEP 4: Launch Fly.io App (Don't Deploy Yet)

```bash
fly launch --no-deploy
```

Answer the prompts:
- **App name**: `noviious-backend` (or choose your own)
- **Region**: Choose closest to your users (e.g., `iad` for US East)
- **PostgreSQL**: **No** (we're using Supabase)
- **Redis**: **No** (not needed yet)

This creates the app but doesn't deploy it yet.

---

## STEP 5: Set Environment Variables

Now set all the required environment variables. Replace the placeholder values with your actual credentials.

### Generate a New SECRET_KEY

First, generate a new Django secret key:

**Windows PowerShell:**
```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Mac/Linux:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output - you'll use it in the next step.

### Set All Secrets

Replace the values in brackets with your actual values:

```bash
# Django Settings
fly secrets set SECRET_KEY="YOUR-GENERATED-SECRET-KEY-FROM-ABOVE"
fly secrets set DEBUG="False"
fly secrets set DJANGO_SETTINGS_MODULE="config.settings.production"

# Database (Supabase)
fly secrets set DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Cloudinary
fly secrets set CLOUDINARY_CLOUD_NAME="your-cloud-name"
fly secrets set CLOUDINARY_API_KEY="your-api-key"
fly secrets set CLOUDINARY_API_SECRET="your-api-secret"

# Google OAuth
fly secrets set GOOGLE_OAUTH2_CLIENT_ID="YOUR-GOOGLE-CLIENT-ID"
fly secrets set GOOGLE_OAUTH2_CLIENT_SECRET="YOUR-GOOGLE-CLIENT-SECRET"

# Frontend URL (we'll update this after Vercel deployment)
fly secrets set FRONTEND_URL="https://novious-hub.vercel.app"
```

**Important Notes:**
- For `DATABASE_URL`: Use your full Supabase connection string
- For Cloudinary: Use the values from your Cloudinary dashboard
- For `FRONTEND_URL`: Use your actual Vercel URL (you can update this later)

---

## STEP 6: Verify Secrets

Check that all secrets are set:

```bash
fly secrets list
```

You should see all the secrets listed (values are hidden for security).

---

## STEP 7: Deploy to Fly.io

Now deploy your application:

```bash
fly deploy
```

This will:
1. Build your Docker image
2. Push it to Fly.io
3. Start your application
4. Take about 3-5 minutes

Watch the logs for any errors.

---

## STEP 8: Run Database Migrations

Once deployed, connect to your app and run migrations:

```bash
fly ssh console
```

You're now inside your app's container. Run:

```bash
cd /app
python manage.py migrate
```

You should see all migrations being applied.

---

## STEP 9: Create Superuser

Still in the SSH console, create an admin user:

```bash
python manage.py createsuperuser
```

Enter:
- **Email**: your-email@example.com
- **Password**: (choose a strong password)
- **Password (again)**: (confirm)

---

## STEP 10: Seed Database (Optional)

If you want sample data:

```bash
python manage.py seed_db
```

This will create sample products.

---

## STEP 11: Exit SSH Console

```bash
exit
```

---

## STEP 12: Test Your Backend

Open your backend in the browser:

```bash
fly open
```

Or visit manually: `https://noviious-backend.fly.dev`

Test these endpoints:
- Health check: `https://noviious-backend.fly.dev/api/v1/health/`
- Products: `https://noviious-backend.fly.dev/api/v1/products/`
- Admin: `https://noviious-backend.fly.dev/admin/`

---

## STEP 13: Check Logs

If something isn't working, check the logs:

```bash
fly logs
```

---

## STEP 14: Update Frontend Environment Variables

Now that your backend is deployed, update your Vercel frontend:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update or add:
   - `NEXT_PUBLIC_API_URL` = `https://noviious-backend.fly.dev/api/v1`
5. Go to **Deployments** tab
6. Click the three dots on the latest deployment
7. Click **Redeploy**

---

## STEP 15: Update Google OAuth Settings

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins**:
   ```
   https://noviious-backend.fly.dev
   https://novious-hub.vercel.app
   ```
6. Click **Save**

---

## STEP 16: Update Backend CORS Settings

Update the CORS settings in your backend to include your actual Vercel URL:

1. Edit `backend/config/settings/production.py`
2. Update `CORS_ALLOWED_ORIGINS` with your actual Vercel URL
3. Update `CSRF_TRUSTED_ORIGINS` with your actual Vercel URL
4. Commit and push to GitHub
5. Redeploy: `fly deploy`

---

## ✅ Deployment Complete!

Your backend is now live at: `https://noviious-backend.fly.dev`

### Test Everything:

- [ ] Health check works
- [ ] Products API returns data
- [ ] Admin panel accessible
- [ ] Can login to admin
- [ ] Images upload to Cloudinary
- [ ] Frontend can connect to backend
- [ ] Google OAuth works

---

## 🔧 Useful Fly.io Commands

```bash
# View logs
fly logs

# Check app status
fly status

# SSH into app
fly ssh console

# Restart app
fly apps restart noviious-backend

# Scale app (if needed)
fly scale vm shared-cpu-1x --memory 1024

# View secrets
fly secrets list

# Update a secret
fly secrets set SECRET_KEY="new-value"

# Deploy after changes
fly deploy
```

---

## 🆘 Troubleshooting

### Issue: Build fails
**Solution**: Check Dockerfile and requirements.txt for errors

### Issue: App crashes on startup
**Solution**: Check logs with `fly logs` and verify all environment variables are set

### Issue: Database connection fails
**Solution**: Verify DATABASE_URL is correct and Supabase project is running

### Issue: Images not uploading
**Solution**: Verify Cloudinary credentials are correct

### Issue: CORS errors
**Solution**: Update CORS_ALLOWED_ORIGINS in production.py with your Vercel URL

---

## 📊 Monitoring

### Check App Health:
```bash
fly status
```

### View Metrics:
```bash
fly dashboard
```

### View Logs in Real-time:
```bash
fly logs -f
```

---

## 💰 Cost Information

**Free Tier Includes:**
- 3 shared-cpu-1x VMs (256 MB RAM each)
- 160 GB outbound data transfer
- 3 GB persistent volume storage

**Your Current Setup:**
- 1 VM with 512 MB RAM
- Should stay within free tier for development/testing

**To Reduce Costs:**
- Set `min_machines_running = 0` in fly.toml (already set)
- App will auto-stop when idle and auto-start on requests

---

## 🎉 Next Steps

1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure automated backups
4. Add custom domain (optional)
5. Set up CI/CD for automatic deployments
6. Monitor costs and scale as needed

---

## 📞 Support

- **Fly.io Docs**: https://fly.io/docs
- **Fly.io Community**: https://community.fly.io
- **Supabase Docs**: https://supabase.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

Good luck with your deployment! 🚀
