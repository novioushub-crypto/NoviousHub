from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, Coupon
from .serializers import OrderSerializer, CouponSerializer
from apps.core.email_service import EmailService


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']  # Required for CursorPagination
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related(
            'shipping_address'
        ).prefetch_related('items')
    
    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        
        # Send order confirmation email
        self.send_order_confirmation_email(order)
    
    def send_order_confirmation_email(self, order):
        """Send order confirmation email to customer"""
        try:
            # Prepare order data for email
            items = []
            for item in order.items.all():
                items.append({
                    'name': item.product_name,
                    'quantity': item.quantity,
                    'price': float(item.total_price)
                })
            
            shipping_address = {}
            if hasattr(order, 'shipping_address'):
                addr = order.shipping_address
                shipping_address = {
                    'full_name': addr.full_name,
                    'address_line1': addr.address_line1,
                    'address_line2': addr.address_line2,
                    'city': addr.city,
                    'state': addr.state,
                    'postal_code': addr.postal_code,
                    'country': addr.country,
                }
            
            order_data = {
                'order_number': order.order_number,
                'first_name': order.user.first_name,
                'total_amount': float(order.total),
                'items': items,
                'shipping_address': shipping_address,
            }
            
            EmailService.send_order_confirmation_email(
                email=order.user.email,
                order_data=order_data
            )
        except Exception as e:
            # Log error but don't fail the order creation
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send order confirmation email: {str(e)}")
    
    @action(detail=False, methods=['post'])
    def validate_coupon(self, request):
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            serializer = CouponSerializer(coupon)
            return Response(serializer.data)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_404_NOT_FOUND)
