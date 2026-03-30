from django.urls import path
from . import views

urlpatterns = [
    path('overview/', views.analytics_overview, name='analytics-overview'),
    path('daily-revenue/', views.daily_revenue, name='daily-revenue'),
    path('top-products/', views.top_products, name='top-products'),
]
