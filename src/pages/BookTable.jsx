import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BookTableSection } from "../components/BookTableSection";
import { MapComponent } from "../components/MapComponent";

export function BookTable() {
    return (
        <div style={{ backgroundColor: "#181818", color: "#EEEEEE", minHeight: "100vh", paddingBottom: "50px" }}>
            <Container className="py-5 mt-5">
                <Row>
                    <div className="bookTable col-lg-12 d-flex justify-content-center align-items-center">
                        <Col md={8} className="mb-4 col-lg-6 ">
                            <BookTableSection />
                        </Col>

                        <Col md={4} className="col-lg-6">
                            <MapComponent />
                        </Col>
                    </div>
                </Row>
            </Container>
        </div>
    );
}
