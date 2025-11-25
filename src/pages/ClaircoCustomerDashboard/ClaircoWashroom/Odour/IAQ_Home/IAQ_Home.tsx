import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import IAQDeviseTable from './IAQDeviseTable';
import icon from 'assets/icons/hot.png';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';

import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
// import { getAlerts } from 'helpers/api/services/Clairco/customerSide/iaq';
// import AlertsModal from './AlertsModal';
// import { getUserDetailsFromSession, getUserIdFromSession, isAdmin } from 'utils/storageFunctions';

const IAQ_Home = () => {
    // const [totalOnline, setTotalOnline] = useState();
    const [totalDevices, setTotalDevices] = useState();
    // const [alertsModalStatus, setAlertsModalStatus] = useState(false);
    // const [alerts, setAlerts] = useState<any>([]);
    // const customerId = getUserDetailsFromSession()?.id ?? '';
    // const isAdmin1 = isAdmin();
    // const { buildingId = '' } = getUserIdFromSession();
    // console.log('Customer details', customerId);

    // const fetchAlerts = async () => {
    //     try {
    //         let res;
    //         // console.log('Is admin', isAdmin1);
    //         if (!isAdmin1) res = await getAlerts(customerId, buildingId ?? '');
    //         else res = await getAlerts();
    //         setAlerts(res?.data?.offDevices ?? []);
    //         // console.log(res);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleAlertsModal = () => {
    //     try {
    //         if (!alerts.length) return;
    //         setAlertsModalStatus((currentState) => !currentState);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // useEffect(() => {
    //     // fetchAlerts();
    // }, []);

    return (
        <>
            {/* <AlertsModal dataArray={alerts} modalControlFn={handleAlertsModal} modalState={alertsModalStatus} /> */}
            <PageHeading title={'OdourClair'} />
            <Row className="mx-3" style={{ marginRight: '5px' }}>
                {' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget
                        title={'Total Devices'}
                        value={4}
                        icon={'https://res.cloudinary.com/dlulq6hny/image/upload/v1738217587/sensors_bbmpqg.png'}
                    />
                </Col>
                <Col lg={4} style={{}}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={'Total Alerts'} value={'0'} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={activeIcon} title={'Total Online'} value={4} />
                </Col>{' '}
                {/* <Col lg={3}> <TitleWidget icon={icon} title={'Total Online'} value={10} /></Col> */}
            </Row>
            <Row className="mx-3">
                <IAQDeviseTable setTotalDevices={setTotalDevices} />
            </Row>
        </>
    );
};

export default IAQ_Home;
