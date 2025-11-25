import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

interface EnergySavedCardProps {
    moneySaved?: number;
    energySaved?: number;
    percentChange?: number; // percentage monetary savings
    lastUpdated?: string;
}

const EnergySavedCard: React.FC<EnergySavedCardProps> = ({
    moneySaved,
    energySaved,
    percentChange = 12,
    lastUpdated = '',
}) => {
    const [showAlert, setShowAlert] = useState(true);
    const alertIntervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        alertIntervalRef.current = setInterval(() => {
            setShowAlert((prev) => !prev);
        }, 10000);
        return () => {
            if (alertIntervalRef.current) clearInterval(alertIntervalRef.current);
        };
    }, []);
    return (
        <Card
            className="bento-card energy-saved-card split-card shadow-sm rounded-4 p-0 text-center"
            style={{ background: '#fff', borderRadius: '1.5rem' }}>
            <div
                className="split-card-top rounded"
                style={{
                    background: 'linear-gradient(to bottom, #fffefc, #f9e79f)',
                    borderTopLeftRadius: '1.5rem',
                    borderTopRightRadius: '1.5rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2rem 1.5rem 1.2rem 1.5rem',
                }}>
                {/* Center left: Main highlight - percentage monetary savings */}
                {showAlert && (
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #fff5f5 0%, #ffd6d6 100%)',
                            position: 'absolute',
                            top: 80,
                            right: 30,
                            minWidth: 200,
                            maxWidth: 250,
                            minHeight: 100,
                            height: 100,
                            border: '1.5px solid #d0d7de',
                            borderRadius: 12,
                            padding: '8px 16px',
                            // background: '#fff',
                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            perspective: 800,
                            justifyContent: 'center',
                            zIndex: 2,
                        }}>
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: '0.92rem',
                                    marginBottom: 6,
                                    color: '#1a2a3a',
                                }}>
                                Alert
                            </div>
                            <div
                                style={{
                                    fontWeight: 500,
                                    fontSize: '1.02rem',
                                    color: 'black',
                                    lineHeight: 1.3,
                                }}>
                                Warning: Actuator in AHU 5 is not responding.{' '}
                            </div>
                        </div>{' '}
                    </div>
                )}
                <div
                    style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        minWidth: 0,
                    }}>
                    <span
                        style={{
                            fontWeight: 900,
                            fontSize: '2.8rem',
                            color: '#27ae60',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: 1,
                            lineHeight: 1.1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                        <FontAwesomeIcon icon={faBolt} style={{ color: '#fdcb6e', fontSize: '2rem' }} />
                        {percentChange}%
                    </span>
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#22223b',
                            marginTop: 2,
                            letterSpacing: 0.5,
                        }}>
                        Reduction in Electricity Bills
                    </span>
                    <span
                        style={{
                            fontWeight: 500,
                            fontSize: '1rem',
                            // color: '#888',
                            color: 'black',
                            marginTop: 2,
                        }}>
                        with Clairco’s HVAC Efficiency
                    </span>
                    <span
                        style={{
                            fontWeight: 500,
                            fontSize: '0.98rem',
                            color: 'black',
                            fontFamily: 'Inter, sans-serif',
                            marginTop: 2,
                            letterSpacing: 0.5,
                            whiteSpace: 'nowrap',
                        }}>
                        Energy Saved: {energySaved} kWh
                        <div
                            style={{
                                fontWeight: 400,
                                fontSize: '0.92rem',
                                color: '#888',
                                marginTop: 10,
                            }}>
                            Last updated: {lastUpdated ?? ''}
                        </div>
                    </span>
                </div>{' '}
                {/* Right: Monetary savings value moved to lower right */}
                <div style={{ flex: 1, position: 'relative', minWidth: 0, height: '100%' }}>
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            minWidth: 210,
                            maxWidth: 270,
                            background: 'rgba(255,255,255,0.92)',
                            borderRadius: 14,
                            boxShadow: '0 2px 12px 0 rgba(39, 174, 96, 0.10)',
                            padding: '1.1rem 1.3rem 1.1rem 1.3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            zIndex: 2,
                        }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                                style={{
                                    fontWeight: 800,
                                    fontSize: '2rem',
                                    color: '#22223b',
                                    fontFamily: 'Inter, sans-serif',
                                    letterSpacing: 0.5,
                                }}>
                                ₹{moneySaved?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                            </span>
                        </span>
                        <span
                            style={{
                                fontWeight: 600,
                                fontSize: '1.02rem',
                                color: 'black',
                                fontFamily: 'Inter, sans-serif',
                                marginTop: 2,
                                letterSpacing: 0.5,
                            }}>
                            Saved in November
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default EnergySavedCard;
