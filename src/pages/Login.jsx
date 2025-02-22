import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
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
            const user = response.data.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                Swal.fire("Success", "Login successful!", "success").then(() => {
                    navigate(user.role === 'admin' ? '/products' : '/');
                });
            } else {
                Swal.fire("Error", "Invalid email or password!", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary">Login</h2>
            <form onSubmit={handleLogin} className="shadow p-4 bg-light rounded">
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
                <button className="btn btn-primary w-100" type="submit">Login</button>
            </form>
        </div>
    );
}
