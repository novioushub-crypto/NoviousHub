from django.urls import path
from .views import create_checkout_session, stripe_webhook

urlpatterns = [
    path('checkout/', create_checkout_session, name='checkout'),
    path('webhooks/stripe/', stripe_webhook, name='stripe_webhook'),
]
