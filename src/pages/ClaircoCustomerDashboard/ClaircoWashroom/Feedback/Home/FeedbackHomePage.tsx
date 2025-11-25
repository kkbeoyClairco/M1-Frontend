import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import FeedbackZoneTable from './FeedbackZoneTable';
import icon from 'assets/icons/hot.png';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';

import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getAlerts } from 'helpers/api/services/Clairco/customerSide/iaq';
import { getUserDetailsFromSession, getUserIdFromSession, isAdmin } from 'utils/storageFunctions';

const IAQ_Home = () => {
    // const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    // const [alertsModalStatus, setAlertsModalStatus] = useState(false);
    // const [alerts, setAlerts] = useState<any>([]);

    // console.log('Customer details', customerId);

    // const handleAlertsModal = () => {
    //     try {
    //         if (!alerts.length) return;
    //         setAlertsModalStatus((currentState) => !currentState);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    useEffect(() => {
        // fetchAlerts();
    }, []);

    return (
        <>
            <PageHeading title={'Feedback Analytics Home '} />
            <Row className="mx-3" style={{ marginRight: '40px' }}>
                {' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget
                        title={'Feedback Devices'}
                        value={totalDevices}
                        icon={'https://res.cloudinary.com/dlulq6hny/image/upload/v1738217587/sensors_bbmpqg.png'}
                    />
                </Col>
                {/* <Col lg={4} style={{}}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={'Total Alerts'} value={'0'} />
                </Col>{' '} */}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={activeIcon} title={'Total Online'} value={totalDevices} />
                </Col>
            </Row>
            <Row Row className="mx-3">
                <FeedbackZoneTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default IAQ_Home;
