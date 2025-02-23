import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { MapComponent } from "../components/MapComponent";
import Swal from 'sweetalert2';

export function BookTable() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        guests: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3005/Tables", formData);
            console.log("Table booked successfully:", response.data);


            Swal.fire({
                title: 'Success!',
                text: 'Your table has been booked successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ffbe33',
                background: '#222',
                color: '#fff',
            });
        } catch (error) {
            console.error("Error booking table:", error);


            Swal.fire({
                title: 'Error!',
                text: 'Failed to book the table. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ffbe33',
                background: '#222',
                color: '#fff',
            });
        }
    };


    return (
        <div className="book-table-container">
            <Container className="py-5">
                <Row className="d-flex align-items-center">
                    <Col md={6} className="form-container">
                        <div className="form-box">
                            <h2 className="text-center text-warning mb-3">Book A Table</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" placeholder="Your Name" name="name" value={formData.name} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="tel" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="email" placeholder="Your Email" name="email" value={formData.email} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Select name="guests" value={formData.guests} onChange={handleChange} required>
                                        <option value="">How many persons?</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5+">5+</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                                </Form.Group>
                                <Button type="submit" className="book-btn">
                                    BOOK NOW
                                </Button>
                            </Form>
                        </div>
                    </Col>

                    <Col md={6} className="map-container">
                        <MapComponent />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}