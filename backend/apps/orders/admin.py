from django.contrib import admin
from .models import Order, OrderItem, ShippingAddress, Coupon, CouponUsage


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']


class ShippingAddressInline(admin.StackedInline):
    model = ShippingAddress
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'user__email']
    inlines = [OrderItemInline, ShippingAddressInline]
    readonly_fields = ['order_number', 'created_at', 'updated_at']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'is_active', 'usage_count', 'valid_from', 'valid_to']
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']
    readonly_fields = ['usage_count']


@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'created_at']
    search_fields = ['coupon__code', 'user__email', 'order__order_number']
