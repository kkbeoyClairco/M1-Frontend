import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import TrendsChart from './TrendsChart';
import { useLocation } from 'react-router-dom';
import { getPcsTrendsData } from 'helpers/api/services/Clairco/customerSide/occupancy';

import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getPcsData } from 'helpers/api/services/Clairco/customerSide/pcs';
import { pcsRealtime } from 'appConstants/pcs';
// import useInterval from 'use-interval';
interface LocationState {
    name?: string;
}
const OccupancyDevicePage = () => {
    const location = useLocation();
    const [sensorName, setSensorName] = React.useState('');
    const [realTimeData, setRealTimeData] = React.useState<any>({});
    const [lastUpdated, setLastUpdated] = React.useState('');
    const [locationData, setLocationData] = React.useState<any>({});
    // const state = location.state as LocationState;

    const getLiveData = useCallback(async (sensorName) => {
        if (!sensorName) return;

        const res: any = { data: pcsRealtime };
        // await getPcsData(sensorName);
        let latestData = res?.data?.data;
        const latestTime = convertUnixToIST(
            new Date()
            // latestData?.['timestamp']
        );

        setRealTimeData({ inCount: latestData?.inCount ?? '-' });
        setLastUpdated(latestTime);
    }, []);

    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name') ?? '';
        const building = searchParams.get('building') ?? '';
        const floor = searchParams.get('floor') ?? '';
        const zoneName = searchParams.get('zone') ?? '';
        setSensorName(name ?? '');
        setLocationData({ building: building ?? '', floor: floor ?? '', zoneName: zoneName ?? '' });
        getLiveData(name);
    }, [getLiveData]);
    return (
        <>
            {' '}
            <PageHeading title={'sensiCOUNT'} />
            <Row style={{ marginLeft: '10px' }}>
                <Col lg={3}>
                    <UnitSelectedWidget
                        unitName={sensorName ? sensorName : 'Sensor'}
                        location={locationData?.building ? locationData?.building : ''}
                        floor={locationData?.zoneName ? locationData?.zoneName : '	'}
                        building={locationData?.floor ? locationData?.floor : ''}
                        deviceState={true}
                        swithDisabled={true}
                    />
                </Col>
                <Col lg={3}>
                    <HeadbandWidget
                        title=" Total Count"
                        value={realTimeData?.inCount ?? '-'}
                        lastUpdated={lastUpdated}
                    />
                    {/* kj */}
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px', padding: '10px', marginTop: '20px' }}>
                <TrendsChart sensorName={sensorName} />
            </Row>
        </>
    );
};
export default OccupancyDevicePage;
