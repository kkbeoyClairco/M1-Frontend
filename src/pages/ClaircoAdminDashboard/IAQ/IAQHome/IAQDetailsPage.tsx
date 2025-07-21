import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import IAQDeviseTable from './IAQDeviceTables';
import IAQDeviseTable2 from './IAQDeviceTables2';

import { getAlerts } from 'helpers/api/services/Clairco/customerSide/iaq';

// import { assignDeviceType, formatDateToLocalTime } from 'helpers/utils';
// import { useRedux } from 'hooks';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';

import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
import { getDevices } from 'redux/actions';
import { iconConstant, userType } from 'appConstants/claircoConstants';
import { getUserDetailsFromSession, getUserIdFromSession, getUserType, isAdmin } from 'utils/storageFunctions';
import AlertsModal from './AlertsModal';
import { selectTagType } from 'types/selectTagType';

const IAQDetailsPage = () => {
    // const { dispatch, appSelector } = useRedux();
    const [totalDevices, setTotalDevices] = useState();
    const [alertsModalStatus, setAlertsModalStatus] = useState(false);
    const [offlineCount, setOfflineCount] = useState(0);
    const customerId = getUserDetailsFromSession()?.customerId ?? '';
    const [userAssignedAssets, setUserAssignedAssets] = useState<{
        buildings: selectTagType[];
        floors: selectTagType[];
    } | null>(null);

    const { buildingId = '' } = getUserIdFromSession();
    const isAdmin1 = isAdmin();
    const isTypeCustomer = getUserType() === userType.Customer;
    const [alerts, setAlerts] = useState<any>([]);
    const extractBuildings = (data: any) => {
        try {
            const buildings = data?.flatMap((customer: any) =>
                customer?.buildings?.map((building: any) => ({
                    label: building.name,
                    value: building.buildingId,
                    customerId: customer?.customerId,
                }))
            );

            const floors = data?.buildings?.reduce((floors: any, current: any) => {
                const data1 = current?.floors?.map((docF: any) => ({
                    label: docF.name,
                    value: docF.id,
                    buildingId: current.id,
                    customerId: data?.customerId,
                }));

                floors.push(...data1);
                return floors;
            }, []);
            // console.log('floor', floors1);

            return { buildings, floors };
        } catch (error) {
            console.log(error);
            return { buildings: {}, floors: {} };
        }
    };

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
        const data = getUserDetailsFromSession();
        // const data = dummyData?.access?.[0] ?? {};
        const { buildings, floors } = extractBuildings(data?.access ?? []);
        // console.log('building data', buildings, floors);
        setUserAssignedAssets({ buildings, floors });
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
                {isAdmin1 || isTypeCustomer ? (
                    <IAQDeviseTable setTotalDevices={setTotalDevices} />
                ) : (
                    <IAQDeviseTable2
                        setTotalDevices={setTotalDevices}
                        setOfflineCount={setOfflineCount}
                        data={userAssignedAssets}
                    />
                )}
            </Row>
        </>
    );
};

export default IAQDetailsPage;
