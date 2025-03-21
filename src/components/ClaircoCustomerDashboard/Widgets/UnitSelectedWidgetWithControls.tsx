import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Switch from '../Buttons/Switch';
import GearIcon from '../Icons/GearIcon';

type unitSelectionWidgeWithControlstType = {
    unitName?: string;
    location?: string;
    floor?: any;
    building?: any;
    deviceState?: any;
    isIcon?: boolean;
    deviceControlFunction?: () => void;
    iconFunction?: any;
    firstPara?: any;
    secondPara?: any;
};
const UnitSelectedWidgetWithControls = ({
    unitName,
    location,
    floor,
    building,
    deviceState,
    deviceControlFunction,
    isIcon,
    iconFunction,
    firstPara,
    secondPara,
}: unitSelectionWidgeWithControlstType) => {
    const [switchState, setSwitchState] = useState(false);
    const handleDeviceControl = async () => {
        try {
            if (deviceControlFunction) deviceControlFunction();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Row>
            <Col xs={12} md={12} lg={12}>
                <div className="widget-flat-dummy" style={{ padding: '10px', paddingLeft: '15px', margin: '5px' }}>
                    <h6>
                        {location} &gt; {building} &gt; {floor}
                    </h6>
                    <h1 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{unitName}</h1>{' '}
                    <div
                        style={{
                            // alignItems: 'end',
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingRight: '10px',
                        }}>
                        {firstPara ? firstPara : null}
                        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', gap: '5px' }}>
                            {/* <h5 style={{ display: 'flex', marginTop: '2px' }}>{firstParas}</h5>
                             */}
                            {secondPara ? secondPara : null}
                            {iconFunction && <GearIcon clickeHandlerFunction={iconFunction} bgColor="white" />}{' '}
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default UnitSelectedWidgetWithControls;
