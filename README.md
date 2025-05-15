<h1 align="center">🍔 Restoran</h1>

<p align="center">
  A modern and responsive restaurant e-commerce platform built with <b>React</b>, <b>Bootstrap</b>, and <b>Django</b>. <br>
  Browse different food categories, add items to your cart, place orders, and make secure payments with Stripe.
</p>

---

## 📸 Screenshots  

### 🏠 Home Page  

|   HOME Slider  |  🛒 Menu  |
|--------------- |------------|
| <img src="Capture.JPG" width="400"> |  <img src="Capture2.JPG" width="400"> |


### 📦 Full Page 
| Laptop View | Mobile View  |
|------------|-----------|
| <img src="Capture1.JPG" width="400"> | <img src="Capture3.JPG" width="400"> |
 

---

<h2>🎯 Features</h2>
<ul>
  <li>✔️ User authentication and role-based access control</li>
  <li>✔️ Browse various food categories (Burgers, Pizza, Fries, Pasta)</li>
  <li>✔️ Add/remove items from cart with quantity controls (for authorized users)</li>
  <li>✔️ View product details with dynamic rendering</li>
  <li>✔️ Apply filters based on price, category, and availability</li>
  <li>✔️ Order management system (for Admins)</li>
  <li>✔️ User management system (for Admins)</li>
  <li>✔️ Secure payment processing with Stripe integration</li>
  <li>✔️ Order history and tracking for users</li>
  <li>✔️ Table reservation system</li>
  <li>✔️ Responsive design for all devices</li>
</ul>

---

<h2>🔐 User Roles & Permissions</h2>

<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Permissions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>👤 Anonymous User</b></td>
      <td>
        ❌ Cannot add items to cart<br>
        ❌ Cannot place orders<br>
        ✅ Can browse menu and view product details
      </td>
    </tr>
    <tr>
      <td><b>🛒 Registered User</b></td>
      <td>
        ✅ Can browse menu and view product details<br>
        ✅ Can add/remove items from cart<br>
        ✅ Can place orders<br>
        ❌ Cannot manage users or products
      </td>
    </tr>
    <tr>
      <td><b>🛠️ Admin</b></td>
      <td>
        ✅ Full access to menu and orders<br>
        ✅ Can add, edit, and delete products<br>
        ✅ Can manage user accounts (add, remove, block)<br>
        ✅ Can manage orders and table reservations<br>
        ✅ Can view all sales reports and statistics
      </td>
    </tr>
  </tbody>
</table>

---

<h2>🔧️ Tech Stack</h2>
<h3>Frontend</h3>
<ul>
  <li>HTML, CSS, JavaScript</li>
  <li>React.js</li>
  <li>Bootstrap</li>
  <li>FontAwesome</li>
  <li>Stripe Elements (for payment processing)</li>
  <li>Axios (for API requests)</li>
  <li>React Router (for navigation)</li>
  <li>SweetAlert2 (for notifications)</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Django</li>
  <li>Django REST Framework</li>
  <li>Stripe API</li>
  <li>SQLite (development) / PostgreSQL (production)</li>
</ul>

---

<h2>💻 Installation & Setup</h2>

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- Stripe account for payment processing

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
# Django Secret Key
SECRET_KEY=your_django_secret_key_here

# Database Configuration
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host

# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Frontend API URL
VITE_API_URL=http://localhost:8000
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Start the Django server
python manage.py runserver
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Accessing the Application
- Frontend: http://localhost:5173 (or the port shown in your terminal)
- Backend API: http://localhost:8000/api/
- Admin Dashboard: http://localhost:8000/admin/

---

<h2>💳 Payment System</h2>

### Overview
The application integrates with Stripe to provide a secure and seamless payment experience. Users can pay for their orders using credit/debit cards through the Stripe payment gateway.

### Payment Flow
1. User adds items to cart and proceeds to checkout
2. User fills in delivery information and selects payment method
3. When selecting credit card payment, the Stripe payment form is displayed
4. User enters card details (Stripe securely handles the card information)
5. On successful payment, the order is created and confirmed
6. User receives confirmation and can view order details in their order history

### Test Cards
For testing purposes, you can use the following Stripe test cards:
- Card Number: `4242 4242 4242 4242` (Successful payment)
- Expiration Date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Order Management
Users can view their order history and status through the "My Orders" section accessible from the user dropdown menu. Admins can manage all orders through the admin dashboard.

---
