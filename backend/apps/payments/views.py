from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import stripe
from apps.orders.models import Order
from .models import StripeSession, WebhookEvent

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    order_id = request.data.get('order_id')
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {'name': f'Order {order.order_number}'},
                'unit_amount': int(order.total * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=f"{settings.FRONTEND_URL}/orders/{order.id}/success",
        cancel_url=f"{settings.FRONTEND_URL}/checkout",
        metadata={'order_id': order.id}
    )
    
    StripeSession.objects.create(
        order=order,
        session_id=session.id,
        amount=order.total,
        status=session.status
    )
    
    return Response({'session_url': session.url})


@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        return HttpResponse(status=400)
    
    WebhookEvent.objects.create(
        event_id=event['id'],
        event_type=event['type'],
        payload=event
    )
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session['metadata']['order_id']
        order = Order.objects.get(id=order_id)
        order.payment_status = 'paid'
        order.status = 'processing'
        order.save()
    
    return HttpResponse(status=200)
