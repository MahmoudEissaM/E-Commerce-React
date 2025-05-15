import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsApi } from '../api/paymentApi';
import Swal from 'sweetalert2';

// Internal component for payment form
const CheckoutForm = ({ order, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create a payment method using the card element
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: order.customerInfo?.name || 'Customer',
        },
      });
      
      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }
      
      // Log the order data for debugging
      console.log('Order data being sent:', order);
      console.log('Payment method ID:', paymentMethod.id);
      
      // 2. Create payment intent in the backend with the payment method ID
      // Simplify the order data to only include required fields
      const orderData = {
        id: order.id,
        total: order.total,
        customerInfo: {
          name: order.customerInfo?.name || 'Customer'
        }
      };
      
      console.log('Simplified order data:', orderData);
      
      // Send payment intent request
      console.log('Sending payment intent request...');
      const response = await paymentsApi.createPaymentIntent({
        order: orderData,
        payment_method_id: paymentMethod.id
      });
      
      console.log('Payment intent response:', response);
      const intentData = response.data;
      console.log('Payment intent data:', intentData);
      
      if (!intentData.client_secret) {
        throw new Error('No client_secret received from server');
      }
      
      // 3. Confirm payment using Stripe.js
      console.log('Confirming card payment with client_secret:', intentData.client_secret);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.client_secret,
        {
          payment_method: paymentMethod.id,
        }
      );
      
      if (stripeError) {
        setError(`Payment failed: ${stripeError.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        // 4. Confirm payment in the backend
        await paymentsApi.confirmPayment({
          payment_intent_id: paymentIntent.id
        });
        
        setSucceeded(true);
        
        Swal.fire({
          title: 'Payment Successful!',
          text: 'Your order has been placed successfully.',
          icon: 'success',
          confirmButtonText: 'View Orders'
        }).then(() => {
          navigate('/orders'); // Redirect user to orders page
        });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      if (error.response?.data?.error) {
        setError(`Payment failed: ${error.response.data.error}`);
      } else {
        setError(`Payment failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="mb-4">
        <h4 className="mb-3">Card Details</h4>
        <CardElement options={cardElementOptions} />
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        disabled={!stripe || loading || succeeded}
        className="w-100"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Processing...
          </>
        ) : (
          `Pay $${amount}`
        )}
      </Button>
    </form>
  );
};

// Main component for payment page
const StripePayment = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract order information from navigation state
  const { order } = location.state || {};
  
  useEffect(() => {
    // Check if order information exists
    if (!order) {
      navigate('/cart');
      return;
    }
    
    // Get Stripe key from backend
    const getStripeKey = async () => {
      try {
        const { data } = await paymentsApi.getConfig();
        const stripeInstance = await loadStripe(data.publishable_key);
        setStripePromise(stripeInstance);
      } catch (error) {
        console.error('Error loading Stripe:', error);
      }
    };
    
    getStripeKey();
  }, [order, navigate]);
  
  // If Stripe hasn't loaded yet or order information is not provided
  if (!stripePromise || !order) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Complete Your Payment</h2>
      
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h3>Order Summary</h3>
        </Card.Header>
        <Card.Body>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total Amount:</strong> ${order.total}</p>
        </Card.Body>
      </Card>
      
      <Card className="shadow-sm">
        <Card.Body>
          <Elements stripe={stripePromise}>
            <CheckoutForm order={order} amount={order.total} />
          </Elements>
        </Card.Body>
      </Card>
      
      <div className="text-center mt-4">
        <Button variant="outline-secondary" onClick={() => navigate('/cart')}>
          Back to Cart
        </Button>
      </div>
    </Container>
  );
};

export default StripePayment;
