from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product, ProductImage, ProductVariant
from apps.orders.models import Coupon
from django.utils import timezone
from datetime import timedelta
import os
from pathlib import Path

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create admin user
        if not User.objects.filter(email='admin@noviious.com').exists():
            User.objects.create_superuser(
                email='admin@noviious.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        # Create test customer
        if not User.objects.filter(email='customer@test.com').exists():
            User.objects.create_user(
                email='customer@test.com',
                password='customer123',
                first_name='Test',
                last_name='Customer'
            )
            self.stdout.write(self.style.SUCCESS('Created test customer'))

        # Create categories
        leather_cat, _ = Category.objects.get_or_create(
            slug='leather-jackets',
            defaults={
                'name': 'Leather Jackets',
                'description': 'Premium leather jackets for all occasions',
                'image': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
            }
        )

        sportswear_cat, _ = Category.objects.get_or_create(
            slug='sportswear',
            defaults={
                'name': 'Sportswear',
                'description': 'High-performance athletic wear',
                'image': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'
            }
        )

        self.stdout.write(self.style.SUCCESS('Created categories'))

        # Get images from media folder
        media_path = Path(__file__).resolve().parent.parent.parent.parent.parent / 'media' / 'products'
        leather_path = media_path / 'Leather'
        sportswear_path = media_path / 'Sportswear'

        # Get leather jacket images
        leather_images = []
        if leather_path.exists():
            leather_images = sorted([f'/media/products/Leather/{f.name}' for f in leather_path.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png']])
        
        # Get sportswear images
        sportswear_images = []
        if sportswear_path.exists():
            sportswear_images = sorted([f'/media/products/Sportswear/{f.name}' for f in sportswear_path.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png']])
        
        self.stdout.write(self.style.SUCCESS(f'Found {len(leather_images)} leather images'))
        self.stdout.write(self.style.SUCCESS(f'Found {len(sportswear_images)} sportswear images'))

        # Create leather jacket products - ONE PRODUCT PER IMAGE
        leather_names = [
            'Classic Black Leather Jacket',
            'Brown Vintage Leather Jacket',
            'Tan Bomber Leather Jacket',
            'Distressed Leather Biker Jacket',
            'Premium Leather Racing Jacket',
        ]
        
        for idx, img_url in enumerate(leather_images):
            product_name = leather_names[idx] if idx < len(leather_names) else f'Leather Jacket {idx + 1}'
            sku = f'LJ-{str(idx + 1).zfill(3)}'
            
            # Vary prices
            base_prices = [299.99, 349.99, 279.99, 399.99, 329.99]
            compare_prices = [399.99, 449.99, None, 499.99, 429.99]
            
            product_data = {
                'name': product_name,
                'description': f'<p>Premium leather jacket crafted from the finest materials. Features modern design with attention to detail.</p><p>Perfect for any occasion, combining style and functionality.</p>',
                'short_description': f'Premium leather jacket with modern styling',
                'base_price': base_prices[idx % len(base_prices)],
                'compare_at_price': compare_prices[idx % len(compare_prices)],
                'sku': sku,
                'is_featured': idx % 3 == 0,
                'is_bestseller': idx % 4 == 0,
                'is_new': idx % 5 == 0,
            }
            
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={**product_data, 'category': leather_cat}
            )

            if created:
                # Add single image for this product
                ProductImage.objects.create(
                    product=product,
                    image_url=img_url,
                    is_primary=True,
                    order=0
                )
                
                # Add variants
                sizes = ['S', 'M', 'L', 'XL', '2XL']
                colors = [
                    ('Black', '#000000'),
                    ('Brown', '#8B4513'),
                    ('Tan', '#D2B48C')
                ]

                for size in sizes:
                    for color, hex_code in colors:
                        ProductVariant.objects.create(
                            product=product,
                            size=size,
                            color=color,
                            color_hex=hex_code,
                            sku=f"{product.sku}-{size}-{color[:3].upper()}",
                            stock=50
                        )

                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))

        # Create sportswear products - ONE PRODUCT PER IMAGE
        sportswear_names = [
            'Performance Running Jacket',
            'Athletic Training Hoodie',
            'Pro Sports Windbreaker',
            'Training Track Jacket',
            'Lightweight Running Vest',
            'Premium Workout Hoodie',
            'Sports Performance Jacket',
            'Athletic Zip-Up Hoodie',
            'Running Windbreaker Pro',
            'Training Pullover Hoodie',
            'Performance Track Suit',
            'Athletic Bomber Jacket',
            'Sports Training Vest',
            'Running Performance Top',
            'Workout Zip Jacket',
            'Athletic Performance Hoodie',
            'Training Windbreaker Elite',
            'Sports Pullover Pro',
            'Running Track Jacket',
            'Performance Training Hoodie',
            'Athletic Windbreaker Plus',
            'Sports Performance Vest',
            'Training Elite Jacket',
        ]
        
        for idx, img_url in enumerate(sportswear_images):
            product_name = sportswear_names[idx] if idx < len(sportswear_names) else f'Sportswear {idx + 1}'
            sku = f'SW-{str(idx + 1).zfill(3)}'
            
            # Vary prices
            base_prices = [89.99, 69.99, 79.99, 99.99, 59.99, 109.99, 74.99, 84.99]
            compare_prices = [119.99, None, 99.99, 129.99, 79.99, None, 94.99, None]
            
            product_data = {
                'name': product_name,
                'description': f'<p>High-performance athletic wear designed for optimal comfort and functionality. Features moisture-wicking technology and breathable fabric.</p><p>Perfect for training, running, or casual wear.</p>',
                'short_description': f'High-performance athletic wear',
                'base_price': base_prices[idx % len(base_prices)],
                'compare_at_price': compare_prices[idx % len(compare_prices)],
                'sku': sku,
                'is_featured': idx % 4 == 0,
                'is_bestseller': idx % 5 == 0,
                'is_new': idx % 3 == 0,
            }
            
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={**product_data, 'category': sportswear_cat}
            )

            if created:
                # Add single image for this product
                ProductImage.objects.create(
                    product=product,
                    image_url=img_url,
                    is_primary=True,
                    order=0
                )
                
                # Add variants
                sizes = ['S', 'M', 'L', 'XL', '2XL']
                colors = [
                    ('Black', '#000000'),
                    ('Navy', '#000080'),
                    ('Red', '#DC143C'),
                    ('Gray', '#808080')
                ]

                for size in sizes:
                    for color, hex_code in colors:
                        ProductVariant.objects.create(
                            product=product,
                            size=size,
                            color=color,
                            color_hex=hex_code,
                            sku=f"{product.sku}-{size}-{color[:3].upper()}",
                            stock=50
                        )

                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))

        # Create sample coupon
        Coupon.objects.get_or_create(
            code='WELCOME10',
            defaults={
                'discount_type': 'percentage',
                'discount_value': 10,
                'min_purchase_amount': 100,
                'is_active': True,
                'valid_from': timezone.now(),
                'valid_to': timezone.now() + timedelta(days=30)
            }
        )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
