from rest_framework import serializers
from .models import Payment
from api.serializers import OrderSerializer

class PaymentSerializer(serializers.ModelSerializer):
    order_details = OrderSerializer(source='order', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_details', 'amount', 'payment_method', 
            'payment_id', 'status', 'created_at', 'updated_at',
            'card_last4', 'card_brand', 'card_exp_month', 'card_exp_year'
        ]
        read_only_fields = ['id', 'payment_id', 'status', 'created_at', 'updated_at']

class PaymentIntentSerializer(serializers.Serializer):
    order_id = serializers.CharField(max_length=50)
    payment_method_id = serializers.CharField(max_length=100, required=False)
    payment_method = serializers.CharField(max_length=50)
    return_url = serializers.URLField(required=False)
