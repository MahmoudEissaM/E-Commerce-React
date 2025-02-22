import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/productapi";
import { Form, Button, Nav } from "react-bootstrap";

export function ProductDetails({ addToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [priceRange, setPriceRange] = useState(250);
    const [activeTab, setActiveTab] = useState("description");
    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        getProductById(id)
            .then((response) => {
                setProduct(response.data);
                setMainImage(response.data.image);
            })
            .catch((error) => console.log(error));
    }, [id]);

    if (!product) {
        return <h2 className="text-center text-light">Loading...</h2>;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="bg-dark text-light p-4 rounded shadow-lg">
                        <h3 className="text-warning">Filters</h3>
                        <hr className="border-warning" />

                        <div className="mb-4">
                            <h5 className="text-muted">Product Category</h5>
                            {["Phones", "HeadPhones", "Laptops"].map((cat, index) => (
                                <Form.Check key={index} type="checkbox" label={`${cat} `} className="text-light" />
                            ))}
                        </div>

                        <div className="mb-4">
                            <h5 className="text-muted">Filter by Price</h5>
                            <Form.Range min={50} max={500} value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
                            <p className="text-warning">Price: $50 - ${priceRange}</p>
                            <Button variant="primary" className="w-100">Filter</Button>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-muted">Product Colors</h5>
                            {[
                                { name: "Blue", color: "#007bff" },
                                { name: "Yellow", color: "#ffc107" },
                                { name: "Red", color: "#dc3545" }
                            ].map((item, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <div style={{ width: "20px", height: "20px", backgroundColor: item.color, borderRadius: "50%", marginRight: "10px" }}></div>
                                    <Form.Check type="checkbox" label={item.name} className="text-light" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="bg-dark p-5 rounded text-light shadow-lg">
                        <div className="row">
                            <div className="col-md-5">
                                <img src={mainImage} alt={product.name} className="img-fluid rounded w-100" />
                            </div>
                            <div className="col-md-7">
                                <h1 className="text-warning mb-3">Product Details</h1>
                                <p className="lead fs-5">Product Name: {product.name}</p>
                                <p className="lead fs-5">Product Price: {product.price}$</p>
                                <p className="lead fs-5">Product Quantity: {product.quantity} items</p>
                                <p className="lead fs-5">Description: {product.description}</p>

                                <div>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-warning fs-1 mx-1" />
                                    ))}
                                </div>


                                <Button
                                    className="btn btn-danger mt-4"
                                    onClick={() => addToCart(product)}
                                >
                                    Add To Cart
                                </Button>
                            </div>
                        </div>

                        <Nav variant="tabs" className="mt-4">
                            {["description", "information", "review"].map((tab) => (
                                <Nav.Item key={tab}>
                                    <Nav.Link onClick={() => setActiveTab(tab)} className={activeTab === tab ? "text-danger fw-bold" : "text-light"}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>

                        <div className="p-4">
                            {activeTab === "description" && <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>}
                            {activeTab === "information" && <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit...</p>}
                            {activeTab === "review" && <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
