from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    # Add explicit paths for custom actions
    path('create_payment_intent/', PaymentViewSet.as_view({'post': 'create_payment_intent'}), name='create_payment_intent'),
    path('confirm_payment/', PaymentViewSet.as_view({'post': 'confirm_payment'}), name='confirm_payment'),
    path('config/', PaymentViewSet.as_view({'get': 'config'}), name='stripe_config'),
    path('webhook/', PaymentViewSet.as_view({'post': 'webhook'}), name='stripe_webhook'),
]
