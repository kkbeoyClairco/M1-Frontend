import React from 'react';
import { Card } from 'react-bootstrap';

interface SpaceManagementCardProps {
    occupantCount: number;
    inCount: number;
    outCount: number;
    lastUpdated?: string;
}

const SpaceManagementCard: React.FC<SpaceManagementCardProps> = ({ occupantCount, inCount, outCount, lastUpdated }) => {
    return (
        <Card
            className="bento-card space-management-card shadow-sm rounded-4 p-4"
            style={{
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
                borderRadius: 24,
            }}>
            {/* <div style={{ width: '100%', textAlign: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#4527a0', letterSpacing: 0.2 }}>
                    Space Management
                </span>
            </div> */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div
                    style={{
                        background: '#ede7f6',
                        borderRadius: 12,
                        padding: '10px 24px',
                        marginBottom: 8,
                        boxShadow: '0 2px 8px rgba(69,39,160,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <span style={{ fontWeight: 600, fontSize: '1.05rem', color: '#4527a0', marginBottom: 2 }}>
                        Occupant Count
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '2.2rem', color: '#6a1b9a' }}>{occupantCount}</span>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 16 }}>
                    <div
                        style={{
                            flex: 1,
                            background: '#f3e5f5',
                            borderRadius: 8,
                            padding: '8px 0',
                            textAlign: 'center',
                        }}>
                        <span style={{ fontWeight: 600, color: '#4527a0' }}>In Count</span>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4a148c' }}>{inCount}</div>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            background: '#f3e5f5',
                            borderRadius: 8,
                            padding: '8px 0',
                            textAlign: 'center',
                        }}>
                        <span style={{ fontWeight: 600, color: '#4527a0' }}>Out Count</span>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4a148c' }}>{outCount}</div>
                    </div>
                </div>
                {lastUpdated && (
                    <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#888' }}>Last updated: {lastUpdated}</div>
                )}
            </div>
        </Card>
    );
};

export default SpaceManagementCard;
