#!/usr/bin/env python
"""
Quick setup checker for Noviious backend
Run this to diagnose common setup issues
"""

import os
import sys
from pathlib import Path

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"✓ Python version: {version.major}.{version.minor}.{version.micro}")
    if version.major < 3 or (version.major == 3 and version.minor < 11):
        print("  ⚠ Warning: Python 3.11+ recommended")
    return True

def check_env_file():
    """Check if .env file exists"""
    env_path = Path(__file__).parent / '.env'
    env_local_path = Path(__file__).parent / '.env.local'
    
    if env_path.exists():
        print(f"✓ .env file found at: {env_path}")
        return True
    elif env_local_path.exists():
        print(f"✓ .env.local file found at: {env_local_path}")
        return True
    else:
        print("✗ No .env or .env.local file found!")
        print("  Creating .env file from .env.example...")
        
        example_path = Path(__file__).parent / '.env.example'
        if example_path.exists():
            with open(example_path, 'r') as src:
                content = src.read()
            with open(env_path, 'w') as dst:
                dst.write(content)
            print(f"✓ Created .env file at: {env_path}")
            return True
        else:
            print("✗ .env.example not found either!")
            return False

def check_secret_key():
    """Check if SECRET_KEY is set"""
    from decouple import Config, RepositoryEnv
    
    env_path = Path(__file__).parent / '.env'
    if not env_path.exists():
        env_path = Path(__file__).parent / '.env.local'
    
    if env_path.exists():
        config = Config(RepositoryEnv(str(env_path)))
        secret_key = config('SECRET_KEY', default=None)
        
        if secret_key:
            print(f"✓ SECRET_KEY is set (length: {len(secret_key)})")
            return True
        else:
            print("✗ SECRET_KEY not found in .env file!")
            print("  Generating a new SECRET_KEY...")
            
            from django.core.management.utils import get_random_secret_key
            new_key = get_random_secret_key()
            
            # Append to .env file
            with open(env_path, 'a') as f:
                f.write(f"\nSECRET_KEY={new_key}\n")
            
            print(f"✓ Added SECRET_KEY to {env_path}")
            return True
    else:
        print("✗ No .env file to check SECRET_KEY")
        return False

def check_database_url():
    """Check if DATABASE_URL is set"""
    from decouple import Config, RepositoryEnv
    
    env_path = Path(__file__).parent / '.env'
    if not env_path.exists():
        env_path = Path(__file__).parent / '.env.local'
    
    if env_path.exists():
        config = Config(RepositoryEnv(str(env_path)))
        db_url = config('DATABASE_URL', default=None)
        
        if db_url:
            print(f"✓ DATABASE_URL is set")
            if 'sqlite' in db_url:
                print("  ℹ Using SQLite database")
            elif 'postgresql' in db_url:
                print("  ℹ Using PostgreSQL database")
            return True
        else:
            print("⚠ DATABASE_URL not set, will use default")
            return True
    return False

def check_dependencies():
    """Check if key dependencies are installed"""
    try:
        import django
        print(f"✓ Django {django.get_version()} installed")
    except ImportError:
        print("✗ Django not installed!")
        print("  Run: pip install -r requirements/local.txt")
        return False
    
    try:
        import rest_framework
        print("✓ Django REST Framework installed")
    except ImportError:
        print("✗ Django REST Framework not installed!")
        return False
    
    return True

def main():
    print("=" * 60)
    print("Noviious Backend Setup Checker")
    print("=" * 60)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        (".env File", check_env_file),
        ("SECRET_KEY", check_secret_key),
        ("DATABASE_URL", check_database_url),
        ("Dependencies", check_dependencies),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\nChecking {name}...")
        try:
            result = check_func()
            results.append(result)
        except Exception as e:
            print(f"✗ Error: {e}")
            results.append(False)
    
    print("\n" + "=" * 60)
    if all(results):
        print("✓ All checks passed! You're ready to run:")
        print("  python manage.py migrate")
        print("  python manage.py seed_db")
        print("  python manage.py runserver")
    else:
        print("⚠ Some checks failed. Please fix the issues above.")
    print("=" * 60)

if __name__ == '__main__':
    main()
