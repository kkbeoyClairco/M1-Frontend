import React, { useState } from 'react';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row } from 'react-bootstrap';
import alertIcon from 'assets/icons/caution.png';
import IndoorDeviseTable from './IndoorDeviseTable';
import { iconConstant } from 'appConstants/claircoConstants';
const IndoorDevicesHomePage = () => {
    // const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'Indoor Devices Home'} />
            <Row className="mx-3" style={{}}>
                <Col lg={4}>
                    {' '}
                    <TitleWidget title={' Devices'} value={totalDevices} icon={iconConstant.device} />
                </Col>
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={' Alerts'} value={0} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={iconConstant.offline1 ?? ''} title={'Offline'} value={''} />
                </Col>{' '}
            </Row>
            <Row className="mx-2 rounded-lg">
                {' '}
                <IndoorDeviseTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default IndoorDevicesHomePage;
