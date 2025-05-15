from django.db import models
from django.utils import timezone
from api.models import Order

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # e.g., 'stripe', 'cash_on_delivery'
    payment_id = models.CharField(max_length=100, blank=True, null=True)  # ID from payment provider
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    # For credit card payments (we don't store full card details for security)
    card_last4 = models.CharField(max_length=4, blank=True, null=True)  # Last 4 digits only
    card_brand = models.CharField(max_length=20, blank=True, null=True)  # e.g., 'visa', 'mastercard'
    card_exp_month = models.CharField(max_length=2, blank=True, null=True)
    card_exp_year = models.CharField(max_length=4, blank=True, null=True)
    
    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id} - {self.status}"
