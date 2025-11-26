import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import {
    getAQILabels,
    getIAQColor,
    getPM10Color,
    getPM10Label,
    getPM25Color,
    getPM25Label,
    getPMBgGradient,
    getVocColor,
    getVoCLabel,
} from 'utils/AQI/colorUtils';

interface PMCardProps {
    pm10?: number;
    pm25?: number;
    oPm10?: number;
    oPm25?: number;
    aqi?: number;
    voc?: number;
    lastUpdated?: string;
}

const PM10Card2: React.FC<PMCardProps> = ({ pm10, pm25, oPm10, oPm25, aqi, voc, lastUpdated }) => {
    // Normalize for bar height (max 100)
    const pm10MaxBar = 425;
    const pm25MaxBar = 250;
    const aqiMax = 305;
    const vocMax = 305;
    // Card background (static or dynamic, update as needed)
    const bg = getPMBgGradient(pm10 ?? 0, pm25 ?? 0);
    // Bar colors
    const pm10Color = getPM10Color(pm10 ?? 0);
    const pm25Color = getPM25Color(pm25 ?? 0);
    const pm10Severity = getPM10Label(pm10 ?? 0);
    const pm25Severity = getPM25Label(pm25 ?? 0);
    // Outdoor values and severity
    const oPm10Value = oPm10 ?? 0;
    const oPm25Value = oPm25 ?? 0;
    const oPm10Color = getPM10Color(oPm10Value);
    const oPm25Color = getPM25Color(oPm25Value);
    const oPm10Severity = getPM10Label(oPm10Value);
    const oPm25Severity = getPM25Label(oPm25Value);
    const aqiSeverity = getAQILabels(aqi ?? 0);
    const vocSeverity = getVoCLabel(voc ?? 0);
    const aqiColor = getIAQColor(aqi ?? 0);
    const vocColor = getVocColor(voc ?? 0);
    // const aqiLabel =
    // const vocLabel =

    // Flip state for outdoor section
    const [outdoorFlipped, setOutdoorFlipped] = useState(false);
    const outdoorFlipRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        outdoorFlipRef.current = setInterval(() => {
            setOutdoorFlipped((prev) => !prev);
        }, 5000);
        return () => {
            if (outdoorFlipRef.current) clearInterval(outdoorFlipRef.current);
        };
    }, []);
    const pm10Width = Math.max(0, Math.min(((pm10 ?? 0) / pm10MaxBar) * 100, 100));
    const pm25Width = Math.max(0, Math.min(((pm25 ?? 0) / pm25MaxBar) * 100, 100));
    return (
        <Card
            className="bento-card pm10-card shadow-sm rounded-4 p-2"
            style={{ fontFamily: 'Inter, sans-serif', background: bg, borderRadius: 16, minHeight: 0 }}>
            <Card.Body
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '6px 0 6px 0',
                    minHeight: 0,
                }}>
                {/* Top: PM label */}

                {/* Main content: Outdoor box on right */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        // flex: 1,
                        alignItems: 'flex-start',
                        marginTop: 0,
                        minHeight: 0,
                        gap: 0,
                    }}>
                    {/* Left side: empty for visual balance */}
                    <div style={{ flex: 1 }}>
                        {' '}
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: '1.05rem',
                                color: '#22223b',
                                margin: '2px 0 0 10px',
                                textAlign: 'left',
                                letterSpacing: 0.2,
                            }}>
                            Particulate Matter
                        </div>
                        <div
                            style={{
                                fontWeight: 400,
                                fontSize: '0.92rem',
                                color: '#888',
                                marginTop: 10,
                            }}>
                            Last updated: {lastUpdated ?? ''}
                        </div>
                    </div>
                    {/* Right side: Outdoor box with flip effect */}
                    <div
                        style={{
                            minWidth: 210,
                            maxWidth: 260,
                            minHeight: 120, // Ensures the box doesn't shrink
                            height: 120, // Fixed height for consistent flip
                            border: '1.5px solid #d0d7de',
                            borderRadius: 12,
                            padding: '8px 16px',
                            background: !outdoorFlipped ? '#fff' : 'linear-gradient(135deg, #fff5f5 0%, #ffd6d6 100%)',
                            marginRight: 10,
                            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            perspective: 800,
                            justifyContent: 'center',
                        }}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                transition: 'transform 0.7s cubic-bezier(.4,2,.6,1)',
                                transformStyle: 'preserve-3d',
                                transform: outdoorFlipped ? 'rotateY(180deg)' : 'none',
                            }}>
                            {/* Front Side (Outdoor Data) */}
                            <div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    zIndex: 2,
                                }}>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: '0.92rem',
                                        marginBottom: 6,
                                        color: '#1a2a3a',
                                        letterSpacing: 0.1,
                                    }}>
                                    Outdoor
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                                    <span style={{ fontWeight: 500, fontSize: '0.98rem', color: '#444', minWidth: 54 }}>
                                        PM 10
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '1.08rem',
                                            color: oPm10Color,
                                            marginLeft: 8,
                                        }}>
                                        {oPm10Value}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: 2, color: '#888' }}>
                                        µg/m³
                                    </span>
                                    <span
                                        style={{
                                            marginLeft: 10,
                                            fontSize: '0.92rem',
                                            color: '#666',
                                            fontWeight: 500,
                                            background: '#f6f6f6',
                                            borderRadius: 6,
                                            padding: '2px 8px',
                                        }}>
                                        {oPm10Severity}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        height: 5,
                                        background: '#f2f2f2',
                                        borderRadius: 2,
                                        marginBottom: 5,
                                    }}>
                                    <div
                                        style={{
                                            width: `${Math.max(0, Math.min((oPm10Value / pm10MaxBar) * 100, 100))}%`,
                                            height: '100%',
                                            background: oPm10Color,
                                            borderRadius: 4,
                                            transition: 'width 0.3s',
                                        }}
                                    />
                                </div>
                                {/* Outdoor PM2.5 */}
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                                    <span style={{ fontWeight: 500, fontSize: '0.98rem', color: '#444', minWidth: 54 }}>
                                        PM 2.5
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '1.08rem',
                                            color: oPm25Color,
                                            marginLeft: 8,
                                        }}>
                                        {oPm25Value}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: 2, color: '#888' }}>
                                        µg/m³
                                    </span>
                                    <span
                                        style={{
                                            marginLeft: 10,
                                            fontSize: '0.92rem',
                                            color: '#666',
                                            fontWeight: 500,
                                            background: '#f6f6f6',
                                            borderRadius: 6,
                                            padding: '2px 8px',
                                        }}>
                                        {oPm25Severity}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        height: 5,
                                        background: '#f2f2f2',
                                        borderRadius: 2,
                                        marginBottom: 2,
                                    }}>
                                    <div
                                        style={{
                                            width: `${Math.max(0, Math.min((oPm25Value / pm25MaxBar) * 100, 100))}%`,
                                            height: '100%',
                                            background: oPm25Color,
                                            borderRadius: 4,
                                            transition: 'width 0.3s',
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Back Side (Dummy Content) */}
                            <div
                                className="p-2"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    background: 'linear-gradient(135deg, #fff5f5 0%, #ffd6d6 100%)',
                                    borderRadius: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transform: 'rotateY(180deg)',
                                    zIndex: 1,
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
                                        Warning: Unhealthy air quality detected on the 14th floor.{' '}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Divider */}
                <div style={{ width: '100%', height: 1, background: '#e6e6e6', margin: '8px 0 0 0' }} />
                {/*  */}
                {/* Indoor (Solution) Section */}
                <div
                    style={{
                        marginTop: 0,
                        padding: '6px 10px 6px 10px',
                        width: '100%',
                        // background: 'linear-gradient(90deg, #e8f5e9 0%, #f3fafd 100%)',
                        borderRadius: 8,
                        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)',
                        border: '1px solid #e0f2f1',
                        position: 'relative',
                        flex: '0 0 auto',
                        minHeight: 120,
                    }}>
                    {/* <div
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 18,
                            fontSize: '0.92rem',
                            color: '#4caf50',
                            fontWeight: 600,
                            letterSpacing: 0.2,
                        }}>
                        Solution
                    </div> */}
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.08rem',
                            color: '#1a2a3a',
                            marginBottom: 8,
                            letterSpacing: 0.1,
                        }}>
                        Indoor
                    </div>
                    {/* <div style={{ fontSize: '0.95rem', color: '#388e3c', marginBottom: 10, fontWeight: 500 }}>
                        Your indoor air quality after Clairco’s solution
                    </div> */}
                    {/* PM10 */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                            fontWeight: 500,
                            fontSize: '0.92rem',
                            color: 'black',
                            marginBottom: 1,
                        }}>
                        <span style={{ minWidth: 32 }}>PM 10</span>
                        <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'black' }}>
                            {pm10}{' '}
                            <span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: 2, color: 'black' }}>
                                µg/m³
                            </span>{' '}
                        </span>

                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: '1.02',
                                color: 'black',
                                fontWeight: 700,
                                background: '#f6f6f6',
                                borderRadius: 6,
                                padding: '2px 8px',
                            }}>
                            {pm10Severity}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: '#e0f2f1', borderRadius: 3, marginBottom: 5 }}>
                        <div
                            style={{
                                width: `${Math.max(0, Math.min(((pm10 ?? 0) / pm10MaxBar) * 100, 100))}%`,
                                height: '100%',
                                background: pm10Color,
                                borderRadius: 3,
                                transition: 'width 0.3s',
                                boxShadow: '0 0 2px 0 #b2dfdb',
                            }}
                        />
                    </div>
                    {/* PM 25 */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',

                            gap: 10,
                            fontWeight: 500,
                            fontSize: '0.92rem',
                            color: 'black',
                            marginBottom: 1,
                        }}>
                        <span style={{ minWidth: 32 }}>PM 2.5</span>
                        <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'black' }}>
                            {pm25}{' '}
                            <span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: 2, color: 'black' }}>
                                µg/m³
                            </span>
                        </span>

                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: '1.02',
                                color: 'black',
                                fontWeight: 700,
                                background: '#f6f6f6',
                                borderRadius: 6,
                                padding: '2px 8px',
                            }}>
                            {pm25Severity}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: '#e0f2f1', borderRadius: 3 }}>
                        <div
                            style={{
                                width: `${Math.max(0, Math.min(((pm25 ?? 0) / pm25MaxBar) * 100, 100))}%`,
                                height: '100%',
                                background: pm25Color,
                                borderRadius: 3,
                                transition: 'width 0.3s',
                                boxShadow: '0 0 2px 0 #b2dfdb',
                            }}
                        />
                    </div>
                    {/* AQI */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',

                            gap: 10,
                            fontWeight: 500,
                            fontSize: '0.92rem',
                            color: 'black',
                            marginBottom: 1,
                        }}>
                        <span style={{ minWidth: 32 }}>AQI</span>
                        <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'black' }}>
                            {aqi}{' '}
                            <span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: 2, color: 'black' }}>
                                AQI
                            </span>
                        </span>
                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: '1.02',
                                color: 'black',
                                fontWeight: 700,
                                background: '#f6f6f6',
                                borderRadius: 6,
                                padding: '2px 8px',
                            }}>
                            {aqiSeverity}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: '#e0f2f1', borderRadius: 3 }}>
                        <div
                            style={{
                                width: `${Math.max(0, Math.min(((aqi ?? 0) / aqiMax) * 100, 100))}%`,
                                height: '100%',
                                background: aqiColor,
                                borderRadius: 3,
                                transition: 'width 0.3s',
                                boxShadow: '0 0 2px 0 #b2dfdb',
                            }}
                        />
                    </div>
                    {/* VOC */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',

                            gap: 10,
                            fontWeight: 500,
                            fontSize: '0.92rem',
                            color: 'black',
                            marginBottom: 1,
                        }}>
                        <span style={{ minWidth: 32 }}>VOC</span>
                        <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'black' }}>
                            {voc}{' '}
                            <span style={{ fontSize: '0.7rem', fontWeight: 400, marginLeft: 2, color: 'black' }}>
                                ppm
                            </span>
                        </span>
                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: '1.02',
                                color: 'black',
                                fontWeight: 700,
                                background: '#f6f6f6',
                                borderRadius: 6,
                                padding: '2px 8px',
                            }}>
                            {vocSeverity}
                        </span>
                    </div>
                    <div style={{ width: '100%', height: 5, background: '#e0f2f1', borderRadius: 3 }}>
                        <div
                            style={{
                                width: `${Math.max(0, Math.min(((voc ?? 0) / vocMax) * 100, 100))}%`,
                                height: '100%',
                                background: vocColor,
                                borderRadius: 3,
                                transition: 'width 0.3s',
                                boxShadow: '0 0 2px 0 #b2dfdb',
                            }}
                        />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PM10Card2;
