import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import IAQDeviseTable from './IAQDeviceTables';
import { getAlerts } from 'helpers/api/services/Clairco/customerSide/iaq';

// import { assignDeviceType, formatDateToLocalTime } from 'helpers/utils';
// import { useRedux } from 'hooks';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
import { getDevices } from 'redux/actions';
import { iconConstant } from 'appConstants/claircoConstants';
import { getUserDetailsFromSession, getUserIdFromSession, isAdmin } from 'utils/storageFunctions';
import AlertsModal from './AlertsModal';

const IAQDetailsPage = () => {
    // const { dispatch, appSelector } = useRedux();
    const [totalDevices, setTotalDevices] = useState();
    const [alertsModalStatus, setAlertsModalStatus] = useState(false);
    const [offlineCount, setOfflineCount] = useState(0);
    const customerId = getUserDetailsFromSession()?.customerId ?? '';
    const { buildingId = '' } = getUserIdFromSession();
    const isAdmin1 = isAdmin();

    const [alerts, setAlerts] = useState<any>([]);

    const fetchAlerts = async () => {
        try {
            let res;
            // console.log('Is admin', isAdmin1);
            if (!isAdmin1) res = await getAlerts(customerId, buildingId ?? '');
            else res = await getAlerts();
            setAlerts(res?.data?.offDevices ?? []);
            setOfflineCount(res?.data?.offDevices?.length ?? 0);

            // console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAlertsModal = () => {
        try {
            // console.log('alert click');
            if (!alerts.length) return;
            setAlertsModalStatus((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <>
            <PageHeading title={'IAQ Device'} />
            <Row className="mx-3">
                <AlertsModal dataArray={alerts} modalControlFn={handleAlertsModal} modalState={alertsModalStatus} />

                <Col lg={4}>
                    <TitleWidget title={' Devices'} value={totalDevices} icon={iconConstant.device} />
                </Col>
                <Col lg={4} onClick={handleAlertsModal} style={{ cursor: 'pointer' }}>
                    <TitleWidget icon={alertIcon} title={'Alerts'} value={alerts?.length ?? 0} />
                </Col>
                <Col lg={4}>
                    <TitleWidget icon={iconConstant.offline1 ?? ''} title={'Offline'} value={offlineCount} />
                </Col>
            </Row>
            <Row className="mx-2 rounded-lg">
                <IAQDeviseTable setTotalDevices={setTotalDevices} setOfflineCount={setOfflineCount} />
            </Row>
        </>
    );
};

export default IAQDetailsPage;
