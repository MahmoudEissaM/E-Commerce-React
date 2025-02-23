import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { deleteProduct } from '../api/productapi';
import Swal from 'sweetalert2';
import { ManageUsers } from './ManageUsers';
import { ManageOrders } from './ManageOrders';
import { ManageTables } from './ManageTables';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Products() {

    // ========================Prevent Normal Users ===================================

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    React.useEffect(() => {
        if (!user || user.role !== "admin") {
            toast.error("You do not have permission to access this page this page for admins only.", {
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
            navigate('/');
        }
    }, [user, navigate]);

    // ===================================================================

    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [errors, setErrors] = useState(null);
    let [isLoading, setIsLoading] = useState(true);
    let [search, setSearch] = useState("");
    const [activeSection, setActiveSection] = useState("menu");

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let response = await axios.get("http://localhost:3005/products");
                let productsData = response.data.map(product => ({
                    ...product,
                    price: Number(product.price),
                    quantity: Number(product.quantity)
                }));
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                setErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async (product) => {
        await axios.post("http://localhost:3005/products", {
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity)
        });
    };

    const updateProduct = async (productId, product) => {
        await axios.put(`http://localhost:3005/products/${productId}`, {
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity)
        });
    };

    const deleteHandler = async (productId) => {
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
                    await deleteProduct(productId);
                    let newProducts = products.filter(product => product.id !== productId);
                    setProducts(newProducts);
                    setFilteredProducts(newProducts);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your product has been deleted.",
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

    const handleSearch = (e) => {
        let searchValue = e.target.value.toLowerCase();
        setSearch(searchValue);
        setFilteredProducts(products.filter(product =>
            product.name.toLowerCase().includes(searchValue)
        ));
    };

    return (
        <div className='container mt-5'>
            <h2 className='text-center text-warning fw-bold'>Admin Dashboard</h2>

            <div className="mt-4 d-flex justify-content-center gap-3">
                <Button
                    variant={activeSection === "menu" ? "warning" : "outline-warning"}
                    onClick={() => setActiveSection("menu")}
                >
                    Manage Menu
                </Button>
                <Button
                    variant={activeSection === "orders" ? "warning" : "outline-warning"}
                    onClick={() => setActiveSection("orders")}
                >
                    Manage Orders
                </Button>
                <Button
                    variant={activeSection === "users" ? "warning" : "outline-warning"}
                    onClick={() => setActiveSection("users")}
                >
                    Manage Users
                </Button>
                <Button
                    variant={activeSection === "tables" ? "warning" : "outline-warning"}
                    onClick={() => setActiveSection("tables")}
                >
                    Manage Tables
                </Button>
            </div>

            <div className="mt-4">
                {activeSection === "menu" && (
                    <>
                        <div className='mt-5 d-flex'>
                            <Link to="/products/new" >
                                <button className="btn btn-warning fw-bold me-3">Add New </button>
                            </Link>

                            <Form.Control
                                type="text"
                                className='w-25 border-warning'
                                placeholder='Search products...'
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>

                        {isLoading && <div className='mt-5 alert alert-dark'><h1>Loading ...... </h1></div>}
                        {errors && <div className='mt-5 alert alert-danger'>{errors.message}</div>}

                        {!isLoading && !errors &&
                            <>
                                <Table className='mt-4 table-dark table-bordered'>
                                    <thead className="table-warning">
                                        <tr>
                                            <th>Image</th>
                                            <th>ID</th>
                                            <th>Product Name</th>
                                            <th>Product Price</th>
                                            <th>Product Quantity</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => {
                                            return (
                                                <tr key={product.id}>
                                                    <td>
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            style={{
                                                                width: "100px",
                                                                height: "50px",
                                                                objectFit: "contain",
                                                                borderRadius: "5px"
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{product.id}</td>
                                                    <td className='fw-bold text-warning'>{product.name}</td>
                                                    <td className='fw-bold'>{product.price.toFixed(2)}$</td>
                                                    <td className={
                                                        product.quantity > 1 ? "text-success fw-bold" :
                                                            product.quantity === 1 ? "text-warning fw-bold" :
                                                                "text-danger fw-bold"
                                                    }>
                                                        {product.quantity > 1 ? product.quantity :
                                                            product.quantity === 1 ? "Only one product left!" :
                                                                "Sold Out"}
                                                    </td>
                                                    <td>
                                                        <Link to={`/products/${product.id}/edit`}>
                                                            <FaEdit className='text-info mx-2 fs-4' />
                                                        </Link>

                                                        <Link to={`/products/${product.id}`}>
                                                            <IoEye className='text-warning mx-2 fs-4' />
                                                        </Link>
                                                        <MdDelete className='text-danger mx-2 fs-4' style={{ cursor: "pointer" }} onClick={() => deleteHandler(product.id)} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </>
                        }
                    </>
                )}

                {activeSection === "orders" && <ManageOrders />}
                {activeSection === "users" && <ManageUsers />}
                {activeSection === "tables" && <ManageTables />}
            </div>
        </div>
    );
}