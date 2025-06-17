import { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import lodash from 'lodash';
import Collapse from 'react-bootstrap/Collapse';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
// Icons
import Alerts from './Alerts';
import TempeartureIcon from 'assets/icons/thermometer.png';
import Humidity from 'assets/icons/weather.png';
import CarbonDioxide from 'assets/icons/co2-cloud.png';
//Components
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import UnitSelectedWidgetWithoutSwitch from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidgetWithoutSwitch';
import GaugeChartIAQ from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartIAQ';
import GaugeChartVOC from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartVOC';
import PMChart from 'components/ClaircoGauges/AQI/PmChart';
import InteractiveBackgroundWidget from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidget';
import PlainWidgetWithTwoParameters1 from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithTwoParameters1';
// import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
import { IAQToolTip } from 'components/ClaircoToolTip/IAQ/IAQToolTIp';
import TrendsChart from './TrendsChart';
//APIs
import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserIdFromSession } from 'utils/storageFunctions';
import { roundToDecimal, roundToOneDecimal } from 'utils/maths';
// Constants
import { deviceTypeId, deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { toast } from 'sonner';
interface CardData {
    aqi: number;
    temp: number;
    voc: number;
    pm1: number;
    pm10: number;
    pm25: number;
    hum: number;
    co2: number;
    opm10?: number;
    opm25?: number;
    oTemp?: number;
}
// import GaugeChartIAQ from './GaugeChartIAQ.tsx';
const IAQDevicePage = () => {
    // const [pmData, setPmData] = useState<any>([]);
    const [storedData, setStoredData] = useState<any[]>([]);
    const [sensorName, setSensorName] = useState<any>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [locationInfo, setLocationInfo] = useState<any>({ floor: '', location: '', sensorName: '', building: '' });
    const [deviceId, setDeviceId] = useState<any>('');
    const [customerId, setCustomerId] = useState<any>('');
    // Input to select dropdown
    const [buildingList, setBuidingList] = useState<any[]>([]);
    const [floorList, setFloorList] = useState<any[]>([]);
    const [deviceList, setDeviceList] = useState<any>([]);
    // Selections from user
    const [floorSelected, setFloorSelected] = useState<any>({});
    const [buildingSelected, setBuildingSelected] = useState<any>({});
    const [deviceSelected, setDeviceSelected] = useState<any>();
    // Data for Card
    const [cardData, setCardData] = useState<CardData>({
        aqi: 0,
        temp: 0,
        voc: 0,
        pm1: 0,
        pm10: 0,
        pm25: 0,
        hum: 0,
        co2: 0,
        opm10: 0,
        opm25: 0,
        oTemp: 0,
    });
    const [toolTipState, setToolTip] = useState(false);
    const [hoverState, setHoverState] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');
    const [positionValue, setPositionValue] = useState({
        // xValue: 0, yValue: 0
    });
    const [buildingId, setBuildingId] = useState<string>('');
    let timerId: ReturnType<typeof setTimeout>;
    const { buildingId: buildingId1 = '' } = getUserIdFromSession();

    const location = useLocation();
    // const parentRef = useRef(null);
    const navigate = useNavigate();
    const getBuidinglListForSelect = (data: any) => {
        try {
            const buildingMap = new Map();
            buildingMap.set('Others', {
                value: '',
                label: 'None',
            });
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.buildingId?.id)
                    buildingMap.set(data?.[i]?.buildingId?.id, {
                        label: data?.[i]?.buildingId?.name ?? '',
                        value: data?.[i]?.buildingId?.id ?? '',
                    });
            }
            const buildingList = Array.from(buildingMap.values());
            // console.log('Building map', buildingList);
            return buildingList;
        } catch (error) {
            console.log(error);
        }
    };
    const getFloorsListForSelect = (data: any) => {
        try {
            const floorMap = new Map();
            floorMap.set('Others', {
                value: '',
                label: 'None',
            });
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.floorId?.id)
                    floorMap.set(data?.[i]?.floorId?.id, {
                        value: data?.[i]?.floorId?.id,
                        label: data?.[i]?.floorId?.name,
                    });
            }
            const floorList = Array.from(floorMap.values());
            return floorList;
        } catch (error) {
            console.log(error);
        }
    };
    const getDeviceListForSelection = (data: any) => {
        try {
            const deviceList = data?.map((doc: any) => ({
                label: `${doc?.buildingId?.name + ' / ' + doc?.floorId?.name + ' / ' + doc?.name}`,
                value: {
                    name: doc?.name,
                    buildingName: doc?.buildingId?.name,
                    locationName: doc?.locationId?.name,
                    floorName: doc?.floorId?.name,
                    deviceId: doc?.id,
                    customerId: doc?.customerId?.id,
                    buildingId: doc?.buildingId?.id,
                },
            }));
            return deviceList;
        } catch (error) {
            console.log(error);
        }
    };
    // console.log('Sensor Name:', sensorName);
    const getBuildingAndDeviceList = async (customerId: string) => {
        try {
            const device = deviceTypesConstant.IAQ;
            const response = await fetchDevicesList(device, customerId, '', buildingId1 ?? '');
            const buildingsList = getBuidinglListForSelect(response?.data ?? []);
            const floorList = getFloorsListForSelect(response?.data ?? []);
            const deviceList = getDeviceListForSelection(response?.data ?? []);
            // console.log('Device List', deviceList);
            setStoredData(response?.data ?? []);
            setBuidingList(buildingsList ?? []);
            setFloorList(floorList ?? []);
            setDeviceList(deviceList);
        } catch (error) {
            console.log(error);
        }
    };
    const getAQICardData = async () => {
        try {
            if (!sensorName) return;
            const Id = deviceTypeId['IAQ'];
            // const sensorName = 'IAQ24011';
            const response = await getIaqData({
                sensorName,
                deviceTypeId: Id,
            });

            const data = response?.data;
            console.log('IAQ cards', response, data);
            const {
                VOC = 0,
                TEMP = 0,
                AQI = 0,
                PM1 = 0,
                PM10 = 0,
                PM25 = 0,
                HUM = 0,
                CO2 = 0,
                timestamp = 0,
                OPM10 = 0,
                OPM25 = 0,
                OTemp = 0,
            } = data;
            setCardData({
                aqi: AQI ? Number(roundToDecimal(AQI)) : 0,
                voc: VOC ? Number(roundToDecimal(VOC)) : 0,
                temp: TEMP ? Number(roundToDecimal(TEMP)) : 0,
                pm1: PM1 ? Number(roundToDecimal(PM1)) : 0,
                pm10: PM10 ? Number(roundToDecimal(PM10)) : 0,
                pm25: PM25 ? Number(roundToDecimal(PM25)) : 0,
                hum: HUM ? Number(roundToDecimal(HUM)) : 0,
                co2: CO2 ? Number(roundToDecimal(CO2)) : 0,
                opm10: OPM10 ? Number(roundToDecimal(OPM10)) : 0,
                opm25: OPM25 ? Number(roundToDecimal(OPM25)) : 0,
                oTemp: OPM25 ? Number(roundToDecimal(OTemp)) : 0,
            });
            setLastUpdated(convertUnixToIST(timestamp));
        } catch (error) {
            console.log(error);
            toast.error(typeof error === 'string' ? error : 'Something went wrong');
            setCardData({
                aqi: 0,
                temp: 0,
                voc: 0,
                pm1: 0,
                pm10: 0,
                pm25: 0,
                hum: 0,
                co2: 0,
                opm10: 0,
                opm25: 0,
                oTemp: 0,
            });
        }
    };
    const handleOnHover = (e: React.MouseEvent<Element>, state: string) => {
        try {
            // console.log('e', e, state);
            e.stopPropagation();
            const position = {
                xValue: e.pageX - 300,
                yValue: e.pageY + 20,
            };
            setPositionValue({ ...position });
            setHoverState((currentState) => state);
            // setToolTip((currentState) => !currentState);
            clearTimeout(timerId);
            timerId = setTimeout(() => setToolTip((currentState) => !currentState), 350);
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnMouseLeave = lodash.debounce((e: any) => {
        try {
            // console.log('Mouse Leave:');
            setToolTip(false);
        } catch (error) {
            console.log(error);
        }
    }, 3000);
    const closeTooltip = () => {
        setToolTip(false);
    };
    const filterFloorsBasedOnBuilding = (buildingId: string) => {
        try {
            let filterdFloors = [];
            if (!buildingId) {
                // const floorList = getFloorsListForSelect(floorList);
                // setFloorList(floorList ?? []);
                const floorList1 = getFloorsListForSelect(storedData);
                setFloorList(floorList1 ?? []);
                return;
            }
            filterdFloors = storedData.filter((item: any) => item?.buildingId?.id === buildingId);
            const floorList1 = getFloorsListForSelect(filterdFloors);
            // console.log('Floor Selection', storedData, filterdFloors);
            setFloorList(floorList1 ?? []);
        } catch (error) {
            console.log(error);
        }
    };
    const filterDeviceBasedOnFloorSelection = (e: any) => {
        try {
            // console.log('FLoors:', e);
            if (e.value) {
                const filterdFloors = storedData.filter((item: any) => item?.floorId?.id === e.value);
                const deviceList = getDeviceListForSelection(filterdFloors);
                setDeviceList(deviceList);
                return;
            } else {
                // const filterdFloors = storedData.filter((item: any) => item?.floorId?._id === e.value);
                const filterdFloors = storedData.filter(
                    (item: any) => item?.buildingId?.id === buildingSelected?.value
                );
                // console.log('Fileterd floor', filterdFloors);
                const deviceList = getDeviceListForSelection(filterdFloors);
                setDeviceList(deviceList ?? []);
                return;
            }
            // console.log('Filterd Floors', deviceList, filterdFloors);
        } catch (error) {
            console.log(error);
        }
    };
    const handleFilterSelection = (e: any, state: string) => {
        try {
            switch (state) {
                case 'building':
                    filterFloorsBasedOnBuilding(e.value);
                    setBuildingSelected(e);
                    setFloorSelected({});
                    setDeviceSelected({});
                    // setDeviceList([]);
                    // setBuildingSelected(e);
                    break;
                case 'floor':
                    filterDeviceBasedOnFloorSelection(e);
                    setFloorSelected(e);
                    setDeviceSelected({});
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilters = (e: any) => {
        try {
            console.log(e);
            setShowFilters((current) => !current);
        } catch (error) {
            console.log(error);
        }
    };
    //Floor Selection Navigation Function
    const handleDeviceSelection = (e: any) => {
        setDeviceSelected(e);
        try {
            const {
                buildingName = '',
                customerId = '',
                deviceId = '',
                floorName = '',
                locationName = '',
                name = '',
                buildingId = '',
            } = e?.value;
            // console.log(e);

            const searchParam = new URLSearchParams();
            searchParam.append('name', name);
            searchParam.append('building', buildingName);
            searchParam.append('location', locationName);
            searchParam.append('floor', floorName);
            searchParam.append('deviceId', deviceId);
            searchParam.append('customerId', customerId);
            searchParam.append('buildingId', buildingId);

            let url = `/admin/pages/iaq/${searchParam.toString()}`;

            navigate(url);
        } catch (error) {
            console.log(error);
        }
    };

    // // Side Effects
    useEffect(() => {
        window.addEventListener('click', closeTooltip);
        return () => {
            window.removeEventListener('click', closeTooltip);
        };
    }, []);
    useEffect(() => {
        if (customerId) getBuildingAndDeviceList(customerId);
    }, [customerId]);
    useEffect(() => {
        getAQICardData();
    }, [sensorName]);
    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        // console.log('URL:', searchParams.toString(), path);
        const name = searchParams.get('name');
        const building = searchParams.get('building');
        const locationName = searchParams?.get('location');
        const floor = searchParams.get('floor');
        const deviceId = searchParams.get('deviceId');
        const customerId = searchParams.get('customerId');
        const buildingId = searchParams.get('buildingId') ?? '';
        setDeviceId(deviceId ?? '');
        setCustomerId(customerId);
        setSensorName(name);
        setBuildingId(buildingId);
        setLocationInfo({ floor, location: locationName, sensorName: name, building });
    }, [location]);
    // useEffect(() => {
    //     // console.log('Filter status', showFilters);
    // }, [showFilters]);
    return (
        <>
            {/* {toolTipState &&  */}
            <IAQToolTip show={toolTipState} positionValues={positionValue} currentState={hoverState} />
            {/* } */}
            <Row style={{ marginLeft: '10px', marginTop: '0em' }}>
                <Col xxl={3}>
                    <PageHeading title={'IAQ'} />
                </Col>
                <Col xxl={3} style={{ marginTop: '1em' }}>
                    <Select
                        options={buildingList ?? []}
                        onChange={(e) => handleFilterSelection(e, 'building')}
                        placeholder={'Select Building'}
                        value={buildingSelected?.label ? buildingSelected : null}
                    />
                </Col>
                <Col style={{ marginTop: '1em' }} xxl={3}>
                    <Select
                        options={floorList}
                        onChange={(e) => handleFilterSelection(e, 'floor')}
                        placeholder={'Select Floor'}
                        value={floorSelected?.label ? floorSelected : null}
                    />
                </Col>
                <Col style={{ marginTop: '1em' }} xxl={3}>
                    {' '}
                    <Select
                        options={deviceList}
                        onChange={handleDeviceSelection}
                        placeholder={'Select Device'}
                        value={deviceSelected?.label ? deviceSelected : null}
                    />
                </Col>
                <Col></Col>
            </Row>
            {/*  */}
            <Row style={{ marginLeft: '10px' }}>
                <Col xxl={3} md={6}>
                    {' '}
                    <UnitSelectedWidgetWithoutSwitch
                        unitName={sensorName ?? ''}
                        location={locationInfo?.location ?? ''}
                        floor={locationInfo?.floor}
                        building={locationInfo?.building}
                        deviceState={true}
                        swithDisabled={true}
                    />
                    <Alerts />
                    {/* <Row style={{ marginTop: '1em' }}></Row>{' '} */}
                </Col>
                <Col xxl={3} md={6} onMouseLeave={handleOnMouseLeave}>
                    <PMChart data={cardData} lastUpdated={lastUpdated} infoClickFn={handleOnHover} />
                </Col>
                <Col
                    xxl={3}
                    md={6}
                    //  onMouseEnter={(e) => handleOnHover(e, 'AQI')}
                    onMouseLeave={handleOnMouseLeave}>
                    <GaugeChartIAQ
                        property=""
                        value={cardData.aqi ?? 0}
                        deviceName=""
                        lastUpdated={lastUpdated}
                        infoClickFn={handleOnHover}
                    />
                </Col>
                <Col xxl={3} md={6} onMouseLeave={handleOnMouseLeave}>
                    <GaugeChartVOC
                        property=""
                        value={
                            // 200
                            cardData.voc ?? 0
                        }
                        deviceName=""
                        lastUpdated={lastUpdated}
                        infoClickFn={handleOnHover}
                        // infoClickFn={handleOnHover}
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px' }}>
                {' '}
                <Col xxl={3} md={6}>
                    {/* <DownloadSection /> */}
                    <PlainWidgetWithTwoParameters1
                        title1="Outdoor PM 2.5"
                        value1={cardData?.pm25 ? cardData?.opm25 : 'Na'}
                        unit1="µg/m³"
                        title2="Outdoor PM 10"
                        value2={cardData?.pm10 ? cardData?.opm10 : 'Na'}
                        unit2="µg/m³"
                        lastUpdated={lastUpdated ? lastUpdated : ''}
                    />
                </Col>
                <Col xxl={3} md={6}>
                    <InteractiveBackgroundWidget
                        name={'Temperature'}
                        value={cardData.temp ?? '-'}
                        unit={'°C'}
                        lastUpdated={lastUpdated ?? ''}
                        icon={TempeartureIcon}
                    />
                </Col>
                <Col xxl={3} md={6}>
                    <InteractiveBackgroundWidget
                        name={'Humidity'}
                        value={cardData.hum ?? '-'}
                        unit={'%'}
                        lastUpdated={lastUpdated ?? ''}
                        icon={Humidity}
                    />
                </Col>
                <Col xxl={3} md={6} onMouseLeave={handleOnMouseLeave}>
                    <InteractiveBackgroundWidget
                        name={'CO₂'}
                        value={cardData.co2 ?? '-'}
                        unit={'ppm'}
                        lastUpdated={lastUpdated ?? ''}
                        icon={CarbonDioxide}
                        infoClickFn={handleOnHover}
                        infoClickName={'CO2'}
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px' }}>
                {/* <Col sm={3}></Col>
                <Col sm={9}> */}
                <TrendsChart sensorName={sensorName} deviceId={deviceId} buildingId={buildingId} />
                {/* </Col> */}
            </Row>
            {/* <GaugeChartIAQ property={''} value={25} deviceName={''} /> */}
        </>
    );
};

export default IAQDevicePage;
