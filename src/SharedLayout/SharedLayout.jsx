import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function SharedLayout({ cartCount, onSearch }) {
    return (
        <div className="layout-container">
            <Header cartCount={cartCount} onSearch={onSearch} />
            <main className="content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}