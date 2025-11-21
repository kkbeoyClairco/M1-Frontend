import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToilet, faSmile, faUserCheck } from '@fortawesome/free-solid-svg-icons';

interface WashroomSolutionsCardProps {
    odourLevel: number;
    isOccupied: boolean;
    totalEntries: number;
}

const WashroomSolutionsCard: React.FC<WashroomSolutionsCardProps> = ({ odourLevel, isOccupied, totalEntries }) => {
    // For demo: assume 3 cubicles, 1 occupied if isOccupied true
    const totalCubicles = 3;
    const vacant = isOccupied ? totalCubicles - 1 : totalCubicles;
    // Odour status
    let odourStatus = 'Low';
    let odourColor = '#48ca9b';
    if (odourLevel > 2) {
        odourStatus = 'Moderate';
        odourColor = '#fdcb6e';
    }
    if (odourLevel > 4) {
        odourStatus = 'High';
        odourColor = '#ff7675';
    }
    return (
        <Card
            className="bento-card washroom-solutions-card shadow-sm rounded-4 p-4"
            style={{
                minHeight: 140,
                display: 'flex',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
                borderRadius: 24,
            }}>
            <Card.Body
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    padding: 0,
                }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                    {/* Vacant cubicles */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222', marginBottom: 4 }}>
                            Vacant
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FontAwesomeIcon icon={faUserCheck} style={{ color: '#00b894', fontSize: 22 }} />
                            <span style={{ fontWeight: 700, fontSize: '2rem', color: '#00b894' }}>{vacant}</span>
                            <span style={{ color: '#888', fontWeight: 500, fontSize: '1rem' }}>of {totalCubicles}</span>
                        </div>
                    </div>
                    {/* Odour status */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222', marginBottom: 4 }}>
                            Odour
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FontAwesomeIcon icon={faSmile} style={{ color: odourColor, fontSize: 22 }} />
                            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: odourColor }}>
                                {odourStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default WashroomSolutionsCard;
