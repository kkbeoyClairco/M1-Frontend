import { Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation, Location } from 'react-router-dom';

import AlertsModal from 'components/ClaircoGeneral/Modals/AlertsModal';
import { BuildingsTable } from './BuildingsTable';
import Breadcrumbs1 from 'components/ClaircoGeneral/Breadcrums/Breadcrumbs1';
import { extractParamsForBreadCrumbs } from 'utils/params';
type LocationState = {
    id: string;
    name: string;
};

const BuildingListPage = () => {
    const [alertModalState, setALertModalState] = useState(false);
    const [breadcrumbArray, setBreadcrumbArray] = useState<string[]>([]);
    const [customer, setCustomer] = useState<{ customerName: string; customerId: string }>({
        customerName: '',
        customerId: '',
    });
    const params = useParams();

    const location: Location = useLocation();
    const handleAlertsClick = () => {
        try {
            setALertModalState((prev) => !prev);
            // console.log('Clicked Alerts');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const { id = '', name = '' } = location.state as LocationState;
        setCustomer({ customerId: id, customerName: name });
        const res = extractParamsForBreadCrumbs(params);
        setBreadcrumbArray(res);
    }, []);

    return (
        <>
            <AlertsModal modalControlFn={handleAlertsClick} modalState={alertModalState} />
            {/* <PageHeading title={customer?.customerName ?? 'Customer'} /> */}
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
                </Col> */}
            {/* </Row> */}
            <Row style={{ marginLeft: '0.5em', marginRight: '10px' }}>
                <BuildingsTable customerId={customer?.customerId} customerName={customer.customerName} />
            </Row>
        </>
    );
};

export default BuildingListPage;
