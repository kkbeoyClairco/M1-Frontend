import React from 'react';
import { Row } from 'react-bootstrap';

const SimpleLoadingIndicator = () => {
    return (
        <Row className="d-flex justify-content-center align-items-center text-center">
            <h5>Loading...</h5>
        </Row>
    );
};

export default SimpleLoadingIndicator;
