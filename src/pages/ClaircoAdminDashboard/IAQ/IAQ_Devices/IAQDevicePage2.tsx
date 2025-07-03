import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import { useEffect, useRef, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import GaugeChartIAQ from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartIAQ';
import GaugeChartVOC from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartVOC';
import PMChart from 'components/ClaircoGauges/AQI/NewGauges/PmChart';
import Alerts from './Alerts';
import TempeartureIcon from 'assets/icons/thermometer.png';
import Humidity from 'assets/icons/weather.png';
import CarbonDioxide from 'assets/icons/co2-cloud.png';
import lodash from 'lodash';

import Select from 'react-select';

// import InteractiveBackgroundWidget from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidget';
import TrendsChart from './TrendsChart';
import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import { deviceTypeId, deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
import { roundToOneDecimal } from 'utils/maths';

import { useLocation, useNavigate } from 'react-router-dom';
// import PlainWidgetWithTwoParameters1 from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithTwoParameters1';
import { IAQToolTip } from 'components/ClaircoCustomerDashboard/ToolTip/IAQToolTIp';
// import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
// import { searchOptions } from 'layouts/Topbar/data';
import { getUserIdFromSession } from 'utils/storageFunctions';
// import InteractiveBackgroundWidgetTEST from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidgetB';
import InteractiveBackgroundWidgetB from 'components/ClaircoCustomerDashboard/Widgets/InteractiveBackgroundWidgetB';
import PlainWidgetWithTwoParameters2 from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithTwoParameters2';
import CardLoadingSkelton from 'components/ClaircoSkeltonLoaders/CardLoadingSkelton';
import ErrorComponent from './ErrorComponent';
interface CardData {
    aqi?: number;
    temp?: number;
    voc?: number;
    pm1?: number;
    pm10?: number;
    pm25?: number;
    hum?: number;
    co2?: number;
    opm10?: number;
    opm25?: number;
    oTemp?: number;
}
// import GaugeChartIAQ from './GaugeChartIAQ.tsx';
const IAQDevicePage = () => {
    const [pmData, setPmData] = useState<any>([]);
    const [sensorName, setSensorName] = useState<any>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [locationInfo, setLocationInfo] = useState<any>({ floor: '', location: '', sensorName: '', building: '' });
    const [deviceId, setDeviceId] = useState<any>('');

    const [customerId, setCustomerId] = useState<any>('');
    const [buildingList, setBuidingList] = useState<any[]>([]);
    const [storedData, setStoredData] = useState<any[]>([]);
    const [floorSelected, setFloorSelected] = useState<any>({});
    const [buildingSelected, setBuildingSelected] = useState<any>({});
    const [deviceSelected, setDeviceSelected] = useState<any>();
    const [floorList, setFloorList] = useState<any[]>([]);
    const [deviceList, setDeviceList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
    const [error, setError] = useState<boolean>(false);
    const [columnSize, setColumnSize] = useState<number>(3);

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
                label: 'All',
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
                label: 'All',
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
            // const name = data?.name ?? '';
            // const buildingName = data?.buildingId?.name ?? '';
            // const locationName = data?.locationId?.name ?? '';
            // const floorName = data?.floorId?.name ?? '';
            // const deviceId = data?._id ?? '';
            // const customerId = data?.customerId?._id;
            const deviceId = deviceTypesConstant['IAQ'];
            const response = await fetchDevicesList(deviceId, customerId, '', buildingId1 ?? '');
            const buildingsList = getBuidinglListForSelect(response?.data?.records ?? []);
            const floorList = getFloorsListForSelect(response?.data?.records ?? []);
            const deviceList = getDeviceListForSelection(response?.data?.records ?? []);
            // console.log('Device List', buildingsList, floorList);
            setStoredData(response?.data?.records ?? []);
            setBuidingList(buildingsList ?? []);
            setFloorList(floorList ?? []);
            setDeviceList(deviceList);
        } catch (error) {
            console.log(error);
        }
    };
    //Checks weather the input received from the API qualifies as a PM Combo case
    const isPmComboCheck = (inputParameters: any[]) => {
        const pmCombo: string[] = ['PM10', 'PM25', 'OPM10', 'OPM25'];
        const hasOnlyPmComboKeys = inputParameters.every((key) => pmCombo.includes(key.toString()));
        const hasAllPmComboKeys = pmCombo.every((key) => inputParameters.includes(key.toString()));
        if (hasOnlyPmComboKeys && hasAllPmComboKeys) {
            return true;
        }
        return false;
    };
    const getAQICardData = async () => {
        try {
            if (!sensorName) return;
            setError(false);
            setIsLoading(true);
            const Id = deviceTypeId['IAQ'];
            const response = await getIaqData({
                sensorName,
                deviceTypeId: Id,
            });
            console.log('Response', response);

            const data = response?.data?.[0] ?? {};
            // const data = sampleTableTestData[0] as any;
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

            const calculateCount = (inputObject: { [key: string]: string | number }) => {
                const inputParameters = Object.entries(inputObject)
                    .filter(([key, value]: (string | number)[]) => value)
                    .map(([key, value]: (string | number)[]) => key);
                const isPmCombo = isPmComboCheck(inputParameters);
                if (isPmCombo) {
                    return 4;
                }
                return 3;

                // let count = inputParameters.length;
                // if (inputParameters.includes('OPM10') && inputParameters.includes('OPM25')) {
                //     count--;
                // }
                // if (inputParameters.includes('PM10') && inputParameters.includes('PM25')) {
                //     count--;
                // }

                // // if (inputParameters.includes(OPM10) || inputParameters.includes(OPM25)) {
                // //     count++;
                // //     delete inputObject.OPM10;
                // //     delete inputObject.OPM25;
                // // }
                // // for (const [key, value] of Object.entries(inputObject)) {
                // //     if (value) count++;
                // // }

                // const col = Math.floor(12 / count);
                // return col;
                // if(count)
                // if (inputParameters.includes('OPM10') || inputParameters.includes('OPM25')) {
                //     count--;
                // }
                // if (inputParameters.includes('PM10') || inputParameters.includes('PM25')) {
                //     count--;
                // }
            };

            const colSize = calculateCount({
                VOC,
                TEMP,
                AQI,
                PM10,
                PM25,
                HUM,
                CO2,
                OPM10,
                OPM25,
            });
            // console.log('Col size', colSize);
            setColumnSize(colSize);
            setCardData({
                aqi: roundToOneDecimal(Number(AQI)),
                voc: roundToOneDecimal(Number(VOC)),
                temp: roundToOneDecimal(Number(TEMP)),
                pm1: roundToOneDecimal(Number(PM1)),
                pm10: roundToOneDecimal(Number(PM10)),
                pm25: roundToOneDecimal(Number(PM25)),
                hum: roundToOneDecimal(Number(HUM)),
                co2: roundToOneDecimal(Number(CO2)),
                opm10: roundToOneDecimal(Number(OPM10)),
                opm25: roundToOneDecimal(Number(OPM25)),
                oTemp: roundToOneDecimal(Number(OTemp)),
            });
            setLastUpdated(convertUnixToIST(timestamp));
        } catch (error) {
            console.log(error);
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
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };
    const handleOnHover = (e: React.MouseEvent<Element>, state: string) => {
        try {
            // console.log('e', e, state);
            e.stopPropagation();
            const position = {
                // xValue: e.screenX,
                // yValue: e.screenY,
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
            filterdFloors = storedData?.filter((item: any) => item?.buildingId?.id === buildingId);
            const floorList1 = getFloorsListForSelect(filterdFloors);
            console.log('Floor Selection', storedData, buildingId);
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
            console.log('Filters', e, state);
            switch (state) {
                case 'building':
                    filterFloorsBasedOnBuilding(e?.value);
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

            let url = `/customer/iaq-home/${searchParam.toString()}`;

            navigate(url);
        } catch (error) {
            console.log(error);
        }
    };
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
                {' '}
                <Col xxl={3}>
                    <PageHeading title={'IAQ'} />
                </Col>
                {/* Filters */}
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
                    <Select
                        options={deviceList}
                        onChange={handleDeviceSelection}
                        placeholder={'Select Device'}
                        value={deviceSelected?.label ? deviceSelected : null}
                    />
                </Col>
                <Col></Col>
            </Row>

            <Row
                className="g-3"
                style={{
                    marginLeft: '10px',
                    marginBottom: '2em',
                    flexGrow: '1',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                }}>
                {/* Unit name and ALerts */}
                <Col xxl={columnSize} md={6}>
                    {' '}
                    <UnitSelectedWidget
                        unitName={sensorName}
                        location={locationInfo?.location ?? ''}
                        floor={locationInfo?.floor}
                        building={locationInfo?.building}
                        deviceState={true}
                        swithDisabled={true}
                    />
                    <Alerts />
                    <Row style={{ marginTop: '1em' }}></Row>{' '}
                </Col>
                {/* Skelton Component */}
                {isLoading
                    ? Array(7)
                          .fill(0)
                          .map(() => (
                              <Col xxl={3} md={6}>
                                  <CardLoadingSkelton />
                              </Col>
                          ))
                    : null}
                {/* Error Componenent */}
                {!isLoading && error && <ErrorComponent isError={error} />}
                {/* PM CARD */}
                {(cardData.pm25 || cardData.pm10) && !isLoading ? (
                    <Col xxl={columnSize} md={6} onMouseLeave={handleOnMouseLeave}>
                        <PMChart data={cardData} lastUpdated={lastUpdated} infoClickFn={handleOnHover} />
                        {/* <CardLoadingSkelton /> */}
                    </Col>
                ) : null}
                {/* AQI Card */}
                {cardData.aqi && !isLoading ? (
                    <Col
                        xxl={columnSize ?? 3}
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
                ) : null}
                {/* VOC Card */}
                {cardData.voc && !isLoading ? (
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
                ) : null}
                {(cardData.opm25 || cardData.opm10) && !isLoading ? (
                    <Col xxl={columnSize ?? 3} md={6}>
                        <PlainWidgetWithTwoParameters2
                            name="Outdoor Particulate Matter"
                            title1="PM 2.5"
                            value1={cardData?.opm25 ? cardData?.opm25 : 'Na'}
                            unit1="µg/m³"
                            title2="PM 10"
                            value2={cardData?.opm10 ? cardData?.opm10 : 'Na'}
                            unit2="µg/m³"
                            infoClickFn={handleOnHover}
                            lastUpdated={lastUpdated ? lastUpdated : ''}
                        />
                    </Col>
                ) : null}
                {cardData.temp && !isLoading ? (
                    <Col xxl={3} md={6}>
                        <InteractiveBackgroundWidgetB
                            name={'Temperature'}
                            value={cardData.temp ?? '-'}
                            unit={'°C'}
                            lastUpdated={lastUpdated ?? ''}
                            icon={TempeartureIcon}
                        />
                    </Col>
                ) : null}
                {cardData.hum && !isLoading ? (
                    <Col xxl={3} md={6}>
                        <InteractiveBackgroundWidgetB
                            name={'Humidity'}
                            value={cardData.hum ?? '-'}
                            unit={'%'}
                            lastUpdated={lastUpdated ?? ''}
                            icon={Humidity}
                        />{' '}
                    </Col>
                ) : null}
                {cardData.co2 && !isLoading ? (
                    <Col xxl={3} md={6} onMouseLeave={handleOnMouseLeave}>
                        <InteractiveBackgroundWidgetB
                            name={'CO₂'}
                            value={cardData.co2 ?? '-'}
                            unit={'ppm'}
                            lastUpdated={lastUpdated ?? ''}
                            icon={CarbonDioxide}
                            infoClickFn={handleOnHover}
                            infoClickName={'CO2'}
                        />
                    </Col>
                ) : null}
                {/* Playground */}
                {/* <Col xxl={3} md={6}>
                    <Card
                        style={{ width: '100%', height: '50%', maxHeight: '23.5em', margin: '0px', overflow: 'clip' }}>
                        {' '}
                        <Card.Body style={{ padding: '0' }}>
                            <div
                                className="h-25"
                                style={{
                                    display: 'flex',
                                    padding: '0px',
                                    justifyContent: 'center',
                                    alignItems: 'start',
                                }}>
                                <h5 style={{ padding: '10px', paddingLeft: '15px' }}>{'name'}</h5>{' '}
                                <div
                                    // className="mt-2"
                                    style={{ display: 'flex', alignItems: 'center', marginTop: '18px' }}>
                                    {' '}
                                    ji{' '}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col> */}
            </Row>
            {/* <Row>
                {' '}
                <InteractiveBackgroundWidgetB
                    name={'CO₂'}
                    value={cardData.co2 ?? '-'}
                    unit={'ppm'}
                    lastUpdated={lastUpdated ?? ''}
                    icon={CarbonDioxide}
                    infoClickFn={handleOnHover}
                    infoClickName={'CO2'}
                />
            </Row> */}
            <Row style={{ marginLeft: '10px' }}>
                <TrendsChart sensorName={sensorName} deviceId={deviceId} buildingId={buildingId} />
            </Row>
        </>
    );
};

export default IAQDevicePage;
