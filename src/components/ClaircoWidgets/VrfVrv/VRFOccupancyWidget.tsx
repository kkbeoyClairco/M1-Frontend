import React from 'react';
import { Card, Row } from 'react-bootstrap';
import occupancyIcon from 'assets/images/occupanacy_icon.png';

type VRFOccupancyWidgetType = {
    occupanctsCount: string | number;
};
export const VRFOccupancyWidget: React.FC<VRFOccupancyWidgetType> = ({ occupanctsCount }) => {
    return (
        <Card
            className="shadow-lg rounded-lg"
            title="Please click to see the trends"
            style={{
                height: '30em',
                cursor: 'pointer',
            }}>
            <Card.Body>
                <Row>
                    <h5>Occupancy</h5>
                </Row>
                <Row style={{ height: '75%' }}>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        {' '}
                        <img style={{ height: '60px', marginTop: '80px' }} src={occupancyIcon} alt="" />{' '}
                    </div>
                    <div
                        style={{
                            marginTop: '0px',
                            height: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                        {occupanctsCount ? <h2>{occupanctsCount ?? 'N/A'}</h2> : <p>N/A</p>}{' '}
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                        <h5>Members</h5>
                    </div>{' '}
                </Row>
            </Card.Body>
        </Card>
    );
};
