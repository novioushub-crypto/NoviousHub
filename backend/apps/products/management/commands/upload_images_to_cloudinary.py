import os
from django.core.management.base import BaseCommand
from apps.products.models import Product, ProductImage, Category
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Create products with Cloudinary image URLs'

    def handle(self, *args, **options):
        self.stdout.write('Creating products with Cloudinary images...\n')
        
        # Get categories
        leather_cat = Category.objects.filter(name__icontains='leather').first()
        sportswear_cat = Category.objects.filter(name__icontains='sport').first()
        
        if not leather_cat or not sportswear_cat:
            self.stdout.write(self.style.ERROR('Categories not found!'))
            return
        
        # Cloudinary base URL
        cloudinary_base = 'https://res.cloudinary.com/dpcrsepms/image/upload'
        
        # Leather products (assuming you have images leather_1 to leather_10)
        leather_products = [
            ('Classic Leather Jacket', 'Premium black leather jacket with modern design'),
            ('Vintage Leather Bomber', 'Retro style bomber jacket in genuine leather'),
            ('Leather Biker Jacket', 'Edgy biker style with metal details'),
            ('Brown Leather Coat', 'Elegant long leather coat for formal occasions'),
            ('Leather Racing Jacket', 'Sporty racing style leather jacket'),
        ]
        
        # Sportswear products
        sportswear_products = [
            ('Athletic Track Suit', 'Complete track suit for training'),
            ('Running Shorts Pro', 'Lightweight running shorts'),
            ('Sports Compression Shirt', 'High-performance compression wear'),
            ('Training Joggers', 'Comfortable joggers for workouts'),
            ('Athletic Hoodie', 'Warm hoodie for outdoor training'),
        ]
        
        created_count = 0
        
        # Create Leather products
        for idx, (name, desc) in enumerate(leather_products, 1):
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'description': desc,
                    'short_description': desc[:50],
                    'base_price': Decimal(str(random.randint(150, 350))) + Decimal('0.99'),
                    'compare_at_price': Decimal(str(random.randint(400, 500))) + Decimal('0.99'),
                    'category': leather_cat,
                    'sku': f'LEA-{idx:04d}',
                    'is_active': True,
                    'is_featured': idx <= 2,
                    'is_bestseller': idx == 1,
                }
            )
            
            if created:
                # Add Cloudinary image
                image_url = f'{cloudinary_base}/v1/products/Leather/leather_{idx}'
                ProductImage.objects.create(
                    product=product,
                    image=image_url,
                    image_url=image_url,
                    is_primary=True,
                    alt_text=f'{name} image'
                )
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {name}'))
                created_count += 1
        
        # Create Sportswear products
        for idx, (name, desc) in enumerate(sportswear_products, 1):
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'description': desc,
                    'short_description': desc[:50],
                    'base_price': Decimal(str(random.randint(50, 150))) + Decimal('0.99'),
                    'compare_at_price': Decimal(str(random.randint(180, 250))) + Decimal('0.99'),
                    'category': sportswear_cat,
                    'sku': f'SPO-{idx:04d}',
                    'is_active': True,
                    'is_featured': idx <= 2,
                    'is_new': idx <= 3,
                }
            )
            
            if created:
                # Add Cloudinary image
                image_url = f'{cloudinary_base}/v1/products/Sportswear/sportswear_{idx}'
                ProductImage.objects.create(
                    product=product,
                    image=image_url,
                    image_url=image_url,
                    is_primary=True,
                    alt_text=f'{name} image'
                )
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {name}'))
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Created {created_count} new products'))
        self.stdout.write(self.style.SUCCESS(f'✓ Total products: {Product.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Total images: {ProductImage.objects.count()}'))
