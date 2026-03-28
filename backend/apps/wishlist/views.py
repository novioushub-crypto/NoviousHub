from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import WishlistItem
from .serializers import WishlistItemSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']  # Required for CursorPagination
    
    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related('product')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        if WishlistItem.objects.filter(user=request.user, product_id=product_id).exists():
            return Response({'error': 'Product already in wishlist'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
