import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
// import TempeartureIcon from 'assets/icons/thermometer.png';
// import Humidity from 'assets/icons/weather.png';
// import CarbonDioxide from 'assets/icons/co2-cloud.png';

// import InteractiveBackgroundWidget from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidget';

// import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
// import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
// import { convertUnixToIST } from 'utils/timeFunctions';
// import { roundToOneDecimal } from 'utils/maths';
import { useLocation } from 'react-router-dom';
import PlainWidget from 'components/ClaircoCustomerDashboard/Widgets/PlainWidget';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import TrendsChart from './TrendsChart';
import { getIndoorUnitLiveData } from 'helpers/api/services/Clairco/adminSide/indoorDevices';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
// import GaugeChartIAQ from './GaugeChartIAQ.tsx';
const IndoorUnitDevicePage = () => {
    // const [pmData, setPmData] = useState<any>([]);
    const [sensorName, setSensorName] = useState<any>('');
    const [locationInfo, setLocationInfo] = useState<any>({ floor: '', location: '', sensorName: '', building: '' });
    const [cardData, setCardData] = useState<{
        fanSpeed: string;
        lastUpdated: string;
        ambTemp: string;
        setTemp: string;
        mode: string;
        status: string;
    }>({
        fanSpeed: '',
        lastUpdated: '',
        ambTemp: '',
        setTemp: '',
        mode: '',
        status: '',
    });
    // const [lastUpdated, setLastUpdated] = useState('');

    const location = useLocation();
    const getIndoorCardData = async (sensorName: string) => {
        try {
            if (!sensorName) return;
            const deviceTypeId1 = deviceTypeId['VRV/VRF'];
            const res: any = (await getIndoorUnitLiveData(deviceTypeId1, sensorName)) ?? {};
            const {
                'Amb Temp': ambTemp = 'N/A',
                'Epoch time': lastUpdated = 'N/A',
                'Fan Speed': fanSpeed = 'N/A',
                Mode: mode = 'N/A',
                'Set Temp': setTemp = 'N/A',
                Status: status = 'N/A',
            } = res?.data;
            setCardData({
                ambTemp,
                lastUpdated: lastUpdated ? convertUnixToIST(lastUpdated) : '',
                fanSpeed,
                mode,
                setTemp,
                status,
            });
            // console.log('Response', res);
        } catch (error) {
            setCardData({
                ambTemp: 'N/A',
                lastUpdated: 'N/A',
                fanSpeed: 'N/A',
                mode: 'N/A',
                setTemp: 'N/A',
                status: 'N/A',
            });
            console.log(error);
        }
    };
    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name') ?? '';
        const building = searchParams.get('building') ?? '';
        const locationName = searchParams?.get('location') ?? '';
        const floor = searchParams.get('floor') ?? '';
        setSensorName(name);
        setLocationInfo({ floor, location: locationName, sensorName: name, building });
    }, [location]);
    useEffect(() => {
        getIndoorCardData(sensorName);
    }, [sensorName]);

    return (
        <>
            <PageHeading title={'Indoor Unit'} />
            <Row className="mx-3">
                {' '}
                <Col xxl={6} xs={12}>
                    {' '}
                    <UnitSelectedWidget
                        unitName={sensorName}
                        location={locationInfo?.location ?? ''}
                        floor={locationInfo?.floor}
                        building={locationInfo?.building}
                        // deviceState={cardData?.status === 'ON' ? true : false}
                        swithDisabled={true}
                        deviceControlFunction={() => ''}
                        deviceState={cardData?.status === 'ON' ? true : false}
                    />
                </Col>
                <Col xxl={3} md={6}>
                    {' '}
                    <PlainWidget title="Occupants" value={''} lastUpdated={cardData?.lastUpdated} />
                </Col>
                <Col xxl={3} md={6}>
                    {' '}
                    <PlainWidget title="Control Mode" value={''} lastUpdated={cardData?.lastUpdated} />
                </Col>
                {/* <Col xxl={3} md={6}></Col> */}
            </Row>
            <Row
                className="mx-3"
                style={{
                    // marginLeft: '400px  !important',
                    marginBottom: '1em',
                }}>
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
                        value={cardData?.ambTemp ? `${cardData?.ambTemp}°C` : '-'}
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
            <Row style={{ marginLeft: '2em' }}>
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
        </>
    );
};

export default IndoorUnitDevicePage;
