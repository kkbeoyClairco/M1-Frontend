import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import {
    getPM10Color,
    getPM10Label,
    // getPM10Labels,
    getPM25Color,
    getPM25Label,
    getPMBgGradient,
    // getPM25Labels,
} from 'utils/AQI/colorUtils';

interface PMCardProps {
    pm10?: number;
    pm25?: number;
    oPm10?: number;
    oPm25?: number;
}

const PM10Card: React.FC<PMCardProps> = ({ pm10, pm25, oPm10, oPm25 }) => {
    // Normalize for bar height (max 100)
    const pm10MaxBar = 425;
    const pm25MaxBar = 250;
    const pm10Color = getPM10Color(pm10 ?? 0);
    const pm25Color = getPM25Color(pm25 ?? 0);
    const pm10Severity = getPM10Label(pm10 ?? 2000);
    const pm25Severity = getPM25Label(pm25 ?? 2000);
    const oPm10Severity = getPM10Label(oPm10 ?? 2000);
    const oPm25Severity = getPM25Label(oPm25 ?? 2000);

    // Normalize between 0 and 1, then scale to 0-100px
    const pm10Height = Math.max(0, Math.min(((pm10 ?? 0) / pm10MaxBar) * 100, 100));
    const pm25Height = Math.max(0, Math.min(((pm25 ?? 0) / pm25MaxBar) * 100, 100));
    // console.log('Heights 10 and 25', pm10Height, pm25Height);
    // Dynamic background color based on PM values
    const bg = getPMBgGradient(pm10 ?? 0, pm25 ?? 0);
    // const pm10Elevated = typeof pm10 === 'number' && pm10Severity === 'Moderate';
    // const pm25Elevated = typeof pm25 === 'number' && pm25Severity === 'Moderate';
    // if (pm10Elevated || pm25Elevated) {
    //     // light red gradient
    //     bg = 'linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)';
    // } else if (
    //     (typeof pm10 === 'number' && pm10Severity === 'Poor') ||
    //     (typeof pm25 === 'number' && pm25Severity === 'Poor')
    // ) {
    //     // light orange gradient
    //     bg = 'linear-gradient(135deg, #fffbe7 0%, #fff7e0 100%)';
    // } else if (
    //     (typeof pm10 === 'number' && pm10Severity === 'Severe') ||
    //     pm10Severity === 'Hazardous' ||
    //     (typeof pm25 === 'number' && pm25Severity === 'Severe') ||
    //     pm25Severity === 'Hazardous'
    // ) {
    //     bg = 'linear-gradient(135deg, #ffeaea 0%, #fffbe7 100%)';
    // }

    return (
        <Card
            className="bento-card pm10-card shadow-sm rounded-4 p-4"
            style={{ fontFamily: 'Inter, sans-serif', background: bg, borderRadius: 24 }}>
            <Card.Body style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}> */}
                {/* Title at the top */}
                <Row style={{ flex: '0 0 70%', minHeight: 0 }}>
                    <Col xs={6}>
                        {' '}
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                color: '#22223b',
                                marginBottom: 8,
                                textAlign: 'left',
                            }}>
                            PM
                        </div>
                    </Col>
                    <Col xs={6}>
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
                            {/* PM10 bar (Indoor) */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    textAlign: 'center',
                                }}>
                                <span style={{ color: 'black', fontSize: '0.8rem', fontWeight: 500 }}>PM10</span>
                                <div
                                    style={{
                                        width: 10,
                                        minHeight: 0,
                                        borderRadius: 8,
                                        background: pm10Color,
                                        opacity: 0.9,
                                        marginBottom: 6,
                                        transition: 'height 0.3s',
                                        height: pm10Height,
                                    }}></div>
                                <span style={{ color: 'black', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {pm10Severity}
                                </span>
                            </div>

                            {/* PM2.5 bar (Indoor) */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    textAlign: 'center',
                                }}>
                                <span style={{ color: 'black', fontSize: '0.8rem', fontWeight: 500 }}>PM 2.5</span>
                                <div
                                    style={{
                                        width: 10,
                                        minHeight: 0,
                                        borderRadius: 8,
                                        background: pm25Color,
                                        opacity: 0.9,
                                        marginBottom: 6,
                                        transition: 'height 0.3s',
                                        height: pm25Height,
                                    }}></div>
                                <span style={{ color: 'black', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {pm25Severity}
                                </span>
                            </div>
                            {/* PM10 bar (Outdoor) */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    textAlign: 'center',
                                }}>
                                <span style={{ color: 'black', fontSize: '0.8rem', fontWeight: 500 }}>PM 10 Out</span>
                                <div
                                    style={{
                                        width: 10,
                                        minHeight: 0,
                                        borderRadius: 8,
                                        background: getPM10Color(oPm10 ?? 0),
                                        opacity: 0.9,
                                        marginBottom: 6,
                                        transition: 'height 0.3s',
                                        height: Math.max(0, Math.min(((oPm10 ?? 0) / pm10MaxBar) * 100, 100)),
                                    }}></div>
                                <span style={{ color: 'black', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {oPm10Severity}
                                </span>
                            </div>

                            {/* PM2.5 bar (Outdoor) */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    textAlign: 'center',
                                }}>
                                <span style={{ color: 'black', fontSize: '0.9rem', fontWeight: 500 }}>PM 2.5 Out</span>
                                <div
                                    style={{
                                        width: 10,
                                        minHeight: 0,
                                        borderRadius: 8,
                                        background: getPM25Color(oPm25 ?? 0),
                                        opacity: 0.9,
                                        marginBottom: 6,
                                        transition: 'height 0.3s',
                                        height: Math.max(0, Math.min(((oPm25 ?? 0) / pm25MaxBar) * 100, 100)),
                                    }}></div>
                                <span style={{ color: 'black', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {oPm25Severity}
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* Key values: 2 columns, below bars */}
                <Row>
                    <Col xs={12}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 20,
                                margin: '8px 0 0 0',
                            }}>
                            {/* PM10 (Indoor) */}
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
                                <span style={{ color: 'black', fontWeight: 500, fontSize: '1.05rem' }}>PM10</span>
                                <span style={{ color: 'black', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {pm10}{' '}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: 2 }}>µg/m³</span>
                                </span>
                            </div>
                            {/* PM2.5 (Indoor) */}
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
                                <span style={{ color: 'black', fontWeight: 500, fontSize: '1.05rem' }}>PM2.5</span>
                                <span style={{ color: 'black', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {pm25}{' '}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: 2 }}>µg/m³</span>
                                </span>
                            </div>
                            {/* PM10 (Outdoor) */}
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
                                        background: getPM10Color(oPm10 ?? 0),
                                        display: 'inline-block',
                                    }}></span>
                                <span style={{ color: 'black', fontWeight: 500, fontSize: '1.05rem' }}>
                                    PM10 Out
                                    <br />
                                    {/* <span style={{ fontSize: '0.85rem', color: '#888' }}>()</span> */}
                                </span>
                                <span style={{ color: 'black', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {oPm10}{' '}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: 2 }}>µg/m³</span>
                                </span>
                            </div>
                            {/* PM2.5 (Outdoor) */}
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
                                        background: getPM25Color(oPm25 ?? 0),
                                        display: 'inline-block',
                                    }}></span>
                                <span style={{ color: 'black', fontWeight: 500, fontSize: '1.05rem' }}>
                                    PM2.5 Out
                                    <br />
                                    {/* <span style={{ fontSize: '0.85rem', color: '#888' }}>(Out)</span> */}
                                </span>
                                <span style={{ color: 'black', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {oPm25}{' '}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: 2 }}>µg/m³</span>
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
