import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Switch from 'components/ClaircoCustomerDashboard/Buttons/Switch';
import { setSeconds } from 'date-fns';

type SelectedUnitWidgetType = {
    unitName?: string;
    location?: string;
    floor?: any;
    building?: any;
    deviceState?: any;
    swithDisabled?: boolean;
    deviceControlFunction?: () => void;
};
const SelectedUnitWidget = ({
    unitName,
    location,
    floor,
    building,
    deviceState,
    deviceControlFunction,
    swithDisabled,
}: SelectedUnitWidgetType) => {
    const [switchState, setSwitchState] = useState(false);
    const handleDeviceControl = async () => {
        try {
            if (deviceControlFunction) deviceControlFunction();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setSwitchState(deviceState);
    }, [deviceState]);

    return (
        <Row>
            <Col xs={12} md={12} lg={12}>
                <div
                    className="widget-flat-dummy rounded"
                    style={{ padding: '10px', paddingLeft: '15px', margin: '5px', height: '10em' }}>
                    <h6>
                        {location} &gt; {building} &gt; {floor}
                    </h6>
                    <h2
                        style={{
                            marginTop: '0.5em',
                            overflowWrap: 'break-word',
                            display: '-webkit-box',
                            wordWrap: 'break-word',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                        }}>
                        {unitName}
                    </h2>{' '}
                    <div
                        style={{
                            // alignItems: 'end',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            paddingRight: '10px',
                        }}>
                        {' '}
                        {/* <button type="button" className="btn btn-success">
                    Working
                </button> */}
                        <p className="mx-2">Commissioning Mode: </p>
                        <div>
                            {deviceControlFunction && (
                                <Switch
                                    switchState={switchState}
                                    switchControlFunction={deviceControlFunction}
                                    disabled={swithDisabled}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default React.memo(SelectedUnitWidget);
