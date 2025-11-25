import React from 'react';
import { Card } from 'react-bootstrap';

interface WashroomSolutionsCardProps {
    odourLevel: number;
    isOccupied: boolean;
    totalEntries: number;
    lastUpdated?: string;
}

const WashroomSolutionsCard: React.FC<WashroomSolutionsCardProps> = ({
    odourLevel,
    isOccupied,
    totalEntries,
    lastUpdated,
}) => {
    return (
        <Card
            className="bento-card washroom-solutions-card shadow-sm rounded-4 p-4"
            style={{
                minHeight: 100,
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#e0f7fa',
                        border: '1px solid #4dd0e1',
                        color: '#00838f',
                        fontWeight: 600,
                        fontSize: '0.98rem',
                        borderRadius: 16,
                        padding: '4px 16px',
                        marginTop: 10,
                        boxShadow: '0 1px 4px rgba(0,183,195,0.07)',
                        width: 'fit-content',
                        minWidth: 90,
                    }}>
                    <svg width="16" height="16" fill="#00bcd4" style={{ marginRight: 4 }} viewBox="0 0 16 16">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.6A5.6 5.6 0 1 1 8 2.4a5.6 5.6 0 0 1 0 11.2zM7.25 5.75a.75.75 0 1 1 1.5 0v3.5a.75.75 0 1 1-1.5 0v-3.5zm.75 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
                    </svg>
                    Alerts None
                </div>
                {/* Additional parameters grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '6px 12px',
                        marginTop: 10,
                        fontSize: '0.98rem',
                        color: '#333',
                        width: '100%',
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#e3f2fd',
                            borderRadius: 7,
                            padding: '4px 10px',
                        }}>
                        <span style={{ fontWeight: 600 }}>People Count</span>
                        <span style={{ fontWeight: 700, color: '#1976d2' }}>120</span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#e3f2fd',
                            borderRadius: 7,
                            padding: '4px 10px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Feedbacks</span>
                        <span style={{ fontWeight: 700, color: '#1976d2' }}>90 % Great</span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#e3f2fd',
                            borderRadius: 7,
                            padding: '4px 10px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Tissue </span>
                        <span style={{ fontWeight: 700, color: '#1976d2' }}>40% remaining </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#e3f2fd',
                            borderRadius: 7,
                            padding: '4px 10px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Dustbin </span>
                        <span style={{ fontWeight: 700, color: '#1976d2' }}>60% full</span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#e3f2fd',
                            borderRadius: 7,
                            padding: '4px 10px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Wetness noticed</span>
                        <span style={{ fontWeight: 700, color: '#1976d2' }}>none</span>
                    </div>
                    {/* <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#e3f2fd',
                            borderRadius: 7,
                            padding: '4px 10px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Feedback</span>
                        <span style={{ fontWeight: 700, color: '#1976d2' }}>Great</span>
                    </div> */}
                </div>{' '}
                <div
                    style={{
                        fontWeight: 400,
                        fontSize: '0.92rem',
                        color: '#888',
                        marginTop: 10,
                        justifyContent: 'center',
                        display: 'flex',
                    }}>
                    Last updated: {lastUpdated ?? ''}
                </div>
            </Card.Body>
        </Card>
    );
};

export default WashroomSolutionsCard;
