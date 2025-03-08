import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart({ cart, setCart, removeFromCart, updateQuantity }) {


    // =============================Prevent Anonymouse Users =====================================
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    React.useEffect(() => {
        if (!user) {
            toast.error("You must be logged in to access the cart.", {
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

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
    };

    // ===========================================================================

    const handleRemove = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this item from the cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(productId);
                Swal.fire('Deleted!', 'Your item has been removed.', 'success');
            }
        });
    };

    return (
        <div className="cart-page">
            <Container className="mt-4">
                <h2 className="text-center mb-4 text-light">Your Cart</h2>
                {cart.length === 0 ? (
                    <p className="text-center text-light">Your cart is empty.</p>
                ) : (
                    <Table striped bordered hover variant="dark" className="cart-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((product, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="cart-img"
                                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td className="quantity-control">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}>
                                            -
                                        </Button>
                                        <span className="mx-2 text-light">{product.quantity}</span>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                                            +
                                        </Button>
                                    </td>
                                    <td>${(product.price * product.quantity).toFixed(2)}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleRemove(product.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                <h4 className="text-end text-light">Total: ${calculateTotal()}</h4>
                <div className="text-center mt-3">
                    <Link to="/order">
                        <Button variant="success">Order Now</Button>
                    </Link>
                </div>
            </Container>
        </div>
    );
}

export default Cart;