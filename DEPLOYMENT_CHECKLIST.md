# 🚀 Quick Deployment Checklist

Use this checklist to track your deployment progress.

---

## ✅ Pre-Deployment

- [x] Code pushed to GitHub
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database migrations created
- [ ] Static files collected

---

## 🗄️ Database Setup (Supabase)

- [ ] Supabase account created
- [ ] New project created
- [ ] Database password saved securely
- [ ] Connection string copied
- [ ] Database credentials documented

**Connection String:**
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 🔧 Backend Deployment (Fly.io)

- [ ] Fly.io account created
- [ ] Fly CLI installed
- [ ] Logged into Fly CLI (`fly auth login`)
- [ ] `production.py` settings updated
- [ ] `requirements/production.txt` updated
- [ ] `fly.toml` configured
- [ ] App launched (`fly launch --no-deploy`)
- [ ] Environment variables set:
  - [ ] DATABASE_URL
  - [ ] SECRET_KEY (new one generated)
  - [ ] DEBUG=False
  - [ ] DJANGO_SETTINGS_MODULE
  - [ ] GOOGLE_OAUTH2_CLIENT_ID
  - [ ] GOOGLE_OAUTH2_CLIENT_SECRET
  - [ ] FRONTEND_URL (update after Vercel)
- [ ] Volume created for media files
- [ ] App deployed (`fly deploy`)
- [ ] Migrations run (`fly ssh console` → `python manage.py migrate`)
- [ ] Superuser created
- [ ] Database seeded
- [ ] Backend tested (visit `/api/v1/products/`)

**Backend URL:** `https://noviious-backend.fly.dev`

---

## 🌐 Frontend Deployment (Vercel)

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Root directory set to `frontend`
- [ ] Environment variables added:
  - [ ] NEXT_PUBLIC_API_URL
  - [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID
- [ ] `next.config.js` updated with backend URL
- [ ] Deployed successfully
- [ ] Frontend tested (visit homepage)

**Frontend URL:** `https://novious-hub.vercel.app`

---

## 🔄 Post-Deployment Updates

- [ ] Backend FRONTEND_URL updated with Vercel URL
- [ ] Backend CORS settings updated
- [ ] Backend redeployed
- [ ] Google OAuth origins updated:
  - [ ] Vercel URL added to Authorized JavaScript origins
  - [ ] Backend URL added to Authorized JavaScript origins

---

## 📦 Media Files

- [ ] Product images uploaded to production
- [ ] Image URLs working correctly
- [ ] Consider cloud storage (S3/Cloudinary) for scalability

---

## 🧪 Testing Checklist

Test all features in production:

- [ ] Homepage loads
- [ ] Products page displays items
- [ ] Product detail pages work
- [ ] Search functionality works
- [ ] Cart add/remove works
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth login works
- [ ] Wishlist functionality works
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Product CRUD operations work
- [ ] Images display correctly
- [ ] Theme toggle works
- [ ] Welcome modal appears for new users
- [ ] Mobile responsive design works
- [ ] All pages load without errors

---

## 🔐 Security Checklist

- [ ] All passwords changed from defaults
- [ ] New SECRET_KEY generated for production
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured correctly
- [ ] CORS configured correctly
- [ ] CSRF protection enabled
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Admin 2FA enabled (recommended)

---

## 📊 Monitoring Setup

- [ ] Fly.io dashboard checked
- [ ] Vercel analytics enabled
- [ ] Error tracking set up (optional: Sentry)
- [ ] Uptime monitoring (optional: UptimeRobot)
- [ ] Performance monitoring configured

---

## 🌍 Custom Domain (Optional)

- [ ] Domain purchased
- [ ] Domain added to Vercel
- [ ] DNS configured for frontend
- [ ] Domain added to Fly.io for backend
- [ ] DNS configured for backend API
- [ ] SSL certificates verified
- [ ] All URLs updated to use custom domain

---

## 🔄 CI/CD Setup (Optional)

- [ ] GitHub Actions workflow created
- [ ] FLY_API_TOKEN added to GitHub secrets
- [ ] Auto-deploy tested
- [ ] Vercel auto-deploy verified

---

## 📝 Documentation

- [ ] README.md updated with production URLs
- [ ] API documentation created
- [ ] User guide created (optional)
- [ ] Admin guide created (optional)

---

## 🎉 Launch

- [ ] All tests passing
- [ ] All features working
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Team notified
- [ ] Users can access the site

---

## 📞 Important URLs

**Production:**
- Frontend: https://novious-hub.vercel.app
- Backend: https://noviious-backend.fly.dev
- Admin: https://novious-hub.vercel.app/admin
- API Docs: https://noviious-backend.fly.dev/api/v1/

**Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Fly.io: https://fly.io/dashboard
- Supabase: https://supabase.com/dashboard
- Google Cloud: https://console.cloud.google.com

---

## 🆘 Emergency Contacts

**Rollback Commands:**

```bash
# Rollback Fly.io deployment
fly releases
fly deploy --image <previous-image>

# Rollback Vercel deployment
# Go to Vercel dashboard → Deployments → Click previous deployment → Promote to Production
```

**Quick Fixes:**

```bash
# Restart Fly.io app
fly apps restart noviious-backend

# Check logs
fly logs
vercel logs <deployment-url>

# SSH into backend
fly ssh console
```

---

## 📈 Next Steps After Launch

1. **Week 1:**
   - Monitor error logs daily
   - Check performance metrics
   - Gather user feedback
   - Fix critical bugs

2. **Week 2-4:**
   - Optimize slow queries
   - Add missing features
   - Improve UX based on feedback
   - Set up automated backups

3. **Month 2+:**
   - Scale infrastructure as needed
   - Add advanced features
   - Implement analytics
   - Marketing and growth

---

## 💡 Pro Tips

1. **Always test in staging first** (create a staging environment)
2. **Keep environment variables in a password manager**
3. **Set up automated backups immediately**
4. **Monitor costs weekly** (Fly.io and Vercel usage)
5. **Document all changes** in a changelog
6. **Use feature flags** for gradual rollouts
7. **Set up alerts** for downtime and errors
8. **Regular security audits** (monthly)

---

Good luck with your deployment! 🚀

If you encounter any issues, refer to the detailed PRODUCTION_DEPLOYMENT.md guide.
