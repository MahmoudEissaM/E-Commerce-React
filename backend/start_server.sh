#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Apply migrations
echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (if not exists)
echo "Creating superuser (if not exists)..."
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin')"

# Import data from JSON file
echo "Importing data from JSON file..."
python manage.py import_data

# Start the server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000
