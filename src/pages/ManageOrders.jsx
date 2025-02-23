import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

export function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:3005/orders");
                setOrders(response.data);
            } catch (error) {
                setErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3005/orders/${orderId}`);
                    setOrders(orders.filter(order => order.id !== orderId));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Order has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleApprove = async (orderId) => {
        try {
            const order = orders.find(order => order.id === orderId);
            const updatedOrder = { ...order, status: "Approved" };
            await axios.put(`http://localhost:3005/orders/${orderId}`, updatedOrder);
            setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
            Swal.fire({
                title: "Success!",
                text: "Order has been approved.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong.",
                icon: "error"
            });
        }
    };

    return (
        <div className='container mt-5'>

            {isLoading && <div className='mt-5 alert alert-dark'><h1>Loading ...... </h1></div>}
            {errors && <div className='mt-5 alert alert-danger'>{errors.message}</div>}

            {!isLoading && !errors &&
                <Table className='mt-4 table-dark table-bordered'>
                    <thead className="table-warning">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customerInfo.name}</td>
                                <td>
                                    {order.cart.map((product) => (
                                        <div key={product.id} className="d-flex align-items-center mb-2">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    borderRadius: "5px",
                                                    marginRight: "10px"
                                                }}
                                            />
                                            <div>
                                                <strong>{product.name}</strong>
                                                <div>Quantity: {product.quantity}</div>
                                                <div>Price: ${product.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </td>
                                <td>${order.total.toFixed(2)}</td>
                                <td>{order.status || "Pending"}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleApprove(order.id)}>Approve</Button>
                                    <Button variant="danger" className="ms-2" onClick={() => handleDelete(order.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            }
        </div>
    );
}