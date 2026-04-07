from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from core import views
from core.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- 1. Router Setup ---
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'vessels', views.VesselViewSet, basename='vessel')
router.register(r'ports', views.PortViewSet, basename='port')
router.register(r'history', views.VesselHistoryViewSet, basename='history')
router.register(r'voyages', views.VoyageViewSet, basename='voyage')
router.register(r'events', views.EventViewSet, basename='event')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'subscriptions', views.SubscriptionViewSet, basename='subscription')
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'insurance', views.InsurancePolicyViewSet, basename='insurance')
router.register(r'compliance', views.ComplianceAuditViewSet, basename='compliance')

# --- 2. Custom JWT View ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    # --- Django Admin Interface ---
    path('admin/', admin.site.urls),
    
    # --- API Endpoints ---
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/password-reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    
    # Core API routes from router
    path('api/stats/', views.FleetStatsView.as_view(), name='fleet_stats'),
    path('api/export/vessels/', views.ExportVesselsCSV.as_view(), name='export_vessels'),
    path('api/', include(router.urls)), 
    path('api-auth/', include('rest_framework.urls')),

    # --- Frontend Serving ---
    # We explicitly tell TemplateView which index.html to serve 
    # to match the settings.py TEMPLATES 'DIRS' configuration.
    path('', TemplateView.as_view(template_name='index.html')),
    
    # Catch-all: Handover navigation to React Router
    re_path(r'^(?!api|admin|static).*$', TemplateView.as_view(template_name='index.html')),
]