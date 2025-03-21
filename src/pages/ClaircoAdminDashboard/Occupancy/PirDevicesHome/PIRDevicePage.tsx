import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import TrendsChart from './TrendsChart';
import { useLocation } from 'react-router-dom';
import { set } from 'lodash';
import { getOccupancyTrendsData } from 'helpers/api/services/Clairco/customerSide/occupancy';
import { chownSync } from 'fs';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
interface LocationState {
    name?: string;
}
const PIRDevicePage = () => {
    const location = useLocation();
    const [sensorName, setSensorName] = React.useState('');
    const [realTimeData, setRealTimeData] = React.useState<any>({});
    const [lastUpdated, setLastUpdated] = React.useState('');
    const [locationData, setLocationData] = React.useState<any>({});
    // const state = location.state as LocationState;
    // const zoneName = state?.name ?? '';

    // console.log('Location:', zoneName);

    const getLiveData = useCallback(async (sensorName) => {
        if (!sensorName) return;
        const deviceType = deviceTypeId['PIR'];
        const res = await getOccupancyTrendsData({ sensorName, deviceTypeId: deviceType });
        let latestData = res.data;
        const latestTime = convertUnixToIST(latestData?.['Epoch time']);
        let occupiedOrNot =
            latestData.data.OCCUPANCY === 1 ? 'Occupied' : latestData.data.OCCUPANCY === 0 ? 'Unoccupied' : '-';
        setRealTimeData({ ...latestData?.data, OCCUPANCY: occupiedOrNot });
        setLastUpdated(latestTime);
    }, []);

    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path?.split('/')?.pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name');
        const building = searchParams.get('building');
        const floor = searchParams.get('floor');
        const zoneName = searchParams.get('zoneName');

        setSensorName(name ?? '');
        setLocationData({ building: building ?? '', floor: floor ?? '', zoneName: zoneName ?? '' });
        getLiveData(name);
        // console.log('URL:', name, building, floor, zoneName);
    }, [location]);
    return (
        <>
            {' '}
            <PageHeading title={'Occupancy'} />
            <Row style={{ marginLeft: '10px' }}>
                <Col lg={3}>
                    <UnitSelectedWidget
                        unitName={sensorName ? sensorName : 'Sensor'}
                        location={locationData?.building ? locationData?.building : 'Building'}
                        floor={locationData?.zoneName ? locationData?.zoneName : 'Zone'}
                        building={locationData?.floor ? locationData?.floor : 'Floor'}
                        deviceState={true}
                        swithDisabled={true}
                    />
                </Col>
                <Col lg={3}>
                    <HeadbandWidget
                        title=" Zone Temperature"
                        value={realTimeData?.RTEMP ? `${realTimeData?.RTEMP}°C` : '-'}
                        lastUpdated={lastUpdated}
                    />
                </Col>
                <Col lg={3}>
                    <HeadbandWidget
                        title="Humidity"
                        value={realTimeData?.HUMI ? `${realTimeData?.HUMI}%` : '-'}
                        lastUpdated={lastUpdated}
                    />
                </Col>
                <Col lg={3}>
                    <HeadbandWidget
                        title="Occupancy"
                        value={realTimeData?.OCCUPANCY ? `${realTimeData?.OCCUPANCY}` : '-'}
                        lastUpdated={lastUpdated}
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px', padding: '10px', marginTop: '20px' }}>
                <TrendsChart sensorNameoCCU={sensorName} />
            </Row>
        </>
    );
};
export default PIRDevicePage;
