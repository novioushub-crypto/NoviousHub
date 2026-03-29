from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserViewSet, AddressViewSet, google_login, verify_otp, resend_otp

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', verify_otp, name='verify-otp'),
    path('resend-otp/', resend_otp, name='resend-otp'),
    path('google-login/', google_login, name='google-login'),
    path('', include(router.urls)),
]
