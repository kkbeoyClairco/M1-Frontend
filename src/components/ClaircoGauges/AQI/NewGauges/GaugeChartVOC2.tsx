import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Row, Col } from 'react-bootstrap';
import { getVocColor, getVOCGradient, getVoCLabel } from 'utils/AQI/colorUtils';
import * as echarts from 'echarts';
import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
// import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
// import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
// import { roundToOneDecimal } from 'utils/maths';
// import { convertUnixToIST } from 'utils/timeFunctions';

// type EChartsOption = echarts.EChartsOption;
interface GaugeChartProps {
    property: string;
    value: number;
    deviceName: string;
    lastUpdated?: string;
    infoClickFn?: (e: React.MouseEvent<HTMLDivElement>, state: string) => void;
}
const min = 0;
const max = 500;
const GaugeChartVOC2: React.FC<GaugeChartProps> = ({ property, value, deviceName, lastUpdated, infoClickFn }) => {
    const [hovered, setHovered] = React.useState(false);
    const [panelHovered, setPanelHovered] = React.useState(false);

    const option = {
        tooltip: {
            formatter: '{a} : {c} ppm',
        },
        series: [
            {
                name: 'Volatile Organic Compounds',
                type: 'gauge',
                radius: '77.66%',
                startAngle: 90,
                endAngle: -270,
                pointer: { show: false },
                center: ['50%', '50%'],
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: false,
                    clip: false,
                    itemStyle: {
                        borderWidth: 0,
                        color: getVocColor(value),
                    },
                },
                detail: {
                    valueAnimation: true,
                    formatter: (value: any) => {
                        let val = isNaN(value) ? 'Na' : value + ' ppm';
                        return val;
                    },
                    offsetCenter: [0, '80%'],
                    textStyle: { fontSize: 14 },
                },
                axisLabel: { show: false },
                details: {
                    width: 50,
                    height: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                },
                axisLine: {
                    lineStyle: { width: 14 },
                },
                axisTick: { show: false },
                splitLine: { show: false, length: 6, lineStyle: { width: 2, color: '#999' } },
                anchor: { show: false, showAbove: true, size: 25, itemStyle: {} },
                title: { show: true },
                data: [
                    {
                        value: value || 'Na',
                        name: getVoCLabel(value),
                        formatter: (value: any) => '',
                        title: { offsetCenter: [0, '0%'], textStyle: { fontSize: 6 } },
                        detail: { valueAnimation: true, fontSize: 20, offsetCenter: ['0%', '30%'] },
                    },
                ],
                min: min,
                max: max,
            },
        ],
    };

    return (
        <Card
            style={{
                width: '100%',
                borderRadius: 20,
                boxShadow: hovered ? '0 8px 32px 0 rgba(44,62,80,0.18)' : '0 4px 24px 0 rgba(0,0,0,0.07)',
                transition: 'box-shadow 0.3s, background 0.3s',
                background: getVOCGradient(value),
                // 'linear-gradient(135deg, #ffe9e6 0%, #ffffff 100%)', //Pale
                // background: 'linear-gradient(135deg, #f5fafd 0%, #e8f0fe 100%)',
                // background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)', //SoftTeal
                // background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%)', //lavender
                // background: 'linear-gradient(135deg, #eafbe7 0%, #ffffff 100%)', //Green
                // background: 'linear-gradient(135deg, #e3f0ff 0%, #f7fafd 100%)', // Modern blue
                // background: hovered ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,1)',
                // background: hovered ? 'rgba(245,247,250,1)' : 'rgba(245,247,250,0.85)',
                cursor: 'pointer',
                marginBottom: '0px',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <Card.Body style={{ padding: '1.5rem 1.5rem 2rem 1.5rem' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 32,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        minHeight: 260,
                        overflow: 'hidden',
                    }}>
                    {/* Left: Gauge */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: '0 0 260px',
                            minWidth: 220,
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <h5 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#2c3e50' }}>
                                Volatile Organic Compounds
                            </h5>
                            {infoClickFn && (
                                <div
                                    style={{ marginLeft: 8, cursor: 'pointer' }}
                                    onClick={(e) => infoClickFn(e, 'VOC')}>
                                    <InformationIcon />
                                </div>
                            )}
                        </div>
                        <ReactEcharts
                            option={option}
                            style={{
                                height: '18vw',
                                maxHeight: '180px',
                                width: '18vw',
                                maxWidth: '180px',
                                minWidth: '120px',
                            }}
                        />
                        <div style={{ marginTop: 8, fontSize: 13, color: '#888', fontWeight: 500 }}>{deviceName}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2, color: 'black' }}>
                            Updated on {lastUpdated}
                        </div>
                    </div>
                    {/* Right: Standard Ranges */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: panelHovered ? 'rgba(245,247,250,0.95)' : 'rgba(245,247,250,0.7)',
                            borderRadius: 12,
                            padding: '2rem 1.5rem 2rem 1.5rem', // top right bottom left                            boxShadow: 'none',
                            minWidth: 180,
                            maxWidth: 260,
                            marginLeft: 12,
                            marginBottom: 4,
                            fontSize: 13,
                            transition: 'background 0.3s',
                            color: 'black',
                        }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6 }}>Reference in ppm</div>
                        <div style={{ width: '100%' }}>
                            <Row style={{ fontSize: 13, marginBottom: 2 }}>
                                <Col
                                    xs={5}
                                    style={{ color: '#4CAF50', fontWeight: 500, textAlign: 'left', padding: 0 }}>
                                    Good
                                </Col>
                                <Col xs={2} style={{ textAlign: 'center', padding: 0 }}>
                                    0
                                </Col>
                                <Col xs={1} style={{ textAlign: 'center', padding: 0 }}>
                                    to
                                </Col>
                                <Col xs={4} style={{ textAlign: 'right', padding: 0 }}>
                                    40
                                </Col>
                            </Row>
                            <Row style={{ fontSize: 13, marginBottom: 2 }}>
                                <Col
                                    xs={5}
                                    style={{ color: '#FFC107', fontWeight: 500, textAlign: 'left', padding: 0 }}>
                                    Moderate
                                </Col>
                                <Col xs={2} style={{ textAlign: 'center', padding: 0 }}>
                                    41
                                </Col>
                                <Col xs={1} style={{ textAlign: 'center', padding: 0 }}>
                                    to
                                </Col>
                                <Col xs={4} style={{ textAlign: 'right', padding: 0 }}>
                                    100
                                </Col>
                            </Row>
                            <Row style={{ fontSize: 13, marginBottom: 2 }}>
                                <Col
                                    xs={5}
                                    style={{ color: '#F44336', fontWeight: 500, textAlign: 'left', padding: 0 }}>
                                    Poor
                                </Col>
                                <Col xs={2} style={{ textAlign: 'center', padding: 0 }}>
                                    101
                                </Col>
                                <Col xs={1} style={{ textAlign: 'center', padding: 0 }}>
                                    to
                                </Col>
                                <Col xs={4} style={{ textAlign: 'right', padding: 0 }}>
                                    300
                                </Col>
                            </Row>
                            <Row style={{ fontSize: 13, marginBottom: 2 }}>
                                <Col
                                    xs={5}
                                    style={{ color: '#8B0000', fontWeight: 500, textAlign: 'left', padding: 0 }}>
                                    Unhealthy
                                </Col>
                                <Col xs={2} style={{ textAlign: 'center', padding: 0 }}>
                                    301
                                </Col>
                                <Col xs={1} style={{ textAlign: 'center', padding: 0 }}></Col>
                                <Col xs={4} style={{ textAlign: 'right', padding: 0 }}>
                                    or higher
                                </Col>
                            </Row>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, fontStyle: 'italic' }}>*As per IGBC standard</div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default GaugeChartVOC2;
