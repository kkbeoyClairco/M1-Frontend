import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface InCountCardProps {
    count: number;
}

const InCountCard: React.FC<InCountCardProps> = ({ count }) => (
    <Card
        className="bento-card incount-card shadow-sm rounded-4 p-4"
        style={{
            background: 'linear-gradient(135deg, #e0f7fa 0%, #43e97b 100%)',
            color: '#222',
            minHeight: 160,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 24,
        }}>
        <Card.Body style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Incount</span>
                <FontAwesomeIcon icon={faArrowDown} size="lg" style={{ color: '#43e97b', opacity: 0.7 }} />
            </div>
            <div
                style={{ marginTop: 'auto', fontWeight: 700, fontSize: '2.1rem', letterSpacing: 1, textAlign: 'left' }}>
                {count}
            </div>
        </Card.Body>
    </Card>
);

export default InCountCard;
