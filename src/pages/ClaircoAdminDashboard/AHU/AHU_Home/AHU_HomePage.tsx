import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import AHUDevicesTable from './AHUDevicesTable';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
import { iconConstant } from 'appConstants/claircoConstants';
const AHU_HomePage = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'AHU'} />
            {/* <Statistics /> */}
            <Row className="mx-3" style={{}}>
                {' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={iconConstant.sensor} title={' Devices'} value={totalDevices} />
                </Col>
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={' Alerts'} value={0} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={iconConstant.offline1 ?? ''} title={'Offline'} value={''} />
                </Col>{' '}
                {/* <Col lg={3}> <TitleWidget icon={icon} title={'Total Online'} value={10} /></Col> */}
            </Row>

            <Row className="mx-2 rounded-lg">
                <AHUDevicesTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default AHU_HomePage;
