import React from 'react';
import { Card } from 'react-bootstrap';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



function ProductCard({ product, addToCart }) {
    const navigate = useNavigate();
    const quantity = parseInt(product.quantity, 10);

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <Card className="custom-card shadow" style={{ borderRadius: "15px", maxWidth: "300px" }}>
            <Card.Img
                variant="top"
                src={product.image || "https://via.placeholder.com/150"}
                style={{ objectFit: "contain", height: "200px", borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
            />
            <Card.Body style={{ background: "#1a1a1a", color: "white", padding: "20px", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Card.Title className="text-center" style={{ fontSize: "20px", fontWeight: "600", color: "#FFD369" }}>
                    {product.name}
                </Card.Title>
                <Card.Text className="text-center" style={{ fontSize: "14px" }}>
                    {product.description}
                </Card.Text>
                <Card.Text className={quantity > 1 ? "text-success fw-bold text-center" : quantity === 1 ? "text-warning fw-bold text-center" : "text-danger fw-bold text-center"}>
                    {quantity > 1 ? `${quantity} available` : quantity === 1 ? "Only one product left!" : "Sold Out"}
                </Card.Text>
                <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold" style={{ color: "#FFD369" }}>${product.price}</span>
                    <div className="icon-container d-flex">
                        <div
                            className="view-icon me-2"
                            style={{ background: "#17a2b8", color: "white", padding: "10px", borderRadius: "50%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            <FaEye />
                        </div>
                        <div
                            className="cart-icon"
                            style={{ background: "#ffcc00", color: "black", padding: "10px", borderRadius: "50%", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart />
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;