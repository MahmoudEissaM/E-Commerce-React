import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productapi";
import { Button, Nav } from "react-bootstrap";
import { BsCartFill } from "react-icons/bs";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export function ProductDetails({ addToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-warning fs-4 mx-1" />);
            } else if (i - 0.5 === rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-warning fs-4 mx-1" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-warning fs-4 mx-1" />);
            }
        }
        return stars;
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="bg-dark p-5 rounded text-light shadow-lg">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="img-fluid rounded w-75 shadow-lg"
                            style={{ transition: "0.3s", transform: "scale(1.05)" }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h1 className="text-warning">{product.name}</h1>
                        <h3 className="text-danger">${product.price}</h3>
                        <p className="fs-5 text-muted">Available: {product.quantity} items</p>
                        <p className="fs-5">{product.description}</p>

                        <div>{renderStars(product.rating || 4.5)}</div>

                        <Button
                            className="mt-4 px-4 py-2 fs-5 d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: "#ffc107", border: "none", color: "#000" }}
                            onClick={() => addToCart(product)}
                        >
                            <BsCartFill className="fs-4" /> Add To Cart
                        </Button>
                    </div>
                </div>

                <Nav variant="tabs" className="mt-5">
                    {["description", "information", "review"].map((tab) => (
                        <Nav.Item key={tab}>
                            <Nav.Link
                                onClick={() => setActiveTab(tab)}
                                className={activeTab === tab ? "text-danger fw-bold" : "text-light"}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                <div className="p-4">
                    {activeTab === "description" && <p>Experience the power of {product.name}! Designed for performance, reliability, and top-notch quality.</p>}
                    {activeTab === "information" && <p>Brand: {product.brand} <br /> Warranty: 2 Years <br /> Shipping: Worldwide</p>}
                    {activeTab === "review" && <p>⭐⭐⭐⭐⭐ "Amazing product! Highly recommend it!" - John Doe</p>}
                </div>
            </div>
        </div>
    );
}
