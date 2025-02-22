import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export function AboutSection() {
    return (
        <div className="about-page">
            <Container fluid className="about-section" style={{ paddingTop: "50px" }}>
                <Row className="d-flex align-items-center justify-content-center text-center text-md-start">
                    <Col md={6} className="about-image">
                        <img
                            src="https://themewagon.github.io/feane/images/about-img.png"
                            alt="Burger"
                            className="img-fluid rounded"
                            style={{ maxWidth: "80%", margin: "0 auto" }}
                        />
                    </Col>

                    <Col md={6} className="about-text" style={{ marginTop: "20px" }}>
                        <h2 className="menu-title mb-4" style={{ fontFamily: "'Cinzel', serif", fontSize: "3rem", fontWeight: "700", color: "#FFD369" }}>
                            We Are Feane
                        </h2>
                        <p className="text-light">
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                        </p>
                        <p className="text-light">
                            If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All
                        </p>
                        <Link to="/about" className="btn btn-warning">Read More</Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
