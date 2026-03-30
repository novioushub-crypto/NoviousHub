from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, F
from django.utils import timezone
from datetime import timedelta
from apps.orders.models import Order
from apps.products.models import Product
from apps.accounts.models import CustomUser


@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_overview(request):
    """Get real-time analytics overview"""
    days = int(request.query_params.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    # Orders analytics
    orders = Order.objects.filter(created_at__gte=start_date)
    total_revenue = orders.aggregate(total=Sum('total'))['total'] or 0
    total_orders = orders.count()
    avg_order_value = orders.aggregate(avg=Avg('total'))['avg'] or 0
    
    # Previous period comparison
    prev_start = start_date - timedelta(days=days)
    prev_orders = Order.objects.filter(created_at__gte=prev_start, created_at__lt=start_date)
    prev_revenue = prev_orders.aggregate(total=Sum('total'))['total'] or 0
    prev_count = prev_orders.count()
    
    revenue_change = ((total_revenue - prev_revenue) / prev_revenue * 100) if prev_revenue > 0 else 0
    orders_change = ((total_orders - prev_count) / prev_count * 100) if prev_count > 0 else 0
    
    # Status breakdown
    status_counts = orders.values('status').annotate(count=Count('id'))
    
    # New users
    new_users = CustomUser.objects.filter(date_joined__gte=start_date).count()
    prev_users = CustomUser.objects.filter(date_joined__gte=prev_start, date_joined__lt=start_date).count()
    users_change = ((new_users - prev_users) / prev_users * 100) if prev_users > 0 else 0
    
    return Response({
        'total_revenue': float(total_revenue),
        'revenue_change': round(revenue_change, 1),
        'total_orders': total_orders,
        'orders_change': round(orders_change, 1),
        'avg_order_value': float(avg_order_value),
        'new_users': new_users,
        'users_change': round(users_change, 1),
        'status_breakdown': list(status_counts),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def daily_revenue(request):
    """Get daily revenue for the last N days"""
    days = int(request.query_params.get('days', 7))
    
    daily_data = []
    for i in range(days):
        day = timezone.now() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        revenue = Order.objects.filter(
            created_at__gte=day_start,
            created_at__lt=day_end
        ).aggregate(total=Sum('total'))['total'] or 0
        
        order_count = Order.objects.filter(
            created_at__gte=day_start,
            created_at__lt=day_end
        ).count()
        
        daily_data.append({
            'date': day_start.strftime('%Y-%m-%d'),
            'revenue': float(revenue),
            'orders': order_count
        })
    
    return Response(list(reversed(daily_data)))


@api_view(['GET'])
@permission_classes([IsAdminUser])
def top_products(request):
    """Get top selling products"""
    from apps.orders.models import OrderItem
    
    limit = int(request.query_params.get('limit', 5))
    days = int(request.query_params.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    top_items = OrderItem.objects.filter(
        order__created_at__gte=start_date
    ).values('product_name').annotate(
        total_quantity=Sum('quantity'),
        total_revenue=Sum(F('quantity') * F('unit_price'))
    ).order_by('-total_revenue')[:limit]
    
    return Response(list(top_items))
