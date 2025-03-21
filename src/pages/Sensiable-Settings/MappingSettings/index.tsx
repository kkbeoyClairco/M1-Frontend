import LayoutView from './images/image3.svg';
import SeatMapping from './SeatMapping';
// import MeetingRoomMapping from './MeetingRoomMapping';
import HorizontalStepper from './HorizontalStepper';
import { Card, Col, Row } from 'react-bootstrap';
import React from 'react';

const MappingSettings = () => {
    return (
        <>
       <Row className='mb-5 '>
                <HorizontalStepper />
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title">LAYOUT VIEW</h4>
                            <img src={LayoutView} alt="Layout view" className="mx-5" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm={12} lg={6}>
                    <SeatMapping />
                </Col>
                <Col sm={12} lg={6}>
                    {/* <MeetingRoomMapping /> */}
                </Col>
            </Row>
        </>
    );
};

export default MappingSettings;
