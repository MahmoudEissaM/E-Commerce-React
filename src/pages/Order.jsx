import React, { useState } from 'react';
import { Container, Table, Button, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Order({ cart }) {


    // ==========================Prevent Anonymouse Users===============================

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    React.useEffect(() => {
        if (!user) {
            toast.error("You must be logged in to access this page.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style: { backgroundColor: '#dc3545', color: '#fff' },
            });
            navigate('/login');
        }
    }, [user, navigate]);

    // ===========================================================================


    const taxRate = 0.15;
    const deliveryFee = 20.0;

    const calculateSubtotal = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = subtotal * taxRate;
    const total = subtotal + tax + deliveryFee;

    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        address: '',
        phone: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    // ===========================================================================

    const validateForm = () => {
        const phoneRegex = /^(010|011|012|015)\d{8}$/;
        const nameRegex = /^[A-Za-z\s]{4,}$/;
        const cardNumberRegex = /^\d{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^\d{3}$/;

        if (cart.length === 0) {
            Swal.fire('Error', 'Your cart is empty.', 'error');
            return false;
        }
        if (!customerInfo.name.match(nameRegex)) {
            Swal.fire('Error', 'Please enter a valid full name (at least four words).', 'error');
            return false;
        }
        if (!customerInfo.phone.match(phoneRegex)) {
            Swal.fire('Error', 'Please enter a valid Egyptian phone number.', 'error');
            return false;
        }
        if (!customerInfo.address) {
            Swal.fire('Error', 'Please enter your address.', 'error');
            return false;
        }
        if (paymentMethod === 'Credit Card') {
            if (!customerInfo.cardNumber.match(cardNumberRegex)) {
                Swal.fire('Error', 'Please enter a valid 16-digit card number.', 'error');
                return false;
            }
            if (!customerInfo.expiryDate.match(expiryDateRegex)) {
                Swal.fire('Error', 'Please enter a valid expiry date (MM/YY).', 'error');
                return false;
            }
            if (!customerInfo.cvv.match(cvvRegex)) {
                Swal.fire('Error', 'Please enter a valid 3-digit CVV.', 'error');
                return false;
            }
        }
        return true;
    };

    // ===========================================================================

    const handleConfirmOrder = () => {
        if (!validateForm()) return;

        const orderData = {
            id: new Date().getTime().toString(),
            customerInfo,
            cart,
            paymentMethod,
            subtotal,
            tax,
            deliveryFee,
            total,
            date: new Date().toISOString()
        };

        // ===========================================================================


        Swal.fire({
            title: 'Confirm Your Order',
            html: `
                <div style='text-align: left; background: #333; color: #fff; padding: 20px; border-radius: 10px;'>
                    <h4>Order Summary</h4>
                    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                    <p><strong>Tax (15%):</strong> $${tax.toFixed(2)}</p>
                    <p><strong>Delivery Fee:</strong> $${deliveryFee.toFixed(2)}</p>
                    <h4><strong>Total Amount:</strong> $${total.toFixed(2)}</h4>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> ${customerInfo.name}</p>
                    <p><strong>Address:</strong> ${customerInfo.address}</p>
                    <p><strong>Phone:</strong> ${customerInfo.phone}</p>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confirm',
            cancelButtonText: 'Cancel',
            background: '#222',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://localhost:3005/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire('Order Confirmed!', 'Your order has been placed successfully.', 'success');
                    })
                    .catch(error => {
                        Swal.fire('Error', 'There was an issue placing your order.', 'error');
                    });
            }
        });
    };

    // ===========================================================================

    return (
        <Container className="order-page mt-5 text-light">
            <h2 className="text-center mb-4">Order Summary</h2>
            <Card className="p-4 shadow-lg bg-dark text-light">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td><img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} /></td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="text-end">
                    <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                    <p><strong>Tax (15%):</strong> ${tax.toFixed(2)}</p>
                    <p><strong>Delivery Fee:</strong> ${deliveryFee.toFixed(2)}</p>
                    <h4><strong>Total Amount:</strong> ${total.toFixed(2)}</h4>
                </div>
            </Card>

            <h4 className="mt-4">Customer Information</h4>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="name" value={customerInfo.name} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={customerInfo.address} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone" value={customerInfo.phone} onChange={handleInputChange} required />
                </Form.Group>
            </Form>

            <h4 className="mt-4">Payment Method</h4>
            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="Credit Card">
                    Credit Card <i className="fab fa-cc-visa"></i> <i className="fab fa-cc-mastercard"></i>
                </option>
                <option value="Cash on Delivery">
                    Cash on Delivery <i className="fas fa-money-bill-wave"></i>
                </option>
                <option value="Mobile Wallet">
                    Mobile Wallet <i className="fas fa-mobile-alt"></i>
                </option>
            </Form.Select>

            {paymentMethod === 'Credit Card' && (
                <Form className="mt-4">
                    <Form.Group className="mb-3">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="cardNumber"
                            value={customerInfo.cardNumber}
                            onChange={handleInputChange}
                            placeholder="Enter 16-digit card number"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Expiry Date (MM/YY)</Form.Label>
                        <Form.Control
                            type="text"
                            name="expiryDate"
                            value={customerInfo.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                            type="text"
                            name="cvv"
                            value={customerInfo.cvv}
                            onChange={handleInputChange}
                            placeholder="Enter 3-digit CVV"
                            required
                        />
                    </Form.Group>
                </Form>
            )}

            <div className="text-center mt-4">
                <Button variant="success" onClick={handleConfirmOrder}>Confirm Order</Button>
                <Link to="/cart" className="btn btn-secondary ms-3">Back to Cart</Link>
            </div>
        </Container>
    );
}

export default Order;