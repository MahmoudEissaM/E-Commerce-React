import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { AboutSection } from "../components/AboutSection";
import { BookTable } from "./BookTable";

export function Home({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3005/products");
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const filterProducts = (category) => {
        setCategoryFilter(category);
        if (category === "all") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category.toLowerCase() === category.toLowerCase()));
        }
    };

    return (

        <div className="home-container" style={{ backgroundColor: "#181818", color: "#EEEEEE", paddingBottom: "50px", overflowX: "hidden" }}>

            {/* ================================Carousel================================ */}

            <div className="carousel-container position-relative">
                <img
                    className="d-block w-100 carousel-image"
                    src="https://www.fullburger.com.tr/image/cache/catalog/slider/burger-slider-1320x600.jpg"
                    alt="Product Background"
                />
                <Carousel controls={false} indicators={true} className="carousel-overlay">
                    <Carousel.Item interval={2000}>
                        <div className="carousel-text">
                            <h2>Fast Food Restaurant</h2>
                            <p>Delicious burgers, crispy fries, and refreshing drinks all in one place!</p>
                            <Link to="/menu" className="btn btn-warning" >
                                <FaShoppingCart /> Order Now
                            </Link>                        </div>
                    </Carousel.Item>

                    <Carousel.Item interval={2000}>
                        <div className="carousel-text">
                            <h2>Fresh Ingredients</h2>
                            <p>We use only the freshest ingredients to serve you the best fast food.</p>
                            <Link to="/menu" className="btn btn-warning" >
                                <FaShoppingCart /> Order Now
                            </Link>                        </div>
                    </Carousel.Item>

                    <Carousel.Item interval={2000}>
                        <div className="carousel-text">
                            <h2>Order Online</h2>
                            <p>Get your favorite meals delivered to your doorstep in no time!</p>
                            <Link to="/menu" className="btn btn-warning" >
                                <FaShoppingCart /> Order Now
                            </Link>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
            {/* ================================Carousel end ================================ */}

            {/* ================================banners offers===================================== */}

            <div className="container mt-4" style={{ backgroundColor: "#181818", color: "#EEEEEE", minHeight: "100vh" }}>
                <div className="row mb-5">
                    {/*first*/}
                    <div className="col-md-6">
                        <div className="p-4 rounded text-center d-flex align-items-center justify-content-between" style={{ backgroundColor: "#FFD369", color: "#222831" }}>
                            <div className="w-50 text-center">
                                <img src="https://themewagon.github.io/feane/images/o1.jpg" alt="Tasty Thursdays" className="img-fluid rounded-circle border border-3 border-white img-hover" style={{ maxHeight: "150px", width: "150px", objectFit: "cover", transition: "transform 0.3s ease-in-out" }} />
                            </div>
                            <div className="w-50 text-start">
                                <h2 className="fw-bold">Tasty Thursdays</h2>
                                <p className="fs-4">20% Off</p>
                                <Link to="/menu" className="btn d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: "#222831", color: "#FFD369" }}>
                                    <FaShoppingCart /> Order Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* second */}
                    <div className="col-md-6">
                        <div className="p-4 bg-danger text-white rounded text-center d-flex align-items-center justify-content-between">
                            <div className="w-50 text-center">
                                <img src="https://themewagon.github.io/feane/images/o2.jpg" alt="Pizza Days" className="img-fluid rounded-circle border border-3 border-white img-hover" style={{ maxHeight: "150px", width: "150px", objectFit: "cover", transition: "transform 0.3s ease-in-out" }} />
                            </div>
                            <div className="w-50 text-start">
                                <h2 className="fw-bold">Pizza Days</h2>
                                <p className="fs-4">15% Off</p>
                                <Link to="/menu" className="btn d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: "#FFD369", color: "#222831" }}>
                                    <FaShoppingCart /> Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="menu-title text-center mb-4" style={{ fontFamily: "'Cinzel', serif", fontSize: "3rem", fontWeight: "700", color: "#FFD369" }}>
                    Our Menu
                </h2>

                {/* ================================banners offers end ===================================== */}


                {/* ================================menus===================================== */}

                <div className="text-center mb-4">
                    <Button variant="warning" onClick={() => filterProducts("all")} className="mx-2">All</Button>
                    <Button variant="warning" onClick={() => filterProducts("burger")} className="mx-2">Burgers</Button>
                    <Button variant="warning" onClick={() => filterProducts("pizza")} className="mx-2">Pizzas</Button>
                    <Button variant="warning" onClick={() => filterProducts("pasta")} className="mx-2">Pasta</Button>
                    <Button variant="warning" onClick={() => filterProducts("fries")} className="mx-2">Fries</Button>
                </div>

                <Row>
                    {filteredProducts.map(product => (
                        <Col md={4} key={product.id} className="mb-4">
                            <ProductCard product={product} addToCart={addToCart} /> {/* تمرير addToCart هنا */}
                        </Col>
                    ))}
                </Row>

                <div className="about-container">
                    <AboutSection />
                </div>

                <BookTable />
                {/* ================================menus===================================== */}

            </div>
        </div>
    );
}