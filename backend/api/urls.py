from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for our ViewSets
router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'tables', views.TableViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
    
    # Additional endpoints
    path('import-data/', views.import_data_from_json, name='import-data'),
]
