import StrokedGauge from 'components/ClaircoCharts/StrokedGauge';
import { device } from 'helpers/api/services/Clairco/device';
import React from 'react';
import { Card, Row } from 'react-bootstrap';

type VRFOccupancyWidgetType = {
    temperature?: number;
    deviceName?: string;
    lastUpdated?: string;
};
export const VRFTemperatureWidget: React.FC<VRFOccupancyWidgetType> = ({ temperature, deviceName, lastUpdated }) => {
    return (
        <Card className="shadow-lg rounded-lg">
            <Card.Body
                className="px-0 justify-content-center"
                style={{
                    height: '30em',
                    // cursor: 'pointer',
                }}>
                <h5 className="text-center">Zone Temperature(°C)</h5>
                <Row className="h-75">
                    {' '}
                    <StrokedGauge property={'Temperature'} value={temperature} deviceName={deviceName ?? ''} />
                </Row>{' '}
                <p className="text-center" style={{ fontSize: '10px', fontWeight: '600' }}>
                    Updated on {lastUpdated ? lastUpdated : ' ' + 'N/A'}
                </p>
            </Card.Body>
        </Card>
    );
};
