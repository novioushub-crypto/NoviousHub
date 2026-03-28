from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer, 
    ProductCreateSerializer, ReviewSerializer
)
from .filters import ProductFilter


class IsAdminOrReadOnly(IsAuthenticatedOrReadOnly):
    """
    Custom permission to only allow admins to edit/create/delete.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True, parent=None)
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'variants')
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['base_price', 'created_at', 'sales_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductListSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        # Extract images from request
        images = request.FILES.getlist('images')
        
        # Create mutable copy of data without images
        from django.http import QueryDict
        data = QueryDict('', mutable=True)
        data.update(request.data)
        
        # Remove images from data if they exist (they'll be in FILES)
        if 'images' in data:
            del data['images']
        
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Creating product with data: {dict(data)}")
        logger.info(f"Images count: {len(images)}")
        
        # Validate without images first
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Save product and manually add images
        product = serializer.save()
        
        # Create product images
        from apps.products.models import ProductImage
        for index, image_file in enumerate(images):
            ProductImage.objects.create(
                product=product,
                image=image_file,
                is_primary=(index == 0),
                order=index
            )
        
        # Return the created product with images
        from apps.products.serializers import ProductDetailSerializer
        result_serializer = ProductDetailSerializer(product, context={'request': request})
        
        headers = self.get_success_headers(result_serializer.data)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Extract images from request
        images = request.FILES.getlist('images')
        
        # Create mutable copy of data without images
        from django.http import QueryDict
        data = QueryDict('', mutable=True)
        data.update(request.data)
        
        # Remove images from data if they exist
        if 'images' in data:
            del data['images']
        
        # Validate and update product
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Add new images if provided
        if images:
            from apps.products.models import ProductImage
            # Get current max order
            current_max_order = ProductImage.objects.filter(product=product).count()
            
            for index, image_file in enumerate(images):
                ProductImage.objects.create(
                    product=product,
                    image=image_file,
                    is_primary=(current_max_order == 0 and index == 0),  # Only set primary if no existing images
                    order=current_max_order + index
                )
        
        # Return updated product with images
        from apps.products.serializers import ProductDetailSerializer
        result_serializer = ProductDetailSerializer(product, context={'request': request})
        
        return Response(result_serializer.data)
    
    def perform_create(self, serializer):
        # Save the product
        serializer.save()
    
    def perform_update(self, serializer):
        serializer.save()
    
    def perform_destroy(self, instance):
        # Soft delete - just mark as inactive
        instance.is_active = False
        instance.save()


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
