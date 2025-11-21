import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

interface PMCardProps {
    pm10?: number;
    pm25?: number;
    pm10Color?: string;
    pm25Color?: string;
    pm10Severity?: string;
    pm25Severity?: string;
}

const PM10Card: React.FC<PMCardProps> = ({
    pm10,
    pm25,
    pm10Color = '#1b5e20',
    pm25Color = '#7cb342',
    pm10Severity = 'Good',
    pm25Severity = 'Good',
}) => {
    // Normalize for bar height (max 100)
    const maxBar = 100;
    const pm10Height = Math.min((pm10 ?? 0 / maxBar) * 60 + 40, 100); // min 40, max 100
    const pm25Height = Math.min((pm25 ?? 0 / maxBar) * 60 + 40, 100);

    // Dynamic background color based on PM values
    let bg = 'linear-gradient(135deg, #f7fafc 0%, #e0f7fa 100%)'; // default
    const pm10Elevated = typeof pm10 === 'number' && pm10 > 50;
    const pm25Elevated = typeof pm25 === 'number' && pm25 > 25;
    if (pm10Elevated || pm25Elevated) {
        // light red gradient
        bg = 'linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)';
    } else if ((typeof pm10 === 'number' && pm10 > 30) || (typeof pm25 === 'number' && pm25 > 15)) {
        // light orange gradient
        bg = 'linear-gradient(135deg, #fffbe7 0%, #fff7e0 100%)';
    } else if ((typeof pm10 === 'number' && pm10 > 0) || (typeof pm25 === 'number' && pm25 > 0)) {
        // light green gradient
        bg = 'linear-gradient(135deg, #e6f9f0 0%, #d6f5e7 100%)';
    }

    return (
        <Card
            className="bento-card pm10-card shadow-sm rounded-4 p-4"
            style={{ fontFamily: 'Inter, sans-serif', background: bg, borderRadius: 24 }}>
            <Card.Body style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}> */}
                {/* Title at the top */}
                <Row style={{ flex: '0 0 70%', minHeight: 0 }}>
                    <Col xs={8}>
                        {' '}
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                color: '#22223b',
                                marginBottom: 8,
                                textAlign: 'left',
                            }}>
                            Particulate Matter (PM)
                        </div>
                    </Col>
                    {/* Bars: 2 columns, parallel */}
                    <Col xs={4}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                height: '100%',
                            }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    gap: 24,
                                    height: 100,
                                    marginBottom: 8,
                                }}>
                                {/* PM10 bar */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <span style={{ color: '#7b7b7b', fontSize: '0.9rem', fontWeight: 500 }}>{10}</span>
                                    <div
                                        style={{
                                            width: 10,
                                            minHeight: 40,
                                            borderRadius: 8,
                                            background: pm10Color,
                                            opacity: 0.9,
                                            marginBottom: 6,
                                            transition: 'height 0.3s',
                                            height: pm10Height,
                                        }}></div>
                                    <span style={{ color: '#7b7b7b', fontSize: '0.9rem', fontWeight: 500 }}>
                                        {pm10Severity}
                                    </span>
                                </div>
                                {/* PM2.5 bar */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <span style={{ color: '#7b7b7b', fontSize: '0.9rem', fontWeight: 500 }}>{2.5}</span>
                                    <div
                                        style={{
                                            width: 10,
                                            minHeight: 40,
                                            borderRadius: 8,
                                            background: pm25Color,
                                            opacity: 0.9,
                                            marginBottom: 6,
                                            transition: 'height 0.3s',
                                            height: pm25Height,
                                        }}></div>
                                    <span style={{ color: '#7b7b7b', fontSize: '0.9rem', fontWeight: 500 }}>
                                        {pm25Severity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* Key values: 2 columns, below bars */}
                <Row>
                    {' '}
                    <Col xs={12}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 32,
                                margin: '8px 0 0 0',
                            }}>
                            {/* PM10 column */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    flex: 1,
                                }}>
                                <span
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        background: pm10Color,
                                        display: 'inline-block',
                                    }}></span>
                                <span style={{ color: '#7b7b7b', fontWeight: 500, fontSize: '1.05rem' }}>PM10</span>
                                <span style={{ color: '#22223b', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {pm10} µg/m³
                                </span>
                            </div>
                            {/* PM2.5 column */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 8,
                                    flex: 1,
                                }}>
                                <span
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        background: pm25Color,
                                        display: 'inline-block',
                                    }}></span>
                                <span style={{ color: '#7b7b7b', fontWeight: 500, fontSize: '1.05rem' }}>PM2.5</span>
                                <span style={{ color: '#22223b', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {pm25} µg/m³
                                </span>
                            </div>
                        </div>

                        {/* </div> */}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PM10Card;
