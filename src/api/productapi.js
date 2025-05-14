import axios from "axios";

// Update API URL to point to Django server
const baseURL = `${import.meta.env.VITE_API_URL}/api/products`;

// Get all products
const getAllProducts = () => axios.get(baseURL);

// Get a specific product by ID
const getProductById = (productId) => axios.get(`${baseURL}/${productId}/`);

// Add a new product
const addNewProduct = (product) => axios.post(baseURL + '/', product);

// Delete a product
const deleteProduct = (productId) => axios.delete(`${baseURL}/${productId}/`);

// Update a product
const editProduct = (productId, product) => axios.put(`${baseURL}/${productId}/`, product);

export { getAllProducts, getProductById, addNewProduct, deleteProduct, editProduct };

