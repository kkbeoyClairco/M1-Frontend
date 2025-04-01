import { AHUModeReverseMapping, fanSpeedReverseMapping } from 'appConstants/DeviceMappingConstants';
import { conforms, divide } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { convertUnixToIST } from 'utils/timeFunctions';

interface VrfDataProps {
    data: {
        Status: string;
        'Set Temp': number;
        'Amb Temp': number;
        'Fan Speed': string;
        Mode: string;
        'Epoch time': number;
    };
}
interface AHUDataProps {
    data: {
        Status: string;
        'Set Temp': number;
        'Amb Temp': number;
        'Fan Speed': string;
        Mode: string;
        data: any;
        'Epoch time'?: any;
    };
}
interface OccupancyProps {
    data: {
        count: number;
        epochTime: number;
    };
}
// VRF VRV - Componenent
const VrfData: React.FC<VrfDataProps> = ({ data }) => {
    // console.log('VRF tool tip', data);
    const fields = [
        { key: 'Status', label: 'Status' },
        { key: 'Set Temp', label: 'Zone Temp' },
        { key: 'Amb Temp', label: 'Amb Temp' },
        { key: 'Fan Speed', label: 'Fan Speed' },
        { key: 'Mode', label: 'Mode' },
    ];
    return (
        <div style={{ display: 'grid', gap: '0', justifyContent: 'space-evenly' }}>
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Status:
                    </Col>
                    <Col xs={6}>{data?.Status ? data?.Status : 'Offline'}</Col>{' '}
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Set Temp:{' '}
                    </Col>
                    <Col xs={6}>{data['Set Temp'] || '-'} °C</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        {' '}
                        Zone Temp:{' '}
                    </Col>
                    <Col xs={6}>{data['Amb Temp'] || '-'} °C</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Fan Speed:
                    </Col>
                    <Col xs={6}> {data['Fan Speed'] || '-'}</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Mode:{' '}
                    </Col>
                    <Col xs={6}>{data['Mode'] || '-'}</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Updated On:{' '}
                    </Col>
                    <Col xs={6}>{convertUnixToIST(data['Epoch time']) || '-'}</Col>
                </Row>
            )}
        </div>
    );
};

const AhuData: React.FC<AHUDataProps> = ({ data }) => {
    // console.log('AHU tool tip', data);

    return (
        <div style={{ display: 'grid', gap: '0', justifyContent: 'space-evenly' }}>
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Status:
                    </Col>
                    <Col xs={6}>{data?.data?.RELAY1_STATE ? 'ON' : 'OFF'}</Col>{' '}
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Set Temp:{' '}
                    </Col>
                    <Col xs={6}>{data?.data?.['STEMP'] / 10 || '-'} °C</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '210px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        {' '}
                        Mode:{' '}
                    </Col>
                    <Col xs={6}>{AHUModeReverseMapping[data?.data?.['MODE']] || '-'} </Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Fan Speed:
                    </Col>
                    <Col xs={6}> {fanSpeedReverseMapping[data?.data?.['FANMODE']] || '-'}</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Return Temp:{' '}
                    </Col>
                    <Col xs={6}>{data?.data?.['RTEMP'] / 10 || '-'}°C</Col>
                </Row>
            )}
            {data && (
                <Row style={{ paddingInline: '10px', width: '200px' }}>
                    <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                        Updated on:{' '}
                    </Col>
                    <Col xs={6}>{convertUnixToIST(data?.['Epoch time']?.['$numberDecimal']) || '-'}</Col>
                </Row>
            )}
        </div>
    );
};

// Component For Occupants State
const OccupancyDataComponent: React.FC<OccupancyProps> = ({ data }) => {
    return (
        <div style={{ display: 'grid', gap: '0', justifyContent: 'center' }}>
            {data && (
                <>
                    {' '}
                    <Row style={{ paddingInline: '10px', width: '200px' }}>
                        <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                            Occupants:{' '}
                        </Col>
                        <Col xs={6}>{data.count} </Col>
                    </Row>
                    <Row style={{ paddingInline: '10px', width: '200px' }}>
                        <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                            Updated on:{' '}
                        </Col>
                        <Col xs={6}>{data?.['epochTime']} </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

// Tool tip Base componenent
export const LayoutToolTip = ({ show, positionValues, toolTipData, currentState }: any) => {
    // console.log('Tool tip data', show);
    const [toolTipPosition, setToolTipPosition] = useState({});
    useEffect(() => {
        // console.log('Tool tip data Changed:', toolTipData);
        setToolTipPosition({
            left: `${positionValues.xValue}px`,
            top: `${positionValues.yValue}px`,
        });
    }, [positionValues]);
    return (
        <div
            style={{
                width: '200px',
                height: '220px',
                position: 'absolute',
                transitionDelay: '0.8s',
                color: '#FFFF00',
                transitionProperty: 'all',
                transition: 'left 2s ease, top 2s ease',
                transitionDuration: '1s',
                backgroundColor: 'rgba(64, 64, 64, 0.85)',
                // opacity: 1,

                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                display: `${show ? 'block' : 'none'}`,
                ...toolTipPosition,
            }}>
            {toolTipData[0] && <h5 style={{ textAlign: 'center' }}>{toolTipData[0]?.name || 'Zone '}</h5>}

            {currentState === 'VRF-VRV' ? (
                <VrfData data={toolTipData[0]} />
            ) : currentState === 'OCCUPANCY' ? (
                <OccupancyDataComponent data={toolTipData[0]} />
            ) : currentState === 'AHU' ? (
                <AhuData data={toolTipData[0]} />
            ) : null}
        </div>
    );
};
// function vrfData(data: any) {
//     return (
//         <div>
//             <p>Status: {data.Status}</p>
//             <p>Zone Temp:{data['Set Temp']}</p>
//             <p>A</p>
//         </div>
//     );
// }
