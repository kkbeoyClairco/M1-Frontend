import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
// import OccupancyDeviceTable from './OccupancyDeviceTable';
import PCSDeviceTable from './PCSDeviceTable';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';

import { Col, Row } from 'react-bootstrap';
import { useState } from 'react';

const PcsHome = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    const [totalOccupants, setTotalOccupants] = useState();
    return (
        <>
            <PageHeading title={'People Counting Sensors'} />
            <Row className="mx-3">
                {' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget title={'Total Devices'} value={4} />
                </Col>
                {/* <Col lg={4}>
                    {' '}
                    <TitleWidget title={'Total Occupants'} value={totalOccupants} />
                </Col> */}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={'Total Alerts'} value={'0'} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={activeIcon} title={'Total Online'} value={4} />
                </Col>{' '}
                {/* <Col lg={3}> <TitleWidget icon={icon} title={'Total Online'} value={10} /></Col> */}
            </Row>
            <Row className="mx-2 rounded-lg">
                <PCSDeviceTable setTotalDevices={setTotalDevices} setTotalOccupants={setTotalOccupants} />
            </Row>
        </>
    );
};

export default PcsHome;
