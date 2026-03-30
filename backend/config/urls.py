from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.core.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Health check
    path('health/', health_check, name='health_check'),
    
    # API v1
    path('api/v1/', include([
        # Health
        path('health/', health_check, name='api_health_check'),
        
        # Auth
        path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('auth/', include('apps.accounts.urls')),
        
        # Apps
        path('', include('apps.products.urls')),
        path('', include('apps.orders.urls')),
        path('', include('apps.wishlist.urls')),
        path('', include('apps.payments.urls')),
        path('', include('apps.search.urls')),
        path('analytics/', include('apps.analytics.urls')),
        
        # API Schema
        path('schema/', SpectacularAPIView.as_view(), name='schema'),
        path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    ])),
    
    # Social auth
    path('auth/', include('social_django.urls', namespace='social')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += [path('__debug__/', include('debug_toolbar.urls'))]
