import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface OutCountCardProps {
    count: number;
}

const OutCountCard: React.FC<OutCountCardProps> = ({ count }) => (
    <Card
        className="bento-card outcount-card shadow-sm rounded-4 p-4"
        style={{
            background: 'linear-gradient(135deg, #ffeaea 0%, #ff5858 100%)',
            color: '#222',
            minHeight: 160,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 24,
        }}>
        <Card.Body style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Outcount</span>
                <FontAwesomeIcon icon={faArrowUp} size="lg" style={{ color: '#ff5858', opacity: 0.7 }} />
            </div>
            <div
                style={{ marginTop: 'auto', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1, textAlign: 'left' }}>
                {count}
            </div>
        </Card.Body>
    </Card>
);

export default OutCountCard;
