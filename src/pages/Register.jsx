import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
            const response = await axios.get('http://localhost:3005/users');
            const existingUser = response.data.find(user => user.email === email);

            if (existingUser) {
                Swal.fire("Error", "Email already registered!", "error");
                return;
            }

            const newUser = { name, email, password, role: "user" };
            await axios.post('http://localhost:3005/users', newUser);

            Swal.fire("Success", "Registration successful!", "success").then(() => {
                navigate('/login');
            });

        } catch (err) {
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    };

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
