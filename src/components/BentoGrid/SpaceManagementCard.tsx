import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

interface SpaceManagementCardProps {
    totalOccupants: number;
}

const SpaceManagementCard: React.FC<SpaceManagementCardProps> = ({ totalOccupants }) => (
    <Card className="bento-card space-management-card shadow-sm rounded-4 p-4 text-center">
        <Card.Body>
            <h5 className="mb-3 d-flex align-items-center justify-content-center gap-2">
                <FontAwesomeIcon icon={faUsers} style={{ color: '#00b894' }} /> Space Management
            </h5>
            <div className="d-flex align-items-center gap-2 justify-content-center">
                <FontAwesomeIcon icon={faUsers} style={{ color: '#0984e3' }} /> <span>Total Occupants:</span>{' '}
                <b>{totalOccupants}</b>
            </div>
        </Card.Body>
    </Card>
);

export default SpaceManagementCard;
