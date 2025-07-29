import React from 'react';
import { Card } from 'react-bootstrap';

const OfflineWidget = () => {
    return (
        <Card className="" style={{ height: '28em' }}>
            <Card.Body className="d-flex justify-content-center align-items-center">
                <h6>Start streaming to view camera feeds here.</h6>
            </Card.Body>
        </Card>
    );
};

export default React.memo(OfflineWidget);
