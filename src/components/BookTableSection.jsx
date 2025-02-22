import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export function BookTableSection() {
    return (
        <Container className="text-center my-5" style={{height: 400 }}>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="menu-title text-center mb-4" style={{ fontFamily: "'Cinzel',  serif", fontSize: "3rem", fontWeight: "700", color: "#FFD369" }}>
                        Book A Table

                    </h2>                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" className="p-2" placeholder="Your Name" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="tel" className="p-2" placeholder="Phone Number" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="email" className="p-2" placeholder="Your Email" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="number" className="p-2" placeholder="How Many Persons" min="1" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="date" className="p-2" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="time" className="p-2" required />
                        </Form.Group>
                        <Button variant="warning" type="submit">Book Now</Button>
                    </Form>
                </Col>
            </Row>


        </Container>
    );
}
