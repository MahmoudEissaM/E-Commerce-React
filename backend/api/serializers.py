from rest_framework import serializers
from .models import Product, CustomerInfo, Order, Table
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerInfo
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    customerInfo = CustomerInfoSerializer(read_only=False)
    
    class Meta:
        model = Order
        fields = '__all__'
    
    def create(self, validated_data):
        # Extract customer info data and create or update the CustomerInfo instance
        customer_info_data = validated_data.pop('customerInfo', None)
        
        if isinstance(customer_info_data, dict):
            # If customerInfo is provided as a dictionary (nested data)
            customer_info = CustomerInfo.objects.create(**customer_info_data)
        else:
            # If customerInfo is provided as an ID
            customer_info = CustomerInfo.objects.get(id=validated_data.pop('customerInfo'))
        
        # Create the Order with the CustomerInfo instance
        order = Order.objects.create(customerInfo=customer_info, **validated_data)
        return order
        
    def to_internal_value(self, data):
        # Handle the case where customerInfo is provided as an ID
        if data.get('customerInfo') and isinstance(data.get('customerInfo'), int):
            # It's an ID, so we'll handle it in create()
            pass
        return super().to_internal_value(data)

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
