import React from 'react';
import { Col, Row } from 'react-bootstrap';

const NoDevice = ({ name }: { name: string }) => {
    return (
        <Row>
            <Col>
                <h4 className="header-title mb-3 mx-1">No {name} devices installed</h4>
            </Col>
        </Row>
    );
};

export default NoDevice;
