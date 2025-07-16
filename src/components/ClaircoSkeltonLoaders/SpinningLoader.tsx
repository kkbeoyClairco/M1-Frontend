import React from 'react';
import { Row } from 'react-bootstrap';

const spinnerStyle: React.CSSProperties = {
    width: '2.5rem',
    height: '2.5rem',
    border: '0.4rem solid #e0e0e0',
    borderTop: '0.4rem solid #008675',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
};

const SpinningLoader = () => (
    <Row
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{ minHeight: '120px' }}>
        <div style={spinnerStyle} />
        <h6 style={{ marginTop: '1rem', color: '#008675', fontWeight: 500 }}>Loading...</h6>
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
            `}
        </style>
    </Row>
);

export default React.memo(SpinningLoader);
