from django.db import models
from apps.accounts.models import CustomUser
from apps.products.models import Product


class ProductView(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_views')
    user = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
    session_id = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'product_views'
        indexes = [
            models.Index(fields=['product', '-created_at']),
        ]
    
    def __str__(self):
        return f"View of {self.product.name}"
