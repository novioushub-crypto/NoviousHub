from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, Coupon
from .serializers import OrderSerializer, CouponSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']  # Required for CursorPagination
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related(
            'shipping_address'
        ).prefetch_related('items')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def validate_coupon(self, request):
        code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            serializer = CouponSerializer(coupon)
            return Response(serializer.data)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_404_NOT_FOUND)
