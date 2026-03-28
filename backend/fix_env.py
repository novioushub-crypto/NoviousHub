"""
Simple script to fix .env file issues
Run this if you're getting "SECRET_KEY not found" error
"""

import os
from pathlib import Path

def generate_secret_key():
    """Generate a Django secret key"""
    import secrets
    import string
    
    chars = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(chars) for _ in range(50))

def main():
    print("=" * 60)
    print("Noviious .env File Fixer")
    print("=" * 60)
    
    backend_dir = Path(__file__).parent
    env_file = backend_dir / '.env'
    env_example = backend_dir / '.env.example'
    
    # Check if .env exists
    if env_file.exists():
        print(f"\n✓ .env file exists at: {env_file}")
        
        # Read current content
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Check if SECRET_KEY exists
        if 'SECRET_KEY=' in content and not content.split('SECRET_KEY=')[1].split('\n')[0].strip() == '':
            print("✓ SECRET_KEY is already set")
        else:
            print("⚠ SECRET_KEY is missing or empty")
            print("  Generating new SECRET_KEY...")
            
            secret_key = generate_secret_key()
            
            # Add or replace SECRET_KEY
            if 'SECRET_KEY=' in content:
                lines = content.split('\n')
                new_lines = []
                for line in lines:
                    if line.startswith('SECRET_KEY='):
                        new_lines.append(f'SECRET_KEY={secret_key}')
                    else:
                        new_lines.append(line)
                content = '\n'.join(new_lines)
            else:
                content = f'SECRET_KEY={secret_key}\n' + content
            
            # Write back
            with open(env_file, 'w') as f:
                f.write(content)
            
            print(f"✓ SECRET_KEY added to .env file")
    
    else:
        print(f"\n✗ .env file not found at: {env_file}")
        
        if env_example.exists():
            print(f"  Found .env.example, creating .env from it...")
            
            with open(env_example, 'r') as f:
                content = f.read()
            
            # Generate and add SECRET_KEY
            secret_key = generate_secret_key()
            
            if 'SECRET_KEY=' in content:
                lines = content.split('\n')
                new_lines = []
                for line in lines:
                    if line.startswith('SECRET_KEY='):
                        new_lines.append(f'SECRET_KEY={secret_key}')
                    else:
                        new_lines.append(line)
                content = '\n'.join(new_lines)
            else:
                content = f'SECRET_KEY={secret_key}\n' + content
            
            with open(env_file, 'w') as f:
                f.write(content)
            
            print(f"✓ Created .env file with SECRET_KEY")
        else:
            print(f"  .env.example also not found!")
            print(f"  Creating minimal .env file...")
            
            secret_key = generate_secret_key()
            minimal_env = f"""SECRET_KEY={secret_key}
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DJANGO_SETTINGS_MODULE=config.settings.local
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
"""
            
            with open(env_file, 'w') as f:
                f.write(minimal_env)
            
            print(f"✓ Created minimal .env file")
    
    print("\n" + "=" * 60)
    print("✓ .env file is ready!")
    print("\nYou can now run:")
    print("  python manage.py migrate")
    print("  python manage.py seed_db")
    print("  python manage.py runserver")
    print("=" * 60)

if __name__ == '__main__':
    main()
