from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json

class Product(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    image = models.URLField(max_length=500)
    description = models.TextField()

    def __str__(self):
        return self.name

class CustomerInfo(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    phone = models.CharField(max_length=20)
    cardNumber = models.CharField(max_length=20, blank=True, null=True)
    expiryDate = models.CharField(max_length=10, blank=True, null=True)
    cvv = models.CharField(max_length=5, blank=True, null=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    customerInfo = models.ForeignKey(CustomerInfo, on_delete=models.CASCADE, related_name='orders')
    cart = models.JSONField()  # Store cart items as JSON
    paymentMethod = models.CharField(max_length=100)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    deliveryFee = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Order {self.id} by {self.customerInfo.name}"

class Table(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    tableNumber = models.IntegerField()
    capacity = models.IntegerField()
    isReserved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Table {self.tableNumber} (Capacity: {self.capacity})"
