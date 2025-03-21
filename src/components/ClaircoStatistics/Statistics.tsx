import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { TotalAlerts, TotalCustomers, TotalOnline, TotalUsers, TotalDevices, ChooseBuildings } from './index';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import activeIcon from 'assets/icons/check.png';

import alertIcon from 'assets/icons/caution.png';
const Statistics = ({
    title = 'Total Devices',
    from = '',
    data = null,
    buildingList = [],
    totalCustomers = '-',
    changeBuilding = (id: string) => {},
    customerName = '',
}) => {
    return (
        <>
            <Row style={{ marginLeft: '1em', marginRight: '0.5em' }}>
                {/* {from === 'ADMIN' && ( */}
                <>
                    <Col lg={3}>
                        {' '}
                        <TitleWidget title={'Total Customers'} value={totalCustomers} />
                    </Col>
                    <Col lg={3}>
                        {' '}
                        <TitleWidget icon={''} title={'Total Devices'} value={0} />
                    </Col>{' '}
                    <Col lg={3}>
                        {' '}
                        <TitleWidget icon={alertIcon} title={'Total Alerts'} />
                    </Col>{' '}
                    <Col lg={3}>
                        {' '}
                        <TitleWidget icon={activeIcon} title={'Total Online'} value={''} />
                    </Col>
                    {/* </Row> */}
                </>
                {/* )} */}
                {/* {from === 'CUSTOMER' && (
                    <>
                        <ChooseBuildings
                            buildingList={buildingList}
                            imageSrc={''}
                            setBuilding={changeBuilding}
                            customerName={customerName}
                        />
                        <TotalDevices chartData={chartData} />
                        <TotalUsers chartData={chartData} />
                    </>
                )} */}
            </Row>
        </>
    );
};

export default Statistics;
