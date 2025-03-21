import { Col, Row } from 'react-bootstrap';
import BusinessUnit from './BusinessUnit';
import SeatType from './SeatType';
import React from 'react';
import Building from './Table';
import HorizontalStepper from './HorizontalStepper copy';

const BuildingsTable = () => {
    return (
<>
<Row className='mb-5 '>
    <HorizontalStepper />
</Row>


<Row>
<Building/>
</Row>
<Row>
    <Col sm={6}>
<SeatType/>
    </Col>
    <Col sm={6}>
<BusinessUnit/>
    </Col>
</Row>


            </>
);
}; export default BuildingsTable;