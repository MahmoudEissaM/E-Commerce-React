import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BookTableSection } from "../components/BookTableSection";
import { MapComponent } from "../components/MapComponent";

export function BookTable() {
    return (
        <div style={{ backgroundColor: "#181818", color: "#EEEEEE", minHeight: "100vh", paddingBottom: "50px" }}>
            <Container className="py-5">
                <Row className="align-items-center">
                    <Col md={8} className="mb-4">
                        <BookTableSection />
                    </Col>

                    <Col md={4}>
                        <MapComponent />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
