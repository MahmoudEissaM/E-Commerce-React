import React from "react";
import { Container } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="dark-footer bg-dark text-light text-center py-4 mt-5" >
            <Container>
                <div className="footer-links">
                    <a href="#" className="text-light mx-3">Privacy Policy</a> |
                    <a href="#" className="text-light mx-3">Terms of Service</a> |
                    <a href="#" className="text-light mx-3">Contact Us</a>
                </div>

                <div className="yellow-divider"></div>

                <div className="social-icons mt-3">
                    <a href="#" className="social-link"><FaFacebook /></a>
                    <a href="#" className="social-link"><FaTwitter /></a>
                    <a href="#" className="social-link"><FaInstagram /></a>
                    <a href="#" className="social-link"><FaLinkedin /></a>
                </div>

                <p className="mt-3 mb-0">&copy; 2025 My Store. All Rights Reserved.</p>
            </Container>
        </footer>
    );
}
