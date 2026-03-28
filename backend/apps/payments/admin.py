from django.contrib import admin
from .models import StripeSession, WebhookEvent


@admin.register(StripeSession)
class StripeSessionAdmin(admin.ModelAdmin):
    list_display = ['order', 'session_id', 'amount', 'status', 'created_at']
    search_fields = ['session_id', 'payment_intent_id', 'order__order_number']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ['event_type', 'event_id', 'processed', 'created_at']
    list_filter = ['processed', 'event_type']
    search_fields = ['event_id', 'event_type']
    readonly_fields = ['created_at']
