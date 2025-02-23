import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaBan, FaCheck } from 'react-icons/fa';


export function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:3005/users");
                setUsers(response.data);
            } catch (error) {
                setErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3005/users/${userId}`);
                    setUsers(users.filter(user => user.id !== userId));
                    Swal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleBlock = async (userId) => {
        try {
            const user = users.find(user => user.id === userId);
            const updatedUser = { ...user, isBlocked: !user.isBlocked };
            await axios.put(`http://localhost:3005/users/${userId}`, updatedUser);
            setUsers(users.map(user => user.id === userId ? updatedUser : user));
            Swal.fire({
                title: "Success!",
                text: `User has been ${updatedUser.isBlocked ? "blocked" : "unblocked"}.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong.",
                icon: "error"
            });
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            const user = users.find(user => user.id === userId);
            const updatedUser = { ...user, role: newRole };
            await axios.put(`http://localhost:3005/users/${userId}`, updatedUser);
            setUsers(users.map(user => user.id === userId ? updatedUser : user));
            Swal.fire({
                title: "Success!",
                text: `User role has been updated to ${newRole}.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong.",
                icon: "error"
            });
        }
    };

    return (
        <div className='container mt-5'>

            {isLoading && <div className='mt-5 alert alert-dark'><h1>Loading ...... </h1></div>}
            {errors && <div className='mt-5 alert alert-danger'>{errors.message}</div>}

            {!isLoading && !errors &&
                <Table className='mt-4 table-dark table-bordered'>
                    <thead className="table-warning">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name || user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </td>
                                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(user.id)}>
                                        <FaTrash />
                                    </Button>
                                    <Button
                                        variant={user.isBlocked ? "success" : "warning"}
                                        className="ms-2"
                                        onClick={() => handleBlock(user.id)}
                                    >
                                        {user.isBlocked ? <FaCheck /> : <FaBan />}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            }
        </div>
    );
}