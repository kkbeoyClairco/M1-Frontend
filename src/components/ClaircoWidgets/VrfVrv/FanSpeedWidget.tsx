import GaugeChart from 'components/ClaircoCharts/GaugeChart';
import React from 'react';
import { Card } from 'react-bootstrap';

type FanSpeedWidgetType = {
    lastUpdated?: string;
    speed?: number;
    deviceName?: string;
};
const FanSpeedWidget: React.FC<FanSpeedWidgetType> = ({ lastUpdated, speed, deviceName }) => {
    return (
        <Card
            className="shadow-lg rounded-lg"
            style={{
                height: '30em',
            }}>
            <Card.Body className="px-0 justify-content-center">
                <h5 className="text-center">Fan Speed</h5>{' '}
                <GaugeChart property={'fanspeed'} value={speed ?? 0} deviceName={deviceName ?? ''} />
                <p className="text-center" style={{ fontSize: '10px', fontWeight: '600' }}>
                    Updated on {lastUpdated}
                </p>
            </Card.Body>
        </Card>
    );
};

export default FanSpeedWidget;
