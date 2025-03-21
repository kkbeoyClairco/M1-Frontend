import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import IAQDeviseTable from './IAQDeviseTable';
import icon from 'assets/icons/hot.png';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';

import { Col, Row } from 'react-bootstrap';
import { useState } from 'react';

const IAQ_Home = () => {
    const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    return (
        <>
            <PageHeading title={'IAQ Home'} />
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
                <IAQDeviseTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default IAQ_Home;
