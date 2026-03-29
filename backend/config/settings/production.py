from .base import *
import dj_database_url

DEBUG = False

# Database - PostgreSQL via Supabase
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Allowed Hosts
ALLOWED_HOSTS = [
    'noviious-backend.fly.dev',
    '.fly.dev',
    '.vercel.app',
    'www.noviious.com',
    'noviious.com',
    'localhost',
    '*',  # Allow all for now - Fly.io uses dynamic internal IPs
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'https://www.noviious.com',
    'https://noviious.com',
    'https://novious-hub.vercel.app',
    'http://localhost:3000',
]

CSRF_TRUSTED_ORIGINS = [
    'https://www.noviious.com',
    'https://noviious.com',
    'https://novious-hub.vercel.app',
    'https://noviious-backend.fly.dev',
]

# Cloudinary Configuration for Media Files
import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config(
    cloud_name=config('CLOUDINARY_CLOUD_NAME'),
    api_key=config('CLOUDINARY_API_KEY'),
    api_secret=config('CLOUDINARY_API_SECRET'),
    secure=True
)

# Use Cloudinary for media storage
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Resend Email Configuration
RESEND_API_KEY = config('RESEND_API_KEY', default='')
RESEND_FROM_EMAIL = config('RESEND_FROM_EMAIL', default='Noviious <onboarding@resend.dev>')

# Static files - served by WhiteNoise
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security settings
SECURE_SSL_REDIRECT = False  # Disabled for Fly.io internal health checks
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
