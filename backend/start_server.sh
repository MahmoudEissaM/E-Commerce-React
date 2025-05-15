#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Check if port 8000 is already in use and kill the process if needed
echo "Checking if port 8000 is in use..."

# Kill process using port 8000 if it exists
pid=$(lsof -ti:8000 -sTCP:LISTEN)
if [ -n "$pid" ]; then
    echo "Found process $pid using port 8000. Killing it..."
    kill -9 $pid
    sleep 1
    echo "Process killed."
else
    echo "Port 8000 is available."
fi

# Start the server
echo "Starting server on port 8000..."
python manage.py runserver 0.0.0.0:8000
