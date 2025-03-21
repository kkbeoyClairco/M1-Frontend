import React, { useState } from 'react';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row } from 'react-bootstrap';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
import OutdoorTable from './OutdoorDeviseTable';
import { iconConstant } from 'appConstants/claircoConstants';
const OutdoorDevicesHomePage = () => {
    // const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'Outdoor Devices'} />
            <Row className="mx-3" style={{}}>
                <Col lg={4}>
                    <TitleWidget title={'Total Devices'} value={totalDevices} icon={iconConstant.sensor} />
                </Col>
                <Col lg={4}>
                    <TitleWidget icon={alertIcon} title={' Alerts'} value={0} />
                </Col>
                <Col lg={4}>
                    <TitleWidget icon={iconConstant.offline1 ?? ''} title={'Offline'} value={''} />
                </Col>
            </Row>
            <Row className="mx-2 rounded-lg">
                <OutdoorTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default OutdoorDevicesHomePage;
