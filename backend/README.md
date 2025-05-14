# E-Commerce Backend with Django and Django REST Framework

This project is the backend for an e-commerce application, built using Django and Django REST Framework.

## Requirements

- Python 3.8+
- Django 5.2+
- Django REST Framework 3.16+
- django-cors-headers

## Installation

1. Activate the virtual environment:
```bash
source venv/bin/activate
```

2. Install the required packages:
```bash
pip install django djangorestframework django-cors-headers coreapi pyyaml
```

## Running the Server

You can run the server using the included script:

```bash
./start_server.sh
```

Or you can manually execute the following steps:

1. Apply migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

2. Create a superuser:
```bash
python manage.py createsuperuser
```

3. Import data from the JSON file:
```bash
python manage.py import_data
```

4. Start the server:
```bash
python manage.py runserver 0.0.0.0:8000
```

## API Endpoints

- `GET /api/products/` - Get all products
- `GET /api/products/{id}/` - Get a specific product
- `POST /api/products/` - Add a new product
- `PUT /api/products/{id}/` - Update a product
- `DELETE /api/products/{id}/` - Delete a product

- `GET /api/orders/` - Get all orders
- `GET /api/orders/{id}/` - Get a specific order
- `POST /api/orders/` - Add a new order
- `PUT /api/orders/{id}/` - Update an order
- `DELETE /api/orders/{id}/` - Delete an order

- `GET /api/tables/` - Get all tables
- `GET /api/tables/{id}/` - Get a specific table
- `POST /api/tables/` - Add a new table
- `PUT /api/tables/{id}/` - Update a table
- `DELETE /api/tables/{id}/` - Delete a table

## API Documentation

You can access the API documentation at:
```
http://localhost:8000/docs/
```

## Admin Panel

You can access the admin panel at:
```
http://localhost:8000/admin/
```

Default username: `admin`
Default password: `admin`
