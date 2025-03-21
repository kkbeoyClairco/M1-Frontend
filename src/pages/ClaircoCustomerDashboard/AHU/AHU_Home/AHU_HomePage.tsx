import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import AHUDevicesTable from './AHUDevicesTable';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
const AHU_HomePage = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'AHU'} />
            {/* <Statistics /> */}
            <Row style={{ marginLeft: '10px', marginRight: '5px' }}>
                {' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget title={'Total Devices'} value={totalDevices} />
                </Col>
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={'Total Alerts'} value={0} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={activeIcon} title={'Total Online'} />
                </Col>{' '}
                {/* <Col lg={3}> <TitleWidget icon={icon} title={'Total Online'} value={10} /></Col> */}
            </Row>

            <Row style={{ marginLeft: '10px' }}>
                <AHUDevicesTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default AHU_HomePage;
