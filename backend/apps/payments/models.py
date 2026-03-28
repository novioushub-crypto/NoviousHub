from django.db import models
from apps.orders.models import Order


class StripeSession(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='stripe_session')
    session_id = models.CharField(max_length=255, unique=True)
    payment_intent_id = models.CharField(max_length=255, blank=True)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    status = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'stripe_sessions'
    
    def __str__(self):
        return f"Stripe session for {self.order.order_number}"


class WebhookEvent(models.Model):
    event_id = models.CharField(max_length=255, unique=True)
    event_type = models.CharField(max_length=100)
    payload = models.JSONField()
    
    processed = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'webhook_events'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.event_type} - {self.event_id}"
