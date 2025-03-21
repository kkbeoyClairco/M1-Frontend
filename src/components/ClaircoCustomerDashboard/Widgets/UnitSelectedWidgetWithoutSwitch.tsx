// import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

type unitSelectionWidgetType = {
    unitName?: string;
    location?: string;
    floor?: any;
    building?: any;
    deviceState?: any;
    swithDisabled?: boolean;
    deviceControlFunction?: () => void;
};
const UnitSelectedWidgetWithoutSwitch = ({
    unitName,
    location,
    floor,
    building,
    deviceState,
}: unitSelectionWidgetType) => {
    return (
        <Row>
            <Col xs={12} md={12} lg={12}>
                <div className="widget-flat-dummy" style={{ padding: '10px', paddingLeft: '15px', margin: '5px' }}>
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
                        {/* <div>
                            {deviceControlFunction && (
                                <Switch
                                    switchState={switchState}
                                    switchControlFunction={setSwitchState}
                                    disabled={swithDisabled}
                                />
                            )}
                        </div> */}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default UnitSelectedWidgetWithoutSwitch;
