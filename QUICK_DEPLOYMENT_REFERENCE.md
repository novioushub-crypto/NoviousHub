# 🚀 Quick Deployment Reference Card

## 📋 Your Credentials Checklist

### Supabase Database
- [ ] Project created
- [ ] Database URL: `postgresql://postgres.xxxxx:[PASSWORD]@...`
- [ ] Password saved securely

### Cloudinary Storage
- [ ] Account created
- [ ] Cloud Name: `____________`
- [ ] API Key: `____________`
- [ ] API Secret: `____________`

### Google OAuth
- [ ] Client ID: `YOUR-GOOGLE-CLIENT-ID`
- [ ] Client Secret: `YOUR-GOOGLE-CLIENT-SECRET`

### Vercel Frontend
- [ ] Deployed
- [ ] URL: `https://novious-hub.vercel.app` (or your custom URL)

---

## ⚡ Quick Commands

### Install Fly CLI (Windows PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Login to Fly:
```bash
fly auth login
```

### Deploy Backend:
```bash
cd backend
fly launch --no-deploy
# Set secrets (see below)
fly deploy
```

### Set All Secrets at Once:
```bash
fly secrets set \
  SECRET_KEY="your-generated-secret-key" \
  DEBUG="False" \
  DJANGO_SETTINGS_MODULE="config.settings.production" \
  DATABASE_URL="your-supabase-url" \
  CLOUDINARY_CLOUD_NAME="your-cloud-name" \
  CLOUDINARY_API_KEY="your-api-key" \
  CLOUDINARY_API_SECRET="your-api-secret" \
  GOOGLE_OAUTH2_CLIENT_ID="your-google-client-id" \
  GOOGLE_OAUTH2_CLIENT_SECRET="your-google-client-secret" \
  FRONTEND_URL="https://novious-hub.vercel.app"
```

### Run Migrations:
```bash
fly ssh console
cd /app
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_db
exit
```

### Check Status:
```bash
fly status
fly logs
```

---

## 🔗 Important URLs

### Production:
- **Frontend**: https://novious-hub.vercel.app
- **Backend API**: https://noviious-backend.fly.dev/api/v1/
- **Admin Panel**: https://noviious-backend.fly.dev/admin/
- **Health Check**: https://noviious-backend.fly.dev/api/v1/health/

### Dashboards:
- **Vercel**: https://vercel.com/dashboard
- **Fly.io**: https://fly.io/dashboard
- **Supabase**: https://supabase.com/dashboard
- **Cloudinary**: https://cloudinary.com/console
- **Google Cloud**: https://console.cloud.google.com

---

## ✅ Deployment Checklist

### Backend (Fly.io):
- [ ] Fly CLI installed
- [ ] Logged into Fly
- [ ] App launched (`fly launch --no-deploy`)
- [ ] All secrets set
- [ ] App deployed (`fly deploy`)
- [ ] Migrations run
- [ ] Superuser created
- [ ] Database seeded
- [ ] Health check works
- [ ] Products API returns data

### Frontend (Vercel):
- [ ] Environment variables set:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Deployed successfully
- [ ] Can access homepage
- [ ] Can fetch products from backend

### Integration:
- [ ] Backend CORS updated with Vercel URL
- [ ] Frontend can connect to backend
- [ ] Google OAuth origins updated
- [ ] Images upload to Cloudinary
- [ ] All features tested

---

## 🆘 Quick Troubleshooting

### Backend won't start:
```bash
fly logs
fly secrets list
```

### Database connection fails:
- Check DATABASE_URL is correct
- Verify Supabase project is running
- Test connection: `fly ssh console` → `python manage.py dbshell`

### Images not uploading:
- Verify Cloudinary credentials
- Check logs: `fly logs`
- Test in Django admin

### CORS errors:
- Update `CORS_ALLOWED_ORIGINS` in `backend/config/settings/production.py`
- Redeploy: `fly deploy`

### Frontend can't connect:
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check backend is running: `fly status`
- Test API directly: `https://noviious-backend.fly.dev/api/v1/products/`

---

## 📊 Monitoring Commands

```bash
# Real-time logs
fly logs -f

# App status
fly status

# SSH into app
fly ssh console

# Restart app
fly apps restart noviious-backend

# View metrics
fly dashboard
```

---

## 💡 Pro Tips

1. **Always check logs first**: `fly logs`
2. **Test health endpoint**: Visit `/api/v1/health/`
3. **Use SSH for debugging**: `fly ssh console`
4. **Keep secrets secure**: Never commit them to git
5. **Monitor costs**: Check Fly.io dashboard weekly
6. **Set up alerts**: Configure monitoring in Fly.io dashboard
7. **Backup database**: Use Supabase's backup features
8. **Test in staging first**: Create a staging environment

---

## 🎯 Post-Deployment Tasks

### Immediate:
- [ ] Test all API endpoints
- [ ] Verify admin panel works
- [ ] Test image uploads
- [ ] Check Google OAuth
- [ ] Test frontend-backend integration

### Within 24 Hours:
- [ ] Set up monitoring alerts
- [ ] Configure database backups
- [ ] Add custom domain (optional)
- [ ] Set up SSL certificates
- [ ] Review security settings

### Within 1 Week:
- [ ] Load testing
- [ ] Performance optimization
- [ ] Set up CI/CD
- [ ] Documentation updates
- [ ] Team training

---

## 📞 Support Resources

- **Fly.io Docs**: https://fly.io/docs
- **Fly.io Community**: https://community.fly.io
- **Supabase Docs**: https://supabase.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Django Docs**: https://docs.djangoproject.com
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎉 You're Ready!

Follow the detailed guide in **BACKEND_DEPLOYMENT_STEPS.md** for step-by-step instructions.

This reference card is for quick lookups after you've completed the initial deployment.

Good luck! 🚀
