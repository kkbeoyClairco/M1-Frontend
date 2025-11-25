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
            className="bento-card washroom-solutions-card shadow-sm rounded-4"
            style={{
                minHeight: 70,
                // height: 300,
                display: 'flex',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
                borderRadius: 20,
                padding: '2px 10px 8px 10px', // less top padding
            }}>
            <Card.Body
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: '100%',
                    padding: '0 2px',
                    fontSize: '1.05rem', // match other cards
                }}>
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#d4edda',
                        color: '#256029',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        borderRadius: 12,
                        padding: '2px 14px',
                        marginTop: 2,
                        width: 'fit-content',
                        minWidth: 50,
                    }}>
                    Alerts None
                </div>
                {/* Additional parameters grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '3px 6px',
                        marginTop: 4,
                        fontSize: '1.05rem',
                        color: '#333',
                        width: '100%',
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // background: '#e3f2fd',
                            borderRadius: 5,
                            padding: '2px 6px',
                        }}>
                        <span style={{ fontWeight: 600 }}>People Count</span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'black',
                                fontSize: '1.12em',
                                //  background: '#e3f2fd'
                            }}>
                            120
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // background: '#e3f2fd',
                            borderRadius: 5,
                            padding: '2px 6px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Leakage Detected</span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'black',
                                fontSize: '1.12em',
                                //  background: '#e3f2fd'
                            }}>
                            none
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // background: '#e3f2fd',
                            borderRadius: 5,
                            padding: '2px 6px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Tissue </span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'black',
                                fontSize: '1.12em',
                                //  background: '#e3f2fd'
                            }}>
                            {' '}
                            25% remaining{' '}
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // background: '#e3f2fd',
                            borderRadius: 5,
                            padding: '2px 6px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Dustbin </span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'black',
                                fontSize: '1.12em',
                                //  background: '#e3f2fd'
                            }}>
                            {' '}
                            60% full
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            // background: '#e3f2fd',
                            borderRadius: 5,
                            padding: '2px 6px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Odour </span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'black',
                                fontSize: '1.12em',
                                //  background: '#e3f2fd'
                            }}>
                            {' '}
                            Moderate
                        </span>
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
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '3px 6px',
                        marginTop: 4,
                        fontSize: '1.05rem',
                        color: '#333',
                        width: '100%',
                    }}>
                    {' '}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                            borderRadius: 5,
                            padding: '2px 6px',
                        }}>
                        <span style={{ fontWeight: 600 }}>Feedbacks</span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: 'black',
                                fontSize: '1.12em',
                                //  background: '#e3f2fd'
                            }}>
                            {' '}
                            90.34% Positive Sentiments
                        </span>
                    </div>
                    <div
                        style={{
                            fontWeight: 400,
                            fontSize: '0.95rem',
                            color: '#888',
                            marginTop: 10,
                            justifyContent: 'center',
                            display: 'flex',
                        }}>
                        Last updated: {lastUpdated ?? ''}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default WashroomSolutionsCard;
