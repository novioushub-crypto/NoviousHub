import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__slug')
    is_featured = django_filters.BooleanFilter()
    is_bestseller = django_filters.BooleanFilter()
    is_new = django_filters.BooleanFilter()
    
    class Meta:
        model = Product
        fields = ['category', 'is_featured', 'is_bestseller', 'is_new']
