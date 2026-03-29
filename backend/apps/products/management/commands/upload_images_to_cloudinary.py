import os
import cloudinary.uploader
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.products.models import Product, ProductImage, Category


class Command(BaseCommand):
    help = 'Upload existing product images to Cloudinary'

    def handle(self, *args, **options):
        self.stdout.write('Starting image upload to Cloudinary...\n')
        
        media_path = settings.BASE_DIR / 'media' / 'products'
        
        if not media_path.exists():
            self.stdout.write(self.style.ERROR('Media folder not found!'))
            return
        
        # Get categories
        leather_cat = Category.objects.filter(name__icontains='leather').first()
        sportswear_cat = Category.objects.filter(name__icontains='sport').first()
        
        uploaded_count = 0
        
        # Process Leather folder
        leather_path = media_path / 'Leather'
        if leather_path.exists() and leather_cat:
            self.stdout.write(f'\nProcessing Leather images...')
            uploaded_count += self.process_folder(leather_path, leather_cat, 'Leather')
        
        # Process Sportswear folder
        sportswear_path = media_path / 'Sportswear'
        if sportswear_path.exists() and sportswear_cat:
            self.stdout.write(f'\nProcessing Sportswear images...')
            uploaded_count += self.process_folder(sportswear_path, sportswear_cat, 'Sportswear')
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Successfully uploaded {uploaded_count} images to Cloudinary!'))
        self.stdout.write(self.style.SUCCESS(f'✓ Total products: {Product.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Total product images: {ProductImage.objects.count()}'))

    def process_folder(self, folder_path, category, category_name):
        from decimal import Decimal
        import random
        
        uploaded = 0
        image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        
        for idx, image_file in enumerate(image_files, 1):
            image_path = folder_path / image_file
            
            try:
                # Create product
                product_name = f"{category_name} Product {idx}"
                base_price = Decimal(str(random.randint(50, 300))) + Decimal('0.99')
                
                product, created = Product.objects.get_or_create(
                    name=product_name,
                    defaults={
                        'description': f'Premium quality {category_name.lower()} product with excellent craftsmanship',
                        'short_description': f'Quality {category_name.lower()} item',
                        'base_price': base_price,
                        'compare_at_price': base_price + Decimal('50.00'),
                        'category': category,
                        'sku': f'{category_name[:3].upper()}-{idx:04d}',
                        'is_active': True,
                        'is_featured': idx <= 3,
                    }
                )
                
                if created:
                    self.stdout.write(f'  Created product: {product_name}')
                
                # Upload image to Cloudinary
                self.stdout.write(f'  Uploading: {image_file}...')
                result = cloudinary.uploader.upload(
                    str(image_path),
                    folder=f"products/{category_name}",
                    public_id=f"{category_name.lower()}_{idx}",
                    overwrite=True
                )
                
                # Create ProductImage with Cloudinary URL
                product_image, img_created = ProductImage.objects.get_or_create(
                    product=product,
                    defaults={
                        'image': result['secure_url'],
                        'image_url': result['secure_url'],
                        'is_primary': True,
                        'alt_text': f'{product_name} image'
                    }
                )
                
                if img_created:
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Uploaded: {image_file} → {result["secure_url"]}'))
                    uploaded += 1
                else:
                    self.stdout.write(self.style.WARNING(f'  - Image already exists for {product_name}'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ✗ Error with {image_file}: {str(e)}'))
        
        return uploaded
