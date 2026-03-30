from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, Coupon
from .serializers import OrderSerializer, CouponSerializer
from apps.core.email_service import EmailService


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']  # Required for CursorPagination
    
    def get_queryset(self):
        # Admin can see all orders, users see only their own
        if self.request.user.is_staff:
            return Order.objects.all().select_related(
                'shipping_address', 'user'
            ).prefetch_related('items')
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
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Admin endpoint to update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']:
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        # Send status update email
        try:
            self.send_status_update_email(order, new_status)
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send status update email: {str(e)}")
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    def send_status_update_email(self, order, new_status):
        """Send order status update email to customer"""
        status_messages = {
            'processing': 'Your order is being processed',
            'shipped': 'Your order has been shipped',
            'delivered': 'Your order has been delivered',
            'cancelled': 'Your order has been cancelled',
        }
        
        if new_status in status_messages:
            # You can implement email sending here
            pass
    
    @action(detail=False, methods=['post'])
    def validate_coupon(self, request):
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            serializer = CouponSerializer(coupon)
            return Response(serializer.data)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def analytics(self, request):
        """Get real-time analytics data for admin dashboard"""
        from django.db.models import Sum, Count, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        # Get date range
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        orders = Order.objects.filter(created_at__gte=start_date)
        
        # Calculate metrics
        total_revenue = orders.aggregate(total=Sum('total'))['total'] or 0
        total_orders = orders.count()
        avg_order_value = orders.aggregate(avg=Avg('total'))['avg'] or 0
        
        # Status breakdown
        status_counts = orders.values('status').annotate(count=Count('id'))
        
        # Daily revenue (last 7 days)
        daily_revenue = []
        for i in range(7):
            day = timezone.now() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            revenue = Order.objects.filter(
                created_at__gte=day_start,
                created_at__lt=day_end
            ).aggregate(total=Sum('total'))['total'] or 0
            daily_revenue.append({
                'date': day_start.strftime('%Y-%m-%d'),
                'revenue': float(revenue)
            })
        
        return Response({
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'avg_order_value': float(avg_order_value),
            'status_breakdown': list(status_counts),
            'daily_revenue': list(reversed(daily_revenue)),
        })
