from django.core.management.base import BaseCommand
from apps.products.models import ProductImage


class Command(BaseCommand):
    help = 'Fix Cloudinary image URLs - move from image field to image_url field'

    def handle(self, *args, **options):
        self.stdout.write('Fixing Cloudinary image URLs...\n')
        
        fixed_count = 0
        
        for img in ProductImage.objects.all():
            # If image field has a Cloudinary URL, move it to image_url
            if img.image and 'cloudinary.com' in str(img.image):
                cloudinary_url = str(img.image)
                
                # Extract the actual URL (remove any /media/ prefix)
                if '/media/' in cloudinary_url:
                    cloudinary_url = cloudinary_url.split('/media/')[-1]
                
                # Ensure it starts with https://
                if not cloudinary_url.startswith('http'):
                    cloudinary_url = f'https://res.cloudinary.com/dpcrsepms/image/upload/v1/{cloudinary_url}'
                
                # Update the record
                img.image = None  # Clear the ImageField
                img.image_url = cloudinary_url  # Set the URL field
                img.save()
                
                self.stdout.write(self.style.SUCCESS(f'✓ Fixed: {img.product.name}'))
                self.stdout.write(f'  URL: {cloudinary_url}')
                fixed_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Fixed {fixed_count} images'))
