import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import TempeartureIcon from 'assets/icons/thermometer.png';
import Humidity from 'assets/icons/weather.png';
import CarbonDioxide from 'assets/icons/co2-cloud.png';

import InteractiveBackgroundWidget from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidget';

import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
import { roundToOneDecimal } from 'utils/maths';
import { useLocation } from 'react-router-dom';
import PlainWidget from 'components/ClaircoCustomerDashboard/Widgets/PlainWidget';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import TrendsChart from './TrendsChart';
// import GaugeChartIAQ from './GaugeChartIAQ.tsx';
const IndoorUnitDevicePage = () => {
    const [pmData, setPmData] = useState<any>([]);
    const [sensorName, setSensorName] = useState<any>('');
    const [locationInfo, setLocationInfo] = useState<any>({ floor: '', location: '', sensorName: '', building: '' });
    const [cardData, setCardData] = useState({
        fanSpeed: '',
        lastUpdated: '',
        zoneTemp: '',
        setTemp: '',
        mode: '',
        status: '',
    });
    const [lastUpdated, setLastUpdated] = useState('');

    const location = useLocation();
    const getIndoorCardData = async () => {
        try {
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name');
        const building = searchParams.get('building');
        const locationName = searchParams?.get('location');
        const floor = searchParams.get('floor');
        setSensorName(name);
        setLocationInfo({ floor, location: locationName, sensorName: name, building });
    }, [location]);
    useEffect(() => {
        getIndoorCardData();
    }, [sensorName]);
    return (
        <div>
            <PageHeading title={'Indoor Unit'} />
            <Row style={{ marginLeft: '10px' }}>
                <Col xxl={4} xs={6}>
                    {' '}
                    <UnitSelectedWidget
                        unitName={sensorName}
                        location={locationInfo?.location ?? ''}
                        floor={locationInfo?.floor}
                        building={locationInfo?.building}
                        deviceState={cardData?.status === 'ON' ? true : false}
                        swithDisabled={true}
                    />
                </Col>
                <Col xxl={2} md={6}>
                    {' '}
                    {/* <PlainWidget title="" value={''} lastUpdated={''} /> */}
                </Col>
                <Col xxl={3} md={6}>
                    {' '}
                    <PlainWidget title="Occupants" value={'2'} lastUpdated={cardData?.lastUpdated} />
                </Col>
                <Col xxl={3} md={6}>
                    {' '}
                    <PlainWidget title="Control Mode" value={cardData?.status} lastUpdated={cardData?.lastUpdated} />
                </Col>
                {/* <Col xxl={3} md={6}></Col> */}
            </Row>
            <Row style={{ marginLeft: '10px', marginBottom: '10px' }}>
                {' '}
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Set Temperature"
                        value={cardData?.setTemp ? `${cardData?.setTemp}°C` : '-'}
                        lastUpdated={cardData.lastUpdated}
                    />{' '}
                </Col>
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Zone Temperature"
                        value={cardData?.zoneTemp ? `${cardData?.zoneTemp}°C` : '-'}
                        lastUpdated={cardData.lastUpdated}
                    />{' '}
                </Col>
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Mode"
                        value={cardData?.mode ? `${cardData?.mode}` : '-'}
                        lastUpdated={cardData.lastUpdated}
                    />{' '}
                </Col>
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Fan Speed"
                        value={cardData?.fanSpeed ? `${cardData?.fanSpeed}` : '-'}
                        lastUpdated={cardData.lastUpdated}
                    />{' '}
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px' }}>
                <TrendsChart
                    // sensorName={sensorName}
                    deviceAliasName={''}
                    deviceName={sensorName}
                    tempFucnction={''}
                    fanSpeedFunction={''}
                    getLastUpdated={() => ''}
                    setIsIndoorDeviceOn={''}
                    setCardData={setCardData}
                />
            </Row>
        </div>
    );
};

export default IndoorUnitDevicePage;
