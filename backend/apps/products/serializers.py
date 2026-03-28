from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Review


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'parent', 'children', 'is_active']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary', 'order']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        
        # If image file exists, use it
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://localhost:8000{obj.image.url}"
        
        # Otherwise use external URL
        if obj.image_url:
            if obj.image_url.startswith('http'):
                return obj.image_url
            if request:
                return request.build_absolute_uri(obj.image_url)
            return f"http://localhost:8000{obj.image_url}"
        
        return None


class ProductVariantSerializer(serializers.ModelSerializer):
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'color_hex', 'sku', 'stock', 'price_adjustment', 
                  'final_price', 'is_active']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_avatar = serializers.URLField(source='user.avatar', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'user_avatar', 'rating', 'title', 'comment',
                  'is_verified_purchase', 'helpful_count', 'created_at']
        read_only_fields = ['id', 'user', 'is_verified_purchase', 'helpful_count', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'short_description', 'base_price', 'compare_at_price',
                  'discount_percentage', 'category_name', 'primary_image', 'average_rating',
                  'is_featured', 'is_bestseller', 'is_new']
    
    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first()
        if not image:
            image = obj.images.first()
        
        if not image:
            return None
        
        request = self.context.get('request')
        
        # Check if image file exists first
        if image.image:
            if request:
                return request.build_absolute_uri(image.image.url)
            return f"http://localhost:8000{image.image.url}"
        
        # Fall back to external URL
        if image.image_url:
            if image.image_url.startswith('http'):
                return image.image_url
            if request:
                return request.build_absolute_uri(image.image_url)
            return f"http://localhost:8000{image.image_url}"
        
        return None



class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    total_stock = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'short_description', 'base_price',
                  'compare_at_price', 'discount_percentage', 'sku', 'category', 'images',
                  'variants', 'reviews', 'average_rating', 'total_stock', 'is_featured',
                  'is_bestseller', 'is_new', 'weight', 'meta_title', 'meta_description',
                  'views_count', 'sales_count', 'created_at']
    
    def get_images(self, obj):
        images = obj.images.all()
        serializer = ProductImageSerializer(images, many=True, context=self.context)
        return serializer.data


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products"""
    slug = serializers.SlugField(required=False)
    
    class Meta:
        model = Product
        fields = ['name', 'slug', 'description', 'short_description', 'base_price',
                  'compare_at_price', 'sku', 'category', 'is_featured', 'is_bestseller', 
                  'is_new', 'weight', 'meta_title', 'meta_description']
    
    def create(self, validated_data):
        # Auto-generate slug if not provided
        if not validated_data.get('slug'):
            from django.utils.text import slugify
            validated_data['slug'] = slugify(validated_data['name'])
        
        product = Product.objects.create(**validated_data)
        return product
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
