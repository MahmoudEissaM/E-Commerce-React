from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Product, CustomerInfo, Order, Table
from .serializers import ProductSerializer, CustomerInfoSerializer, OrderSerializer, TableSerializer, UserSerializer
import json

# Product ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-date')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]  # Changed to AllowAny for testing
    
    def get_permissions(self):
        """Allow unauthenticated access to specific actions"""
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get orders for the current user"""
        # For testing purposes, return all orders
        # In production, you would want to filter by user
        orders = Order.objects.all().order_by('-date')[:10]  # Limit to 10 most recent orders for testing
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
        
        # The code below is commented out for testing purposes
        # Get user token from request
        # auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        # if auth_header.startswith('Token '):
        #     token_key = auth_header.split(' ')[1]
        #     try:
        #         token = Token.objects.get(key=token_key)
        #         user = token.user
        #         
        #         # Get customer info records associated with this user
        #         # This is a simplification - in a real app, you'd have a direct link between User and CustomerInfo
        #         # Here we're using the user's name to find their orders
        #         customer_infos = CustomerInfo.objects.filter(name__icontains=user.username)
        #         
        #         # Get orders for these customer infos
        #         orders = Order.objects.filter(customerInfo__in=customer_infos).order_by('-date')
        #         serializer = self.get_serializer(orders, many=True)
        #         return Response(serializer.data)
        #     except Token.DoesNotExist:
        #         pass
        # 
        # return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        
        # Create customer info
        customer_data = data.get('customerInfo')
        customer_serializer = CustomerInfoSerializer(data=customer_data)
        if customer_serializer.is_valid():
            customer = customer_serializer.save()
            
            # Create order
            order_data = {
                'id': data.get('id'),
                'customerInfo': customer.id,
                'cart': data.get('cart'),
                'paymentMethod': data.get('paymentMethod'),
                'subtotal': data.get('subtotal'),
                'tax': data.get('tax'),
                'deliveryFee': data.get('deliveryFee'),
                'total': data.get('total'),
                'date': data.get('date'),
                'status': data.get('status', 'Pending')
            }
            
            order_serializer = OrderSerializer(data=order_data)
            if order_serializer.is_valid():
                order_serializer.save()
                
                # Update product quantities
                cart_items = data.get('cart', [])
                for item in cart_items:
                    product_id = item.get('id')
                    quantity = item.get('quantity', 0)
                    
                    try:
                        product = Product.objects.get(id=product_id)
                        product.quantity = max(0, product.quantity - quantity)
                        product.save()
                    except Product.DoesNotExist:
                        pass
                
                return Response(order_serializer.data, status=status.HTTP_201_CREATED)
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(customer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Table ViewSet
class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'login']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'role': 'admin' if user.is_staff else 'customer',
                'first_name': user.first_name,
                'last_name': user.last_name
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def import_data_from_json(request):
    """
    Import data from the JSON file to the database
    """
    try:
        with open('server/data.json', 'r') as file:
            data = json.load(file)
            
            # Import products
            products_data = data.get('products', [])
            for product_data in products_data:
                product_serializer = ProductSerializer(data=product_data)
                if product_serializer.is_valid():
                    product_serializer.save()
                else:
                    print(f"Error importing product {product_data.get('id')}: {product_serializer.errors}")
            
            # Import orders
            orders_data = data.get('orders', [])
            for order_data in orders_data:
                # Create customer info
                customer_data = order_data.get('customerInfo')
                customer_serializer = CustomerInfoSerializer(data=customer_data)
                if customer_serializer.is_valid():
                    customer = customer_serializer.save()
                    
                    # Create order
                    new_order_data = {
                        'id': order_data.get('id'),
                        'customerInfo': customer.id,
                        'cart': order_data.get('cart'),
                        'paymentMethod': order_data.get('paymentMethod'),
                        'subtotal': order_data.get('subtotal'),
                        'tax': order_data.get('tax'),
                        'deliveryFee': order_data.get('deliveryFee'),
                        'total': order_data.get('total'),
                        'date': order_data.get('date'),
                        'status': order_data.get('status', 'Pending')
                    }
                    
                    order_serializer = OrderSerializer(data=new_order_data)
                    if order_serializer.is_valid():
                        order_serializer.save()
                    else:
                        print(f"Error importing order {order_data.get('id')}: {order_serializer.errors}")
                else:
                    print(f"Error importing customer info for order {order_data.get('id')}: {customer_serializer.errors}")
            
            return Response({'message': 'Data imported successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
