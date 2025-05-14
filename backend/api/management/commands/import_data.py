import json
import os
from django.core.management.base import BaseCommand
from api.models import Product, CustomerInfo, Order
from api.serializers import ProductSerializer, CustomerInfoSerializer, OrderSerializer

class Command(BaseCommand):
    help = 'Import data from JSON file to database'

    def handle(self, *args, **kwargs):
        # Path to the JSON file
        json_file_path = os.path.join('server', 'data.json')
        
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
                    # Check if order already exists
                    order_id = order_data.get('id')
                    if Order.objects.filter(id=order_id).exists():
                        self.stdout.write(self.style.WARNING(f'Order {order_id} already exists, skipping'))
                        continue
                    
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
                            self.stdout.write(self.style.SUCCESS(f'Imported order: {order_id}'))
                        else:
                            self.stdout.write(self.style.ERROR(f'Error importing order {order_id}: {order_serializer.errors}'))
                    else:
                        self.stdout.write(self.style.ERROR(f'Error importing customer info for order {order_id}: {customer_serializer.errors}'))
                
                self.stdout.write(self.style.SUCCESS('Data import completed successfully'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing data: {str(e)}'))
