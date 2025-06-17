import React from 'react';
import { Card, Row } from 'react-bootstrap';

const CardLoadingSkelton = () => {
    return (
        <Card style={{ width: '100%', height: '23.5em' }}>
            <Card.Body className="align-items-center">
                <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow h-75 align-items-center g-6">
                    <span className="placeholder col-12 "></span>
                    <span className="placeholder col-12 "></span>

                    <span className="placeholder col-12 h-25 "></span>

                    <span className="placeholder col-12 "></span>

                    <span className="placeholder col-12"></span>
                </p>
                <Row className="h-25">
                    <p className="card-text placeholder-glow  align-items-center g-6">
                        {/* <span className="placeholder col-12 "></span>
                        <span className="placeholder col-12 "></span> */}

                        <span className="placeholder col-12 h-25 "></span>

                        {/* <span className="placeholder col-12 "></span>

                        <span className="placeholder col-12"></span> */}
                    </p>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default CardLoadingSkelton;
