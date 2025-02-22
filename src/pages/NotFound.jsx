import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className='notfound d-flex flex-column justify-content-center align-items-center text-center vh-100 bg-dark text-light'>
            <h1 className='display-1 fw-bold text-warning'>404</h1>
            <h2 className='text-light mb-4'>Oops! Page Not Found</h2>
            <p className='text-muted w-50'>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="btn btn-warning fw-bold px-4 py-2 mt-3">
                Go Back Home
            </Link>
        </div>
    );
}
