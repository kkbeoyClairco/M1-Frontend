import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import ThermopileDevicesTable from './ThermopileDevicesTable';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
const ThermopileHomePage = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'Thermopile'} />
            {/* <Statistics /> */}
            <Row className="mx-3">
                {' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget title={'Total Devices'} value={2} />
                </Col>
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={'Total Alerts'} value={'0'} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={activeIcon} title={'Total Online'} value={2} />
                </Col>{' '}
                {/* <Col lg={3}> <TitleWidget icon={icon} title={'Total Online'} value={10} /></Col> */}
            </Row>

            <Row className="mx-2 rounded-lg">
                {' '}
                <ThermopileDevicesTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default ThermopileHomePage;
