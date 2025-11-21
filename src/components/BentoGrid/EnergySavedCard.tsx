import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

interface EnergySavedCardProps {
    moneySaved?: number;
    energySaved?: number;
    percentChange?: number;
}

const EnergySavedCard: React.FC<EnergySavedCardProps> = ({ moneySaved, energySaved, percentChange = 12 }) => (
    <Card
        className="bento-card energy-saved-card split-card shadow-sm rounded-4 p-0 text-center"
        style={{ background: '#fff', borderRadius: '1.5rem' }} // ensure solid background
    >
        {' '}
        <div
            className="split-card-top rounded"
            style={{
                // background: '#C6F6D5',
                background: 'linear-gradient(to bottom, #fffefc, #f9e79f)',
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
                height: '65%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem 1.5rem 1.2rem 1.5rem',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                    style={{
                        fontWeight: 600,
                        letterSpacing: 2,
                        color: '#4A5568',
                        fontSize: '1.1rem',
                        fontFamily: 'Inter, sans-serif',
                    }}>
                    {/* Energy Savings */}
                </span>
                {/* <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: '#38B2AC', fontSize: '2rem' }} /> */}
            </div>
            <div style={{ textAlign: 'left', marginTop: '1.2rem' }}>
                <div style={{ color: '#718096', fontWeight: 500, fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>
                    Savings
                </div>
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: '2.5rem',
                        color: '#22223b',
                        fontFamily: 'Inter, sans-serif',
                        margin: '0.2rem 0 0.5rem 0',
                    }}>
                    ₹{moneySaved?.toLocaleString(undefined, { minimumFractionDigits: 3 })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* <span
                        style={{
                            background: '#E6FFFA',
                            color: '#38B2AC',
                            borderRadius: '1rem',
                            padding: '0.2rem 0.8rem',
                            fontWeight: 600,
                            fontSize: '1rem',
                            fontFamily: 'Inter, sans-serif',
                        }}>
                        ↑ +{percentChange}%
                    </span> */}
                </div>
            </div>
        </div>
        <div
            className="split-card-bottom"
            style={{
                background: '#fff',
                borderBottomLeftRadius: '1.5rem',
                borderBottomRightRadius: '1.5rem',
                height: '30%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                padding: '1.2rem 1.5rem',
            }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 4,
                    whiteSpace: 'nowrap',
                }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FontAwesomeIcon icon={faBolt} style={{ color: '#fdcb6e', fontSize: '1.1rem' }} />
                    <span
                        style={{
                            color: 'black',
                            fontWeight: 500,
                            fontSize: '1.1rem',
                            fontFamily: 'Inter, sans-serif',
                        }}>
                        Energy Saved
                    </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#22223b',
                            fontFamily: 'Inter, sans-serif',
                        }}>
                        {energySaved}
                    </span>
                    <span
                        style={{
                            color: '#718096',
                            fontWeight: 500,
                            fontSize: '1rem',
                            fontFamily: 'Inter, sans-serif',
                        }}>
                        kWh
                    </span>
                </span>
            </div>
            <div style={{ color: '#A0AEC0', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                November
            </div>
        </div>
    </Card>
);

export default EnergySavedCard;
