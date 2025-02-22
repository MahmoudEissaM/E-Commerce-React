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
        // فلترة المنتجات بناءً على القيمة المدخلة في السيرش
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // فلترة إضافية بناءً على الفئة المختارة
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
                        <ProductCard product={product} addToCart={addToCart} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}