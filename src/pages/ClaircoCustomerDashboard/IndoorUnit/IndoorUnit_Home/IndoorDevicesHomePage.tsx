import React, { useState } from 'react';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row } from 'react-bootstrap';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
import IndoorDeviseTable from './IndoorDeviseTable';
const IndoorDevicesHomePage = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'Indoor Devices Home'} />
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
                {/* <Col lg={3}>
                    {' '}
                    <TitleWidget title={'Total Devices'} value={''} />
                </Col> */}
            </Row>
            <Row style={{ marginLeft: '10px' }}>
                <IndoorDeviseTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default IndoorDevicesHomePage;
