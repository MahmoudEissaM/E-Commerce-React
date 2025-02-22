import React, { useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export function Menu({ addToCart, searchQuery }) {
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

    useEffect(() => {
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (categoryFilter !== "all") {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        setFilteredProducts(filtered);
    }, [searchQuery, categoryFilter, products]);

    const filterProducts = (category) => {
        setCategoryFilter(category);
    };

    return (
        <div className="container mt-4">
            <h2 className="menu-title text-center mb-4">Our Menu</h2>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                <Button variant="warning" onClick={() => filterProducts("all")}>All</Button>
                <Button variant="warning" onClick={() => filterProducts("burger")}>Burgers</Button>
                <Button variant="warning" onClick={() => filterProducts("pizza")}>Pizzas</Button>
                <Button variant="warning" onClick={() => filterProducts("pasta")}>Pasta</Button>
                <Button variant="warning" onClick={() => filterProducts("fries")}>Fries</Button>
            </div>

            <Row className="justify-content-center">
                {filteredProducts.map(product => (
                    <Col md={4} sm={6} xs={12} className="mb-4 d-flex justify-content-center">
                        <ProductCard product={product} addToCart={addToCart} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
