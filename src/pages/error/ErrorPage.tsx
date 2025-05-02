import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

interface ErrorPageProps {
    error?: { message: string };
    resetErrorBoundary: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
    console.log('Erroe:', error);
    return (
        <Container className="text-center vh-100 d-flex justify-content-center align-items-center">
            <Row className="justify-content-center align-items-center">
                <Col md={8}>
                    <img
                        className="shadow-lg rounded-lg"
                        src="https://res.cloudinary.com/dlulq6hny/image/upload/v1737020598/Untitled-design-17_anhxuz.png"
                        alt="logo"
                        width={150}
                        height={150}
                    />
                    <h1 className="display-4 text-black">Oops! Something Went Wrong</h1>
                    <p className="lead text-muted">
                        We're sorry, but an unexpected error has occurred. Please try refreshing the page or go back to
                        the home page.
                    </p>
                    {/* {error && (
                        <div className="alert alert-danger">
                            <strong>Error Details:</strong> {error.message}
                        </div>
                    )} */}
                    <Button onClick={resetErrorBoundary} className="primary mt-3">
                        Refresh Page
                    </Button>
                    <Button variant="secondary" href="/" className="mt-3 mx-2">
                        Go to Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ErrorPage;
