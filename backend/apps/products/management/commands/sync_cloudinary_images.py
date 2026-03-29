import cloudinary
import cloudinary.api
from django.core.management.base import BaseCommand
from apps.products.models import Product, ProductImage, Category


class Command(BaseCommand):
    help = 'Sync products with actual Cloudinary images'

    def handle(self, *args, **options):
        self.stdout.write('Fetching images from Cloudinary...\n')
        
        try:
            # Get all images from Cloudinary products folder
            leather_images = cloudinary.api.resources(
                type='upload',
                prefix='products/Leather',
                max_results=500
            )
            
            sportswear_images = cloudinary.api.resources(
                type='upload',
                prefix='products/Sportswear',
                max_results=500
            )
            
            self.stdout.write(f'Found {len(leather_images["resources"])} Leather images')
            self.stdout.write(f'Found {len(sportswear_images["resources"])} Sportswear images\n')
            
            # Get categories
            leather_cat = Category.objects.filter(name__icontains='leather').first()
            sportswear_cat = Category.objects.filter(name__icontains='sport').first()
            
            # Clear existing products without images
            Product.objects.filter(images__isnull=True).delete()
            
            # Process Leather images
            self.stdout.write('\nProcessing Leather images:')
            self.process_images(leather_images['resources'], leather_cat, 'Leather')
            
            # Process Sportswear images
            self.stdout.write('\nProcessing Sportswear images:')
            self.process_images(sportswear_images['resources'], sportswear_cat, 'Sportswear')
            
            self.stdout.write(self.style.SUCCESS(f'\n✓ Total products: {Product.objects.count()}'))
            self.stdout.write(self.style.SUCCESS(f'✓ Total images: {ProductImage.objects.count()}'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))

    def process_images(self, images, category, category_name):
        from decimal import Decimal
        import random
        
        for idx, img_data in enumerate(images, 1):
            public_id = img_data['public_id']
            secure_url = img_data['secure_url']
            
            # Extract filename from public_id
            filename = public_id.split('/')[-1]
            
            # Create product name
            product_name = f"{category_name} {filename.replace('_', ' ').title()}"
            
            # Check if product already exists with this image
            existing_image = ProductImage.objects.filter(image_url=secure_url).first()
            if existing_image:
                self.stdout.write(f'  → Already exists: {product_name}')
                continue
            
            # Create product
            base_price = Decimal(str(random.randint(79, 399))) + Decimal('0.99')
            
            product, created = Product.objects.get_or_create(
                name=product_name,
                defaults={
                    'description': f'Premium quality {category_name.lower()} product with excellent craftsmanship',
                    'short_description': f'Quality {category_name.lower()} item',
                    'base_price': base_price,
                    'compare_at_price': base_price + Decimal('50.00'),
                    'category': category,
                    'sku': f'{category_name[:3].upper()}-{idx:04d}-{filename[:4].upper()}',
                    'is_active': True,
                    'is_featured': idx <= 3,
                    'is_new': idx <= 5,
                }
            )
            
            if created:
                # Add image
                ProductImage.objects.create(
                    product=product,
                    image_url=secure_url,
                    is_primary=True,
                    alt_text=f'{product_name} image'
                )
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {product_name}'))
                self.stdout.write(f'    URL: {secure_url}')
