import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

export function ManageTables() {
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:3005/Tables");
                setTables(response.data);
            } catch (error) {
                setErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTables();
    }, []);

    // ===========================================================================


    const handleDelete = async (tableId) => {
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
                    await axios.delete(`http://localhost:3005/Tables/${tableId}`);
                    setTables(tables.filter(table => table.id !== tableId));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Table has been deleted.",
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

    // ===========================================================================


    const handleApprove = async (tableId) => {
        try {
            const table = tables.find(table => table.id === tableId);
            const updatedTable = { ...table, status: "Approved" };
            await axios.put(`http://localhost:3005/Tables/${tableId}`, updatedTable);
            setTables(tables.map(table => table.id === tableId ? updatedTable : table));
            Swal.fire({
                title: "Success!",
                text: "Table has been approved.",
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
    // ===========================================================================


    return (
        <div className='container mt-5'>

            {isLoading && <div className='mt-5 alert alert-dark'><h1>Loading ...... </h1></div>}
            {errors && <div className='mt-5 alert alert-danger'>{errors.message}</div>}

            {!isLoading && !errors &&
                <Table className='mt-4 table-dark table-bordered'>
                    <thead className="table-warning">
                        <tr>
                            <th>Table ID</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) => (
                            <tr key={table.id}>
                                <td>{table.id}</td>
                                <td>{table.name}</td>
                                <td>{table.email}</td>
                                <td>{table.phone}</td>
                                <td>{table.date}</td>
                                <td>{table.time}</td>
                                <td>{table.guests}</td>
                                <td>{table.status || "Pending"}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleApprove(table.id)}>Approve</Button>
                                    <Button variant="danger" className="ms-2" onClick={() => handleDelete(table.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            }
        </div>
    );
}