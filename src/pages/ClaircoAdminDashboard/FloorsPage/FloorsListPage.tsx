import { Row, Col } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { useLocation, Location } from 'react-router-dom';

import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';

import AlertsModal from 'components/ClaircoGeneral/Modals/AlertsModal';
import { FloorsTable } from './FloorsTable';
type LocationState = {
    id?: string;
    name?: string;
    customerId?: string;
    buildingId: string;
    customerName?: string;
};

const BuildingListPage = () => {
    const [tableData, setTableData] = useState([]);
    const [alertModalState, setALertModalState] = useState(false);
    const [building, setBuilding] = useState<{
        buildingName: string;
        buildingId: string;
        customerId?: string;
        customerName: string;
    }>({
        buildingName: '',
        buildingId: '',
        customerId: '',
        customerName: '',
    });
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
        const { buildingId = '', name = '', customerId = '', customerName = '' } = location?.state as LocationState;
        setBuilding((prev) => ({ ...prev, buildingId, customerName, customerId, buildingName: name }));
    }, [location.state]);
    useEffect(() => {
        console.log('State floor', building);
    }, [building]);
    return (
        <>
            <AlertsModal modalControlFn={handleAlertsClick} modalState={alertModalState} />
            <PageHeading title={building?.buildingName ?? 'Floors'} />
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
                <FloorsTable
                    buildingId={building?.buildingId}
                    customerId={building?.customerId ?? ''}
                    customerName={building?.customerName ?? ''}
                />
            </Row>
        </>
    );
};

export default BuildingListPage;
