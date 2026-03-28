# Noviious Backend

Django REST API for the Noviious e-commerce platform.

## Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements/local.txt
```

## Database

```bash
python manage.py migrate
python manage.py seed_db
python manage.py createsuperuser
```

## Run

```bash
python manage.py runserver
```

API will be available at http://localhost:8000

## Deploy to Fly.io

```bash
fly launch
fly secrets set SECRET_KEY=your-secret-key
fly secrets set DATABASE_URL=your-database-url
fly deploy
```
