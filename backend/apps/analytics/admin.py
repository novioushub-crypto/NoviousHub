from django.contrib import admin
from .models import ProductView


@admin.register(ProductView)
class ProductViewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'ip_address', 'created_at']
    list_filter = ['created_at']
    search_fields = ['product__name', 'user__email', 'ip_address']
