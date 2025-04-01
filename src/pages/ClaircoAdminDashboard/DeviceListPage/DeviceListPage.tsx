import { Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Statistics from '../../../components/ClaircoStatistics/Statistics';
import { DeviceTables } from 'pages/ClaircoAdminDashboard/DeviceListPage/DeviceTables';
import { useEffect, useState } from 'react';
import { useLocation, Location } from 'react-router-dom';

import { useRedux } from 'hooks';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import activeIcon from 'assets/icons/check.png';
import alertIcon from 'assets/icons/caution.png';
import AlertsModal from 'components/ClaircoGeneral/Modals/AlertsModal';
import { iconConstant } from 'appConstants/claircoConstants';
import Breadcrumbs1 from 'components/ClaircoGeneral/Breadcrums/Breadcrumbs1';
import { extractParamsForBreadCrumbs } from 'utils/params';
type LocationState = {
    id: string;
    name: string;
    floorId?: string;
};

const DeviceListPage = () => {
    const [tableData, setTableData] = useState([]);
    const [alertModalState, setALertModalState] = useState(false);
    const [customer, setCustomer] = useState<{ customerName: string; customerId: string; floorId: string }>({
        customerName: '',
        customerId: '',
        floorId: '',
    });
    const [breadcrumbArray, setBreadcrumbArray] = useState<string[]>([]);
    const location: Location = useLocation();
    const params = useParams();

    const handleAlertsClick = () => {
        try {
            setALertModalState((prev) => !prev);
            // console.log('Clicked Alerts');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const { id = '', name = '', floorId = '' } = location.state as LocationState;
        setCustomer((prev) => ({ ...prev, floorId }));
        const res = extractParamsForBreadCrumbs(params);
        setBreadcrumbArray(res);
    }, []);

    return (
        <>
            <AlertsModal modalControlFn={handleAlertsClick} modalState={alertModalState} />
            {/* <PageHeading title={'Devices'} /> */}
            <div className="mx-3">
                <Breadcrumbs1 dataArray={breadcrumbArray} />
            </div>
            {/* <Row style={{ marginLeft: '1.5em', marginRight: '0.5em' }}>
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={iconConstant.device} title={'Devices'} value={'-'} />
                </Col>{' '}
                <Col lg={4} onClick={handleAlertsClick} style={{ cursor: 'pointer' }}>
                    {' '}
                    <TitleWidget icon={alertIcon} title={'Alerts'} />
                </Col>{' '}
                <Col lg={4}>
                    <TitleWidget icon={iconConstant.offline1} title={'Offline'} value={''} />
                </Col>
            </Row> */}
            <Row style={{ marginLeft: '0.5em', marginRight: '10px' }}>
                <DeviceTables floorId={customer?.floorId} />
            </Row>
        </>
    );
};

export default DeviceListPage;
