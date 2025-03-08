import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        image: "",
        description: "",
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3005/products/${id}`)
                .then((response) => {
                    setProduct(response.data);
                    setPreview(response.data.image);
                })
                .catch((error) => console.error("Error fetching product:", error));
        }
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const blobURL = URL.createObjectURL(file);
            setPreview(blobURL);
            setProduct({ ...product, image: blobURL });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:3005/products/${id}`, product);
            } else {
                await axios.post("http://localhost:3005/products", product);
            }
            navigate("/products");
        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };

    // ===========================================================================


    return (
        <div className="container mt-5">
            <div className="card bg-dark text-light shadow-lg border-0">
                <div className="card-header text-center">
                    <h2 className="m-2" style={{ color: "#FFD369" }}>
                        {id ? "Edit Product" : "Add New Product"}
                    </h2>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Product Name</label>
                                    <input type="text" className="form-control bg-secondary text-white" name="name" value={product.name} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Category</label>
                                    <input type="text" className="form-control bg-secondary text-white" name="category" value={product.category} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Price</label>
                                    <input type="number" className="form-control bg-secondary text-white" name="price" value={product.price} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Quantity</label>
                                    <input type="number" className="form-control bg-secondary text-white" name="quantity" value={product.quantity} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea className="form-control bg-secondary text-white" name="description" value={product.description} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="col-md-6 d-flex flex-column align-items-center">
                                <label className="form-label fw-bold">Product Image</label>
                                <input type="file" className="form-control mb-3 bg-secondary text-white" accept="image/*" onChange={handleImageChange} required={!id} />

                                {preview ? (
                                    <img src={preview} alt="Preview" className="img-fluid rounded shadow" style={{ maxHeight: "250px", objectFit: "contain" }} />
                                ) : (
                                    <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{ width: "100%", height: "250px" }}>
                                        <span className="text-muted">No Image Selected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-warning me-2">
                            {id ? "Update Product" : "Add Product"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
