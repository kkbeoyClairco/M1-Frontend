import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useCallback, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import TrendsChart from './TrendsChart';
import { useLocation } from 'react-router-dom';
import { getPcsTrendsData } from 'helpers/api/services/Clairco/customerSide/occupancy';
import Pressure from 'assets/icons/flexibility.png';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
import GaugeChartVOC from './GaugeChartVOC';
import InteractiveBackgroundWidget from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidget';
// import { getSensiableIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
// import useInterval from 'use-interval';
interface LocationState {
    name?: string;
}
const SensiableDevicesPage = () => {
    const location = useLocation();
    const [sensorName, setSensorName] = React.useState('');
    const [realTimeData, setRealTimeData] = React.useState<any>({});
    const [lastUpdated, setLastUpdated] = React.useState('');
    const [locationData, setLocationData] = React.useState<any>({});
    const state = location.state as LocationState;
    // const zoneName = state?.name ?? '';

    // console.log('Location:', zoneName);

    const getLiveData = useCallback(async (sensorName: string) => {
        if (!sensorName) return;
        // const timeFrameInHours = 1;
        // const deviceType = '';
        //  deviceTypeId['PIR'];
        const response: any = { data: { data: {} } };
        //  await getSensiableIaqData(sensorName, '');
        let latestData = response?.data?.data ?? {};
        const latestTime = convertUnixToIST(latestData?.['timestamp']);
        const { Pa = '', VOC = '' } = latestData;
        // let occupiedOrNot =
        //     latestData.data.OCCUPANCY === 1 ? 'Occupied' : latestData.data.OCCUPANCY === 0 ? 'Unoccupied' : '-';
        // setRealTimeData({ ...latestData?.data, OCCUPANCY: occupiedOrNot });
        setLastUpdated(latestTime);
        setRealTimeData({ Pressure: Pa ?? '', VOC: VOC ?? '' });
    }, []);
    // useInterval(() => getLiveData(sensorName), 5000);
    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name');
        const building = searchParams.get('building');
        const floor = searchParams.get('floor');
        const zoneName = searchParams.get('zone');

        setSensorName(name ?? '');
        setLocationData({ building: building ?? '', floor: floor ?? '', zoneName: zoneName ?? '' });
        getLiveData(name ?? '');
        // console.log('URL:', name, building, floor, zoneName);
    }, [location]);

    return (
        <>
            {' '}
            <PageHeading title={'OdourClair'} />
            <Row style={{ marginLeft: '1em' }}>
                <Col lg={4}>
                    <UnitSelectedWidget
                        unitName={sensorName ? sensorName : 'Sensor'}
                        location={locationData?.building ? locationData?.building : ''}
                        floor={locationData?.zoneName ? locationData?.zoneName : ''}
                        building={locationData?.floor ? locationData?.floor : ''}
                        deviceState={true}
                        swithDisabled={true}
                    />
                    <div className=" mt-1" style={{ marginLeft: '2px' }}>
                        {/* <InteractiveBackgroundWidget
                            name={'Pressure'}
                            value={Number(realTimeData?.Pressure) ?? ' '}
                            unit={'Pa'}
                            lastUpdated={lastUpdated ?? ''}
                            icon={Pressure}
                        /> */}
                    </div>
                </Col>
                <Col lg={4}>
                    <GaugeChartVOC property={''} value={0.53} deviceName={''} lastUpdated={lastUpdated} />
                </Col>{' '}
                {/* <Col lg={4}>
                    <HeadbandWidget
                        title="VOC"
                        value={realTimeData?.HUMI ? `${realTimeData?.HUMI}%` : '-'}
                        lastUpdated={lastUpdated}
                    />
                </Col> */}
            </Row>
            <Row style={{ marginLeft: '10px', padding: '10px', marginTop: '0' }}>
                <TrendsChart sensorName={sensorName} />
            </Row>
        </>
    );
};
export default SensiableDevicesPage;
