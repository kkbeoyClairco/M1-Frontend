import { iconConstant } from 'appConstants/claircoConstants';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import AlertsModal from 'components/ClaircoGeneral/Modals/AlertsModal';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import activeIcon from 'assets/icons/check.png';
import alertIcon from 'assets/icons/caution.png';
import { useRedux } from 'hooks';
import CustomerTable from './CustomerTable';
import { getAdminCardData } from 'helpers/api/services/Clairco/adminSide/landingPage';
const LandingPage = () => {
    const [alertModalState, setALertModalState] = useState(false);
    const { appSelector } = useRedux();
    const totalCustomers = appSelector((state) => state?.Customer?.customers?.length);
    const handleAlertsClick = () => {
        try {
            setALertModalState((prev) => !prev);
            // console.log('Clicked Alerts');
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCardData = async () => {
        try {
            const data = await getAdminCardData();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCardData();
    }, []);
    return (
        <>
            {alertModalState && <AlertsModal modalControlFn={handleAlertsClick} modalState={alertModalState} />}
            <PageHeading title={'Clairco Dashboard'} />
            <Row className="mx-3" style={{}}>
                <Col lg={4}>
                    <TitleWidget title={'Customers'} value={totalCustomers} icon={iconConstant.customer} />
                </Col>
                {/* <Col lg={3}>
                    <TitleWidget icon={iconConstant?.device} title={'Devices'} value={'-'} />
                </Col>{' '} */}
                <Col lg={4} onClick={handleAlertsClick} style={{ cursor: 'pointer' }}>
                    <TitleWidget icon={alertIcon} title={'Alerts'} />
                </Col>{' '}
                <Col lg={4}>
                    {' '}
                    <TitleWidget icon={iconConstant.offline1 ?? ''} title={'Offline'} value={''} />
                </Col>
                {/* <Statistics from="ADMIN" totalCustomers={totalCustomers} /> */}
            </Row>
            <Row className="mx-2 rounded-lg">
                <CustomerTable />
            </Row>
        </>
    );
};

export default LandingPage;
