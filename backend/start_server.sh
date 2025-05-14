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

# Function to kill process using port 8000
kill_port_process() {
    # Try to find PID using lsof
    local pid=$(lsof -ti:8000 -sTCP:LISTEN)
    if [ -n "$pid" ]; then
        echo "Found process $pid using port 8000. Killing it..."
        kill -9 $pid
        sleep 2
    fi
}

# Try up to 3 times to free the port
for i in {1..3}; do
    if lsof -ti:8000 -sTCP:LISTEN >/dev/null 2>&1; then
        echo "Attempt $i: Port 8000 is in use."
        kill_port_process
    else
        echo "Port 8000 is available."
        break
    fi
done

# Final check
if lsof -ti:8000 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "WARNING: Could not free port 8000 after multiple attempts."
    echo "Please manually kill the process using: sudo kill -9 $(lsof -ti:8000 -sTCP:LISTEN)"
    exit 1
fi

# Start the server
echo "Starting server on port 8000..."
python manage.py runserver 0.0.0.0:8000
