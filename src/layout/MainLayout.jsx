import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SharedLayout } from '../SharedLayout/SharedLayout';
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { ProductForm } from '../pages/ProductForm';
import { ProductDetails } from '../pages/ProductDetails';
import { NotFound } from '../pages/NotFound';
import { Menu } from '../pages/Menu';
import { About } from "../pages/About";
import { BookTable } from "../pages/BookTable";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export function MainLayout() {
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
        setCartCount((prevCount) => prevCount + 1);
    };

    const updateQuantity = (productId, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(newQuantity, 1) } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        setCartCount((prevCount) => Math.max(prevCount - 1, 0));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<SharedLayout cartCount={cartCount} />}>
                    <Route index element={<Home addToCart={addToCart} />} />
                    <Route path='products' element={<Products />} />
                    <Route path='products/:id/edit' element={<ProductForm />} />
                    <Route path='products/new' element={<ProductForm />} />
                    <Route path='products/:id' element={<ProductDetails addToCart={addToCart} />} />
                    <Route path='menu' element={<Menu addToCart={addToCart} />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/book-table' element={<BookTable />} />
                    <Route path='/cart' element={<Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
                    <Route path='/order' element={<Order cart={cart} />} />

                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
