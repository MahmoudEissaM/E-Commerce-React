import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authApi } from '../api/apiService';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ======================================================

    const handleLogin = async (e) => {
        e.preventDefault();

        // تم إزالة التحقق من صيغة البريد الإلكتروني لأننا نسمح بتسجيل الدخول باستخدام اسم المستخدم أيضًا

        if (password.length < 6) {
            Swal.fire("Error", "Password must be at least 6 characters long!", "error");
            return;
        }

        try {
            // Use the new authentication API
            const response = await authApi.login({ username: username, password: password });
            
            if (response.data && response.data.token) {
                const user = {
                    id: response.data.user_id,
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    token: response.data.token
                };
                
                localStorage.setItem('user', JSON.stringify(user));

                Swal.fire("Success", "Login successful!", "success").then(() => {
                    navigate(user.role === 'admin' ? '/products' : '/');
                });
            } else {
                Swal.fire("Error", "Invalid email or password!", "error");
            }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || "Something went wrong. Please try again.", "error");
        }
    };
    // ===========================================================================

    return (
        <div className="container login-container mt-5">
            <h2 className="text-center login">Login</h2>
            <form onSubmit={handleLogin} className="loginForm shadow p-4 bg-light rounded">
                <input
                    type="text"
                    placeholder="Username or Email"
                    className="form-control mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <div className='btn-container'>
                    <button className="btn btn-warning w-25" type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}