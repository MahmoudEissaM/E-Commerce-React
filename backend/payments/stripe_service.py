import stripe
from django.conf import settings
from api.models import Order
from .models import Payment


stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    @staticmethod
    def create_payment_intent(order_data, payment_method=None):
        """
        Create a payment intent in Stripe from order data
        """
        try:
            # Log the received data for debugging
            print(f"Received order_data: {order_data}")
            print(f"Received payment_method: {payment_method}")
            
            # Extract order details from the provided data
            order_id = order_data.get('id')
            total_amount = order_data.get('total')
            customer_name = order_data.get('customerInfo', {}).get('name', 'Customer')
            
            print(f"Extracted order_id: {order_id}, total_amount: {total_amount}, customer_name: {customer_name}")
            
            if not order_id or not total_amount:
                return {
                    "success": False,
                    "error": "Invalid order data: missing id or total amount"
                }
            
            # Convert amount to cents (Stripe expects amount in smallest currency unit)
            amount_in_cents = int(float(total_amount) * 100)
            
            # Create payment intent
            payment_intent_params = {
                'amount': amount_in_cents,
                'currency': "usd",  # Can be changed according to the required currency
                'payment_method_types': ["card"],
                'description': f"Order {order_id}",
                'metadata': {
                    "order_id": order_id,
                    "customer_name": customer_name,
                }
            }
            
            # Only add payment_method if it's a valid value
            if payment_method and payment_method != 'stripe':
                print(f"Adding payment_method: {payment_method} to payment intent")
                payment_intent_params['payment_method'] = payment_method
                # Set confirm to False to avoid automatic confirmation
                payment_intent_params['confirm'] = False
            
            print(f"Creating payment intent with params: {payment_intent_params}")
            payment_intent = stripe.PaymentIntent.create(**payment_intent_params)
            
            # We'll create the Payment record when the payment is confirmed
            # This is because we don't have a saved Order object yet
            
            return {
                "success": True,
                "payment_intent": payment_intent,
                "client_secret": payment_intent.client_secret
            }
            
        except Order.DoesNotExist:
            return {
                "success": False,
                "error": "Order not found"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def confirm_payment(payment_intent_id):
        """
        Confirm payment after successful payment process
        """
        try:
            # Get payment intent from Stripe
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            print(f"Retrieved payment intent: {payment_intent.id}, status: {payment_intent.status}")
            
            # Check payment status
            if payment_intent.status == "succeeded":
                # Try to find existing payment record or create a new one
                try:
                    payment = Payment.objects.get(payment_id=payment_intent_id)
                    print(f"Found existing payment record: {payment.id}")
                except Payment.DoesNotExist:
                    # Payment record doesn't exist, create a new one
                    print("Payment record not found, creating new one")
                    
                    # Get order from metadata
                    order_id = payment_intent.metadata.get('order_id')
                    if not order_id:
                        return {
                            "success": False,
                            "error": "Order ID not found in payment intent metadata"
                        }
                    
                    try:
                        order = Order.objects.get(id=order_id)
                        print(f"Found existing order: {order.id}")
                    except Order.DoesNotExist:
                        print(f"Order with ID {order_id} not found, attempting to create it from payment intent")
                        
                        # Try to create order from payment intent data
                        try:
                            # Extract order details from payment intent metadata and description
                            amount = payment_intent.amount / 100  # Convert cents to dollars
                            customer_name = payment_intent.metadata.get('customer_name', 'Customer')
                            
                            # Create customer info
                            from api.models import CustomerInfo
                            customer_info = CustomerInfo.objects.create(
                                name=customer_name,
                                address='Address from payment',
                                phone='Phone from payment'
                            )
                            
                            # Create a default cart item based on the payment amount
                            default_cart = [{
                                'id': '1',  # Default product ID
                                'name': 'Order from payment',
                                'category': 'other',
                                'price': str(amount),
                                'quantity': 1,
                                'image': 'https://via.placeholder.com/150',
                                'description': 'Item purchased through Stripe payment'
                            }]
                            
                            # Create order
                            order = Order.objects.create(
                                id=order_id,
                                customerInfo=customer_info,
                                cart=default_cart,  # Use default cart with one item
                                paymentMethod='Stripe',
                                subtotal=amount * 0.8,  # Approximate values
                                tax=amount * 0.1,
                                deliveryFee=amount * 0.1,
                                total=amount,
                                status='Pending'
                            )
                            print(f"Created new order: {order.id}")
                        except Exception as e:
                            print(f"Error creating order: {str(e)}")
                            return {
                                "success": False,
                                "error": f"Could not create order: {str(e)}"
                            }
                    
                    # Check if a payment record already exists for this order
                    try:
                        payment = Payment.objects.get(order=order)
                        print(f"Found existing payment record for order {order.id}: {payment.id}")
                        # Update existing payment record
                        payment.payment_id = payment_intent_id
                    except Payment.DoesNotExist:
                        # Create new payment record
                        print(f"Creating new payment record for order {order.id}")
                        payment = Payment(
                            order=order,
                            amount=order.total,
                            payment_method='stripe',
                            payment_id=payment_intent_id,
                            status='pending'
                        )
                
                # Update payment status
                payment.status = "completed"
                
                # Add card information
                if hasattr(payment_intent, 'payment_method') and payment_intent.payment_method:
                    payment_method = stripe.PaymentMethod.retrieve(payment_intent.payment_method)
                    if hasattr(payment_method, 'card') and payment_method.card:
                        payment.card_last4 = payment_method.card.last4
                        payment.card_brand = payment_method.card.brand
                        payment.card_exp_month = payment_method.card.exp_month
                        payment.card_exp_year = payment_method.card.exp_year
                
                payment.save()
                print(f"Payment record updated: {payment.id}, status: {payment.status}")
                
                # Update order status
                order = payment.order
                order.status = "Approved"
                order.save()
                print(f"Order updated: {order.id}, status: {order.status}")
                
                return {
                    "success": True,
                    "payment": payment
                }
            else:
                return {
                    "success": False,
                    "error": f"Payment not succeeded. Status: {payment_intent.status}"
                }
                
        except Payment.DoesNotExist:
            return {
                "success": False,
                "error": "Payment record not found"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def handle_webhook_event(payload, sig_header):
        """
        Handle events sent from Stripe via Webhook
        """
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            
            # Handle different events
            if event.type == "payment_intent.succeeded":
                payment_intent = event.data.object
                StripeService.confirm_payment(payment_intent.id)
            
            return {
                "success": True,
                "event": event
            }
            
        except stripe.error.SignatureVerificationError:
            return {
                "success": False,
                "error": "Invalid signature"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
