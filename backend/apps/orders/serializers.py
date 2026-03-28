from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress, Coupon, CouponUsage


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'variant', 'product_name', 'variant_details', 'quantity', 
                  'unit_price', 'total_price']
        read_only_fields = ['total_price']


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['full_name', 'phone', 'email', 'address_line1', 'address_line2',
                  'city', 'state', 'postal_code', 'country', 'tracking_number', 'carrier']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'payment_status', 'subtotal', 
                  'discount_amount', 'shipping_cost', 'tax_amount', 'total', 'items',
                  'shipping_address', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['order_number', 'created_at', 'updated_at']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'min_purchase_amount',
                  'max_discount_amount', 'is_active', 'valid_from', 'valid_to']
