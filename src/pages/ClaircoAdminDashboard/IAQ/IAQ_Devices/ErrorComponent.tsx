import React, { useEffect } from 'react';
import { Card, Col } from 'react-bootstrap';
import { Toaster, toast } from 'sonner';

interface ErrorComponentProps {
    isError: boolean;
}
const ErrorComponent: React.FC<ErrorComponentProps> = ({ isError }) => {
    useEffect(function throwToast() {
        toast.error(
            'An error occurred while processing your request. Please refresh the page or try again later.If the issue persists, please contact us. We apologize for the inconvenience.'
        );
    }, []);
    return (
        <Col
            xs={9}
            className="d-flex justify-content-center align-items-center p-3"
            // style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            {' '}
            <Toaster richColors expand={true} />
            <Card className="h-100">
                {' '}
                <Card.Body className="d-flex justify-content-center align-items-center ">
                    {' '}
                    <h5>
                        An error occurred while processing your request. Please refresh the page or try again later. If
                        the issue persists, please contact us. We apologize for the inconvenience..
                    </h5>
                </Card.Body>
            </Card>{' '}
        </Col>
    );
};

export default ErrorComponent;
