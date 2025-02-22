import React from 'react';
import { Container, Nav, Navbar, Offcanvas, Button, Form, Badge, Dropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUtensils, FaShoppingCart, FaUserCircle } from "react-icons/fa";

export function Header({ cartCount }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="shadow-lg" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
            <Container>
                <Navbar.Brand className="text-white fs-3 fw-bold d-flex align-items-center" href="/">
                    <FaUtensils className="me-2 text-warning" /> Restoran
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                    className="bg-dark"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel" className="text-warning">
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="mx-auto">
                            <NavLink className={({ isActive }) => isActive ? "text-warning nav-link fw-bold border-bottom border-warning mx-3" : "text-white nav-link mx-3"} to="/">Home</NavLink>
                            <NavLink className={({ isActive }) => isActive ? "text-warning nav-link fw-bold border-bottom border-warning mx-3" : "text-white nav-link mx-3"} to="/menu">Menu</NavLink>
                            <NavLink className={({ isActive }) => isActive ? "text-warning nav-link fw-bold border-bottom border-warning mx-3" : "text-white nav-link mx-3"} to="/about">About</NavLink>
                            <NavLink className={({ isActive }) => isActive ? "text-warning nav-link fw-bold border-bottom border-warning mx-3" : "text-white nav-link mx-3"} to="/book-table">Book Table</NavLink>
                            {user && user.role === "admin" && (
                                <NavLink className={({ isActive }) => isActive ? "text-warning nav-link fw-bold border-bottom border-warning mx-3" : "text-white nav-link mx-3"} to="/products">Dashboard </NavLink>
                            )}
                        </Nav>

                        <div className="d-flex align-items-center">
                            <Form className="d-flex me-3">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <Button variant="outline-warning">Search</Button>
                            </Form>

                            <NavLink to="/cart" className="nav-link position-relative me-3">
                                <FaShoppingCart className="text-white fs-4" />
                                {cartCount > 0 && (
                                    <Badge pill bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle">
                                        {cartCount}
                                    </Badge>
                                )}
                            </NavLink>

                            {user ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" id="dropdown-basic" className="d-flex align-items-center">
                                        <FaUserCircle className="me-2" /> {user.name} {user.role === "admin" && "(Admin)"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <>
                                    <Button variant="outline-warning" className="me-2" onClick={() => navigate('/login')}>Login</Button>
                                    <Button variant="warning" onClick={() => navigate('/register')}>Register</Button>
                                </>
                            )}
                        </div>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}
