import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/apiService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mock data for demonstration when API is not available
  const mockOrders = [
    {
      id: 1,
      date: new Date().toISOString(),
      paymentMethod: 'Credit Card',
      status: 'Delivered',
      subtotal: 120.00,
      tax: 10.00,
      deliveryFee: 5.00,
      total: 135.00,
      customerInfo: {
        name: 'محمد أحمد',
        phone: '0123456789',
        address: 'القاهرة، مصر'
      },
      cart: [
        { id: 1, name: 'برجر لحم', price: 60.00, quantity: 1 },
        { id: 2, name: 'بيتزا مارجريتا', price: 60.00, quantity: 1 }
      ]
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      subtotal: 85.00,
      tax: 7.50,
      deliveryFee: 5.00,
      total: 97.50,
      customerInfo: {
        name: 'محمد أحمد',
        phone: '0123456789',
        address: 'القاهرة، مصر'
      },
      cart: [
        { id: 3, name: 'سلطة سيزر', price: 35.00, quantity: 1 },
        { id: 4, name: 'باستا', price: 50.00, quantity: 1 }
      ]
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await ordersApi.getMyOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Use mock data when API fails
        setOrders(mockOrders);
        setError('تعذر الاتصال بالخادم. يتم عرض بيانات توضيحية.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Delivered':
        return 'info';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Render order items
  const renderOrderItems = (cart) => {
    return (
      <Table striped bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>${parseFloat(item.price).toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Orders</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {orders.length === 0 ? (
        <Alert variant="info">
          You haven't placed any orders yet. <Alert.Link onClick={() => navigate('/')}>Continue shopping</Alert.Link>
        </Alert>
      ) : (
        <Row>
          {orders.map((order) => (
            <Col md={12} key={order.id} className="mb-4">
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Order #{order.id}</h5>
                    <Badge bg={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Date:</strong> {formatDate(order.date)}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Shipping Address:</strong> {order.customerInfo?.address || 'N/A'}</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                      <p><strong>Subtotal:</strong> ${parseFloat(order.subtotal).toFixed(2)}</p>
                      <p><strong>Tax:</strong> ${parseFloat(order.tax).toFixed(2)}</p>
                      <p><strong>Delivery Fee:</strong> ${parseFloat(order.deliveryFee).toFixed(2)}</p>
                      <p><strong>Total:</strong> <span className="fs-5 fw-bold">${parseFloat(order.total).toFixed(2)}</span></p>
                    </Col>
                  </Row>
                  
                  <h6 className="mt-4 mb-2">Order Items</h6>
                  {renderOrderItems(order.cart)}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrdersPage;
