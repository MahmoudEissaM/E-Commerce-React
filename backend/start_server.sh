#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Apply migrations
echo "Applying migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (if not exists) - using a more reliable method
echo "Creating superuser (if not exists)..."
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.get_or_create(username='admin', email='admin@example.com', is_superuser=True, is_staff=True)"
python manage.py shell -c "from django.contrib.auth.models import User; u = User.objects.get(username='admin'); u.set_password('admin'); u.save()"

# Import data from JSON file
echo "Importing data from JSON file..."
python manage.py import_data

# Check if port 8000 is already in use and kill the process if needed
echo "Checking if port 8000 is in use..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 8000 is in use. Killing the process..."
    kill $(lsof -Pi :8000 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

# Start the server
echo "Starting server on port 8000..."
python manage.py runserver 0.0.0.0:8000
