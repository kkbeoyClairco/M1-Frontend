import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

interface MoneySavedCardProps {
    value: number;
}

const MoneySavedCard: React.FC<MoneySavedCardProps> = ({ value }) => (
    <Card className="bento-card money-saved-card shadow-sm rounded-4 p-4 text-center">
        <Card.Body>
            <div className="mb-2">
                <FontAwesomeIcon icon={faMoneyBillWave} size="2x" style={{ color: '#00b894' }} />
            </div>
            <h6 className="mb-2 text-muted">Money Saved</h6>
            <h3 className="mb-1" style={{ color: '#00b894', fontWeight: 'bold' }}>
                ₹{value}
            </h3>
            <small className="text-muted">This Month</small>
            <div className="mt-2">
                <small className="text-success">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="me-1" />
                    +12% from last month
                </small>
            </div>
        </Card.Body>
    </Card>
);

export default MoneySavedCard;
