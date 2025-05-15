import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authApi } from '../api/apiService';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ===========================================================================

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            Swal.fire("Error", "Invalid email format!", "error");
            return;
        }
        if (password.length < 6) {
            Swal.fire("Error", "Password must be at least 6 characters long!", "error");
            return;
        }

        try {
            // Create new user with the Django API
            const newUser = { 
                username: email,  // Using email as username
                email: email, 
                password: password, 
                first_name: name,
                role: "customer" 
            };
            
            await authApi.register(newUser);

            Swal.fire("Success", "Registration successful!", "success").then(() => {
                navigate('/login');
            });

        } catch (err) {
            // Handle different error responses
            if (err.response && err.response.data) {
                // Check for specific error messages from the backend
                if (err.response.data.username) {
                    Swal.fire("Error", "This email is already registered!", "error");
                } else {
                    Swal.fire("Error", err.response.data.detail || "Registration failed. Please try again.", "error");
                }
            } else {
                Swal.fire("Error", "Something went wrong. Please try again.", "error");
            }
        }
    };
    // ===========================================================================


    return (
        <div className="container register-container mt-5">
            <h2 className="text-center register">Register</h2>
            <form onSubmit={handleRegister} className="registerForm shadow p-4 bg-light rounded">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="btn-container">
                    <button className="btn btn-warning w-25" type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}
