import json
import os
from django.core.management.base import BaseCommand
from api.models import Product, CustomerInfo, Order
from api.serializers import ProductSerializer, CustomerInfoSerializer, OrderSerializer

class Command(BaseCommand):
    help = 'Import data from JSON file to database'

    def handle(self, *args, **kwargs):
        # Path to the JSON file - using absolute path to the project root
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
        json_file_path = os.path.join(project_root, 'server', 'data.json')
        
        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_file_path}'))
            return
        
        try:
            with open(json_file_path, 'r') as file:
                data = json.load(file)
                
                # Import products
                products_data = data.get('products', [])
                self.stdout.write(self.style.SUCCESS(f'Found {len(products_data)} products'))
                
                for product_data in products_data:
                    # Check if product already exists
                    product_id = product_data.get('id')
                    if Product.objects.filter(id=product_id).exists():
                        self.stdout.write(self.style.WARNING(f'Product {product_id} already exists, skipping'))
                        continue
                    
                    product_serializer = ProductSerializer(data=product_data)
                    if product_serializer.is_valid():
                        product_serializer.save()
                        self.stdout.write(self.style.SUCCESS(f'Imported product: {product_data.get("name")}'))
                    else:
                        self.stdout.write(self.style.ERROR(f'Error importing product {product_id}: {product_serializer.errors}'))
                
                # Import orders
                orders_data = data.get('orders', [])
                self.stdout.write(self.style.SUCCESS(f'Found {len(orders_data)} orders'))
                
                for order_data in orders_data:
                    try:
                        # Check if order already exists
                        order_id = order_data.get('id')
                        if Order.objects.filter(id=order_id).exists():
                            self.stdout.write(self.style.WARNING(f'Order {order_id} already exists, skipping'))
                            continue
                        
                        # Create customer info directly without using serializer
                        customer_data = order_data.get('customerInfo')
                        customer = CustomerInfo.objects.create(
                            name=customer_data.get('name'),
                            address=customer_data.get('address'),
                            phone=customer_data.get('phone'),
                            cardNumber=customer_data.get('cardNumber', ''),
                            expiryDate=customer_data.get('expiryDate', ''),
                            cvv=customer_data.get('cvv', '')
                        )
                        
                        # Fix tax precision if needed
                        tax = order_data.get('tax')
                        if isinstance(tax, float) and len(str(tax).split('.')[-1]) > 2:
                            tax = round(tax, 2)
                        
                        # Create order directly without using serializer
                        order = Order.objects.create(
                            id=order_data.get('id'),
                            customerInfo=customer,
                            cart=order_data.get('cart'),
                            paymentMethod=order_data.get('paymentMethod'),
                            subtotal=order_data.get('subtotal'),
                            tax=tax,
                            deliveryFee=order_data.get('deliveryFee'),
                            total=order_data.get('total'),
                            date=order_data.get('date'),
                            status=order_data.get('status', 'Pending')
                        )
                        self.stdout.write(self.style.SUCCESS(f'Imported order: {order_id}'))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f'Error importing order {order_id}: {str(e)}'))
                
                self.stdout.write(self.style.SUCCESS('Data import completed successfully'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing data: {str(e)}'))
