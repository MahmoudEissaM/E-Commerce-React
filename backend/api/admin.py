from django.contrib import admin
from .models import Product, CustomerInfo, Order, Table

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'quantity')
    list_filter = ('category',)
    search_fields = ('name', 'description')

@admin.register(CustomerInfo)
class CustomerInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'address')
    search_fields = ('name', 'phone')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_customer_name', 'paymentMethod', 'total', 'date', 'status')
    list_filter = ('status', 'paymentMethod')
    search_fields = ('id', 'customerInfo__name')
    date_hierarchy = 'date'
    
    def get_customer_name(self, obj):
        return obj.customerInfo.name
    get_customer_name.short_description = 'Customer'

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ('id', 'tableNumber', 'capacity', 'isReserved')
    list_filter = ('isReserved',)
