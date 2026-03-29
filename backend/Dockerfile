FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements directory
COPY requirements/ ./requirements/

# Install Python dependencies
RUN pip install -r requirements/production.txt

# Copy project
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Create staticfiles directory
RUN mkdir -p /app/staticfiles

EXPOSE 8000

CMD ["./start.sh"]
