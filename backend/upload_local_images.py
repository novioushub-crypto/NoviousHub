"""
Run this script locally to upload images to Cloudinary and create products
Usage: python upload_local_images.py
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
sys.path.insert(0, str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

import cloudinary
import cloudinary.uploader
from apps.products.models import Product, ProductImage, Category
from decimal import Decimal
import random

# Configure Cloudinary (update with your credentials)
cloudinary.config(
    cloud_name='dpcrsepms',
    api_key='639394495474588',
    api_secret='5jbxhO6KnmnQO39EM2395pMTV54',
    secure=True
)

def upload_images():
    print('Starting image upload to Cloudinary...\n')
    
    media_path = Path(__file__).parent / 'media' / 'products'
    
    if not media_path.exists():
        print('❌ Media folder not found!')
        print(f'Looking for: {media_path}')
        return
    
    # Get or create categories
    leather_cat, _ = Category.objects.get_or_create(
        name='Leather Jackets',
        defaults={'slug': 'leather-jackets', 'description': 'Premium leather products'}
    )
    sportswear_cat, _ = Category.objects.get_or_create(
        name='Sportswear',
        defaults={'slug': 'sportswear', 'description': 'Athletic and sports clothing'}
    )
    
    uploaded_count = 0
    
    # Process Leather folder
    leather_path = media_path / 'Leather'
    if leather_path.exists():
        print(f'\n📁 Processing Leather images...')
        uploaded_count += process_folder(leather_path, leather_cat, 'Leather')
    
    # Process Sportswear folder
    sportswear_path = media_path / 'Sportswear'
    if sportswear_path.exists():
        print(f'\n📁 Processing Sportswear images...')
        uploaded_count += process_folder(sportswear_path, sportswear_cat, 'Sportswear')
    
    print(f'\n✅ Successfully uploaded {uploaded_count} images to Cloudinary!')
    print(f'✅ Total products: {Product.objects.count()}')
    print(f'✅ Total product images: {ProductImage.objects.count()}')

def process_folder(folder_path, category, category_name):
    uploaded = 0
    image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    
    print(f'Found {len(image_files)} images in {category_name} folder')
    
    for idx, image_file in enumerate(image_files, 1):
        image_path = folder_path / image_file
        
        try:
            # Create product
            product_name = f"{category_name} {image_file.split('.')[0].title()}"
            base_price = Decimal(str(random.randint(79, 399))) + Decimal('0.99')
            
            product, created = Product.objects.get_or_create(
                name=product_name,
                defaults={
                    'description': f'Premium quality {category_name.lower()} product with excellent craftsmanship and attention to detail',
                    'short_description': f'Quality {category_name.lower()} item',
                    'base_price': base_price,
                    'compare_at_price': base_price + Decimal('50.00'),
                    'category': category,
                    'sku': f'{category_name[:3].upper()}-{idx:04d}',
                    'is_active': True,
                    'is_featured': idx <= 3,
                    'is_new': idx <= 5,
                }
            )
            
            if created:
                print(f'  ✓ Created product: {product_name}')
            else:
                print(f'  → Product exists: {product_name}')
            
            # Check if image already uploaded
            if ProductImage.objects.filter(product=product).exists():
                print(f'  → Image already exists for {product_name}')
                continue
            
            # Upload image to Cloudinary
            print(f'  📤 Uploading: {image_file}...')
            result = cloudinary.uploader.upload(
                str(image_path),
                folder=f"products/{category_name}",
                public_id=f"{category_name.lower()}_{idx}_{image_file.split('.')[0]}",
                overwrite=True
            )
            
            # Create ProductImage with Cloudinary URL
            ProductImage.objects.create(
                product=product,
                image=result['secure_url'],
                image_url=result['secure_url'],
                is_primary=True,
                alt_text=f'{product_name} image'
            )
            
            print(f'  ✅ Uploaded: {image_file}')
            print(f'     URL: {result["secure_url"][:60]}...')
            uploaded += 1
            
        except Exception as e:
            print(f'  ❌ Error with {image_file}: {str(e)}')
    
    return uploaded

if __name__ == '__main__':
    print('=' * 60)
    print('Cloudinary Image Upload Script')
    print('=' * 60)
    upload_images()
    print('\n' + '=' * 60)
    print('Done! Check your Cloudinary dashboard:')
    print('https://cloudinary.com/console/media_library')
    print('=' * 60)
