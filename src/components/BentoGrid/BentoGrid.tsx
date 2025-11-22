import React from 'react';
import PM10Card from './PM10Card';
import VOCCard from './VOCCard';
import AQICard from './AQICard';
import EnergySavedCard from './EnergySavedCard';
import MoneySavedCard from './MoneySavedCard';
import WashroomSolutionsCard from './WashroomSolutionsCard';
import InCountCard from './InCountCard';
import OutCountCard from './OutCountCard';
import './BentoGrid.scss';

const BentoGrid: React.FC = () => {
    // Demo data, replace with real data as needed
    const airQuality = { pm10: 42, voc: 120, aqi: 85 };
    const hvac = { energySaved: 320, moneySaved: 1500 };
    const washroom = { odourLevel: 2, isOccupied: false, totalEntries: 34 };
    const space = { incount: 70, outcount: 50 };

    return (
        <div className="bento-grid-container" style={{ position: 'relative' }}>
            <div className="bento-center-circle"></div>
            <div className="bento-grid">
                {/* Left column: PM10/PM2.5 tall card, VOC and AQI compact cards below */}
                <div
                    style={{
                        gridColumn: '1 / 2',
                        gridRow: '1 / 3',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'left',
                            letterSpacing: 0.2,
                        }}>
                        Air Quality
                    </div>
                    <div style={{ flex: 2, minHeight: 0 }}>
                        <PM10Card
                            pm10={airQuality.pm10}
                            pm25={500}
                            pm10Color="#1b5e20"
                            pm25Color="#7cb342"
                            pm10Severity="Good"
                            pm25Severity="Good"
                        />
                    </div>
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            marginTop: '1rem',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '1rem',
                        }}>
                        <div className="bento-grid-item bento-voc" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
                            <VOCCard value={airQuality.voc} compact />
                        </div>
                        <div className="bento-grid-item bento-aqi" style={{ flex: 1, minHeight: 0, display: 'flex' }}>
                            <AQICard value={airQuality.aqi} compact />
                        </div>
                    </div>
                </div>
                <div
                    className="bento-grid-item bento-energy-saved"
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '1 / 3',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'left',
                            letterSpacing: 0.2,
                        }}>
                        Energy Savings
                    </div>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <EnergySavedCard energySaved={hvac.energySaved} moneySaved={100} percentChange={200} />
                    </div>
                </div>

                {/* Bottom row: Washroom and SpaceManagement */}
                <div
                    className="bento-grid-item bento-washroom-solutions"
                    style={{ gridColumn: '1 / 2', gridRow: '3 / 4', display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'left',
                            letterSpacing: 0.2,
                        }}>
                        Washroom Solutions
                    </div>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <WashroomSolutionsCard {...washroom} />
                    </div>
                </div>
                <div
                    className="bento-grid-item bento-space-management"
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '3 / 4',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        height: '100%',
                    }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'left',
                            letterSpacing: 0.2,
                        }}>
                        Space Management
                    </div>
                    <div style={{ display: 'flex', flex: 1, gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <InCountCard count={space.incount} />
                        </div>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <OutCountCard count={space.outcount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BentoGrid;
