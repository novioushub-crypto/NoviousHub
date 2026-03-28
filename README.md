# Noviious - Premium E-Commerce Platform

Production-grade e-commerce platform for leather jackets and sportswear.

## Tech Stack

**Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion, Zustand, React Query  
**Backend**: Python 3.12, Django 5, DRF, SimpleJWT, Celery, Redis  
**Database**: PostgreSQL (Supabase)  
**Payments**: Stripe  
**Media**: Cloudinary  
**Email**: Resend  
**Monitoring**: Sentry  

## Quick Start

### Local Development

```bash
# Start services
docker-compose up -d

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements/local.txt
python manage.py migrate
python manage.py seed_db
python manage.py runserver

# Frontend setup
cd frontend
npm install
npm run dev
```

### Deployment

- **Frontend**: Vercel (auto-deploy from main)
- **Backend**: Fly.io (`fly deploy`)
- **Database**: Supabase

## Environment Variables

See `.env.example` in each directory.
