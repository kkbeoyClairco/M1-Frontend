import React, { useState } from 'react';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row } from 'react-bootstrap';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
import EnergyMeterTable from './EnergyMeterDeviseTable';
import { iconConstant } from 'appConstants/claircoConstants';
const EnergyMeter_HomePage = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'Energy Meter Home'} />
            <Row className="mx-3">
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
                {/* <Col lg={3}>
                    {' '}
                    <TitleWidget title={'Total Devices'} value={''} />
                </Col> */}
            </Row>
            <Row className="mx-2 rounded-lg">
                <EnergyMeterTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default EnergyMeter_HomePage;
