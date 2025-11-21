import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

interface HvacEfficiencyCardProps {
    energySaved: number;
    moneySaved: number;
}

const HvacEfficiencyCard: React.FC<HvacEfficiencyCardProps> = ({ energySaved, moneySaved }) => (
    <Card className="bento-card hvac-efficiency-card shadow-sm rounded-4 p-4 text-center">
        <Card.Body>
            <h5 className="mb-3 d-flex align-items-center justify-content-center gap-2">
                <FontAwesomeIcon icon={faBolt} style={{ color: '#00b894' }} /> HVAC Efficiency
            </h5>
            <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2 justify-content-center">
                    <FontAwesomeIcon icon={faBolt} style={{ color: '#fdcb6e' }} /> <span>Energy Saved:</span>{' '}
                    <b>{energySaved} kWh</b>
                </div>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: '#00b894' }} /> <span>Money Saved:</span>{' '}
                    <b>₹{moneySaved}</b>
                </div>
            </div>
        </Card.Body>
    </Card>
);

export default HvacEfficiencyCard;
