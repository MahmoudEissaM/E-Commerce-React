import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.contrib.auth.models import User

# Create superuser if it doesn't exist
if not User.objects.filter(username='admin@admin.com').exists():
    user = User.objects.create_superuser(
        username='admin@admin.com',
        email='admin@admin.com',
        password='admin123',
        first_name='Admin',
        last_name='User'
    )
    print(f"Superuser created: {user.username}")
else:
    print("Superuser already exists")
