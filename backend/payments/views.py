from django.conf import settings
from django.http import JsonResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer, PaymentIntentSerializer
from .stripe_service import StripeService
from api.models import Order

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Modify permissions based on the action"""
        if self.action in ['config', 'webhook', 'create_payment_intent', 'confirm_payment']:
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        """Create a new payment intent using Stripe"""
        # Log the full request data for debugging
        print(f"Request data: {request.data}")
        
        # Extract order data from request
        order_data = request.data.get('order')
        payment_method = request.data.get('payment_method_id')
        
        print(f"Extracted order_data: {order_data}")
        print(f"Extracted payment_method: {payment_method}")
        
        if not order_data:
            return Response(
                {"error": "Order data is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create payment intent using Stripe with order data directly
            result = StripeService.create_payment_intent(order_data, payment_method)
            
            print(f"Payment intent result: {result}")
            
            if result["success"]:
                response_data = {
                    "client_secret": result["client_secret"],
                    "payment_intent_id": result["payment_intent"].id,
                    "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
                }
                print(f"Successful response: {response_data}")
                return Response(response_data)
            else:
                error_response = {"error": result["error"]}
                print(f"Error response: {error_response}")
                return Response(
                    error_response,
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(f"Exception in create_payment_intent: {str(e)}")
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def confirm_payment(self, request):
        """Confirm payment after successful payment process"""
        payment_intent_id = request.data.get('payment_intent_id')
        
        if not payment_intent_id:
            return Response(
                {"error": "Payment intent ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = StripeService.confirm_payment(payment_intent_id)
        
        if result["success"]:
            serializer = PaymentSerializer(result["payment"])
            return Response(serializer.data)
        else:
            return Response(
                {"error": result["error"]},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def webhook(self, request):
        """Handle events sent from Stripe via Webhook"""
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        result = StripeService.handle_webhook_event(payload, sig_header)
        
        if result["success"]:
            return Response({"status": "success"})
        else:
            return Response(
                {"error": result["error"]},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def config(self, request):
        """Return Stripe settings to the frontend"""
        return Response({
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
        })
