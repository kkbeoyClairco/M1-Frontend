import LastUpdated from 'components/ClaircoCustomerDashboard/General/LastUpdated/LastUpdated';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import PlainWidget from 'components/ClaircoCustomerDashboard/Widgets/PlainWidget';
import PlainWidgetWithTwoParameters from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithTwoParameters';
import { Col, Row } from 'react-bootstrap';
import IAQDevicesTable from './IAQDevicesTable';
import OccupancyDevicesTable from './OccupancyDeviceTable';
import TimerIcon from 'components/ClaircoCustomerDashboard/Icons/TimerIcon';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';
import PlainWidgetWithUnitsIcon from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithUnitsIcon';
import {
    fetchAHURealTime,
    fetchAverageValuesForAHU,
    fetchBTURealTime,
    fetchOccuAndIaqList,
    fetchRealtimeDPT,
} from 'helpers/api/services/Clairco/customerSide/ahu';
import { convertUnixToIST } from 'utils/timeFunctions';
import { roundToOneDecimal } from 'utils/maths';
import { AHUModeReverseMapping } from 'appConstants/DeviceMappingConstants';
import UnitSelectedWidgetWithControls from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidgetWithControls';
import { useLocation } from 'react-router-dom';
import { getUserInfoFromSession, isAdmin } from 'utils/storageFunctions';
import { DeviceSelectionComponent } from './DeviceSelectionComponent';
import { TwoParameterWidget } from './TwoParameterWidget';
import AHUTrendsChart from 'components/ClaircoTrends/AHU/TrendsChart';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ahuRealTIme, ahuRealTime, averages, btuRealTime, dpt } from 'appConstants/dataToSvg';

interface LocationState {
    sensorName?: string;
    deviceName?: string;
    btuName?: string;
    id?: string;
    floorId?: string;
}
const AHU_DevicePage = () => {
    // const [liveLastUpdated, setLiveLastUpdated] = useState('');
    const [iEnergy, setIEnergy] = useState<any>();
    const [deltaT, setDeltaT] = useState<any>();
    const [temp1, setTemp1] = useState<any>();
    const [temp2, setTemp2] = useState<any>();
    const [netFlow, setNetFlow] = useState<any>();
    const [flowRate, setFlowRate] = useState<any>();
    const [realFanSpeed, setRealFanSpeed] = useState<any>();
    const [realMode, setRealMode] = useState<any>();
    const [realReturnTemp, setRealReturnTemp] = useState<any>();
    const [realSetTemp, setRealSetTemp] = useState<any>();
    const [realLastUpdated, setRealLastUpdated] = useState<any>();
    const [btuRealLastUpdated, setBTURealLastUpdated] = useState<any>();
    const [avgTemp, setAvgTemp] = useState<any>();
    const [avgHumidity, setAverageHumidity] = useState<any>();
    const [occupantsSum, setOccupantsSum] = useState<any>();
    const [IAQTableData, setIAQTableData] = useState([]);
    const [occuTableData, setOccuTableData] = useState<any>([]);
    const [isDeviceOn, setIsDeviceOn] = useState<boolean>();
    const [controlModal, setControlModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [realBTVUalue, setRealBTUValue] = useState<any>();
    const [locationData, setLocationData] = useState<any>();
    const [ahuData, setAhuData] = useState<any>();
    const [btuData, setBtuData] = useState<any>();
    const [thermostatStatus, setThermostatStatus] = useState(false);
    const [dptRealValue, setDptRealValue] = useState<any>();
    const [index, setIndex] = useState(1);
    //   Refs
    const trendsGraphRef = useRef<HTMLDivElement>(null);
    const occupancyRef = useRef<HTMLDivElement>(null);
    const iaqRef = useRef<HTMLDivElement>(null);
    // const sensorName = useRef<any>({});
    // const deviceName = useRef<any>(null);
    // Location
    const location = useLocation();
    // const id = location.pathname.split('/').reverse()[0];
    // const state = location.state as LocationState;

    // const userIsAdmin = isAdmin();
    const { customerId } = getUserInfoFromSession();
    // console.log('Location info:', customerId);
    const fanSpeedReverseMapping: { [key: number]: string } = {
        0: 'High',
        1: 'Medium',
        2: 'Low',
        3: 'Auto',
    };
    // const getRandomNumber = (): number => {
    //     return Math.floor(Math.random() * 4) + 1;
    // };
    // Click Handlers
    const handleBTUClick = async () => {
        if (trendsGraphRef && trendsGraphRef.current) {
            const y = trendsGraphRef?.current.offsetTop;
            window.scrollTo({ top: y - 60, left: 100, behavior: 'smooth' });
        }
    };
    const handleOccupancyClick = async () => {
        try {
            if (occupancyRef && occupancyRef.current) {
                const y = occupancyRef.current.offsetTop;
                window.scrollTo({
                    top: y - 60,
                    left: 100,
                    behavior: 'smooth',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleHumidityClick = async () => {
        try {
            // console.log('Hum Clicked');
            if (iaqRef && iaqRef.current) {
                const y = iaqRef.current.offsetTop;
                window.scrollTo({
                    top: y - 60,
                    left: 100,
                    behavior: 'smooth',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Data Fetching and Manipulation
    // Real time BTU
    const getBTURealTime = useCallback(async (sensorName, idx: any) => {
        // if (!sensorName) return;
        // console.log('BTU Realtime:');
        // const idx = getRandomNumber();

        const res = btuRealTime[idx];
        //  await fetchBTURealTime(sensorName);
        // console.log('Prent id', getDeviceId);
        const lastUpdated = convertUnixToIST(res?.['Epoch time']?.$numberDecimal);
        const instEnergy = roundToOneDecimal(res?.data?.['Instantaneous Energy Rate']);
        const tempOne = roundToOneDecimal(res?.data?.Temp1);
        const tempTwo = roundToOneDecimal(res?.data?.Temp2);
        const netFlowRate = roundToOneDecimal(res?.data?.['Net Flow']);
        const FlowRateInst = roundToOneDecimal(res?.data?.Flowrate);
        const BTUValue = roundToOneDecimal(res?.data?.['Total Energy'] || 0);

        const tempDiff = roundToOneDecimal(tempTwo - tempOne) ?? '-';
        // const lastUpdated = res?.data[0].data['Epoch time'].$numberDecimal;
        // console.log('BTU last updated', lastUpdated);
        setIEnergy(instEnergy);
        setTemp1(tempOne);
        setTemp2(tempTwo);
        setNetFlow(netFlowRate);
        setFlowRate(FlowRateInst);
        setBTURealLastUpdated(convertUnixToIST(new Date()));
        setRealBTUValue(BTUValue);
        setDeltaT(tempDiff);
        // console.log('Res from :', lastUpdated, FlowRateInst, netFlowRate, tempTwo, tempOne, tempDiff, instEnergy);
    }, []);

    // Real Time AHU

    const getRealTimeAHU = useCallback(async (sensorName: any, idx: any) => {
        try {
            // const getDeviceId = await fetchDeviceId(id);
            // console.log('AHU real time sensor Name:', sensorName);
            // if (!sensorName) return;
            // console.log('Index', idx);
            // const idx = getRandomNumber();
            const res: any = ahuRealTime[idx];
            // await fetchAHURealTime(sensorName);
            const mode = res?.data?.MODE || 10;
            // console.log('AHU Real time:', res);
            const fanMode = res?.data?.FANMODE;
            const returnTemp = roundToOneDecimal(+res?.data?.RTEMP) / 10;
            const setTemp = roundToOneDecimal(res?.data?.STEMP) / 10;
            const updatedTime = convertUnixToIST(res?.['Epoch time']?.['$numberDecimal'] ?? 0);
            const currentDeviceStatus = res?.data?.RELAY1_STATE;
            const thermoStat = res?.data?.THSTAT ?? 0;

            // console.log('Res', res, fanMode, returnTemp, setTemp);
            setThermostatStatus(thermoStat);
            setRealFanSpeed(fanSpeedReverseMapping[+fanMode]);
            setIsDeviceOn(currentDeviceStatus ? true : false);
            setRealMode(AHUModeReverseMapping[mode]);
            setRealReturnTemp(returnTemp);
            setRealSetTemp(setTemp);
            setRealLastUpdated(convertUnixToIST(new Date()));
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Occupancy and IAQ Tables
    const getOccupancyAndIaqDevicesList = useCallback(async (ahuId: any) => {
        // if (!ahuId) return;
        // console.log('Occupancy List:');

        const data = ahuRealTIme;
        // await fetchOccuAndIaqList(ahuId);
        // const iaq = data?.iaqDevices ?? [];
        const occupancy = data?.occupancyDevices ?? [];
        // console.log('Data for table', data, occupancy);
        // setIAQTableData(iaq);
        setOccuTableData(occupancy);
    }, []);

    // Average Values
    const getAverageValues = useCallback(async (ahuId: any, idx: any) => {
        // if (!ahuId) return;
        // console.log('Averages :');
        // const idx = getRandomNumber();

        // const averages = averages;
        // await fetchAverageValuesForAHU(ahuId);
        setAverageHumidity(roundToOneDecimal(averages?.[idx]?.avgHumi));
        setAvgTemp(roundToOneDecimal(averages?.[idx]?.avgRtemp));
        setOccupantsSum(roundToOneDecimal(averages?.[idx]?.occupancySum));
        // console.log('averages:', averages);
    }, []);

    //Real time DPT
    const getDPTRealtime = useCallback(async (deviceId: any, idx: any) => {
        try {
            // if (!deviceId) return;
            // const idx = getRandomNumber();

            const response: any = dpt[idx];
            // await fetchRealtimeDPT(deviceId);
            // console.log('DTP');

            const value = roundToOneDecimal(response?.value ?? 0);
            // const dtpLastUpdated = convertUnixToIST(response?.data?.[0]?.timestamp);
            // setDptRealLastUpdated(dtpLastUpdated);
            setDptRealValue(value);
        } catch (error) {
            console.log(error);
        }
    }, []);

    //Handlers
    // Device changing function
    const handleDeviceSelection = async (deviceData: any) => {
        try {
            // const {
            //     location: locationName = '',
            //     buildingName = '',
            //     floorName = '',
            //     sensorName = '',
            //     btuName = '',
            //     name: ahuName = '',
            //     floorId,
            // } = deviceData;
            // // console.log('New Data from selection', deviceData);
            // setLocationData({
            //     locationName,
            //     buildingName,
            //     floorName,
            //     floorId,
            // });
            // setAhuData({
            //     ahuId: deviceData?.value,
            //     ahuName: deviceData?.name,
            //     ahuSensor: deviceData?.sensorName,
            // });
            // setBtuData({
            //     btuSensor: deviceData?.btuName,
            // });
            // const path = location?.pathname;
            // // console.log('Path Name', location);
            // const paramsString = path.split('/').pop(); // Extracts the last part of the path
            // const searchParam = new URLSearchParams(paramsString);
            // // console.log('search params', Object.entries(searchParams));
            // searchParam.set('location', locationName);
            // searchParam.set('building', buildingName);
            // searchParam.set('floorName', floorName);
            // searchParam.set('ahuName', ahuName);
            // searchParam.set('btuSensor', btuName);
            // searchParam.set('ahuSensor', sensorName);
            // searchParam.set('ahuId', deviceData?.value);
            // searchParam.set('floorId', floorId);
            // // console.log(searchParam.toString());
            // window.history.pushState({}, '', `/customer/vrv-vrf/0#/customer/ahu/${searchParam.toString()}`);
        } catch (error) {
            console.log(error);
        }
    };

    // Device Control modal
    // const handleDeviceControlModal = async () => {
    //     try {
    //         // console.log('Clicked');
    //         if (!userIsAdmin || !deviceName.current) return;

    //         const obj = {
    //             deviceName: deviceName.current,
    //             status: isDeviceOn,
    //             setTemp: realSetTemp,
    //             thermoStatMode: realMode,
    //             deviceId: id,
    //         };
    //         setModalInfo(obj);
    //         setControlModal((currentState) => !currentState);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // useEffect(() => {
    //     sensorName.current.ahu = state?.sensorName || '';
    //     sensorName.current.btu = state?.btuName || '';
    //     deviceName.current = state?.deviceName || '';
    // }, [getBTURealTime, getRealTimeAHU, state]);
    // useEffect(() => {
    //     //Scroll to top
    //     window.scrollTo(0, 0);
    //     const path = location?.pathname;
    //     const paramsString = path.split('/').pop(); // Extracts the last part of the path
    //     const searchParams = new URLSearchParams(paramsString);
    //     // const name = searchParams.get('name');
    //     const buildingName = searchParams.get('building');
    //     const locationName = searchParams?.get('location');
    //     const floorName = searchParams.get('floorName');
    //     const btuSensor = searchParams.get('btuSensor');
    //     const ahuName = searchParams.get('ahuName');
    //     const ahuSensor = searchParams.get('ahuSensor');

    //     const ahuId = searchParams.get('ahuId');
    //     const floorId = searchParams.get('floorId');
    //     setLocationData({
    //         locationName,
    //         buildingName,
    //         floorName,
    //         floorId,
    //     });
    //     setBtuData({
    //         btuSensor,
    //     });
    //     setAhuData({
    //         ahuId,
    //         ahuName,
    //         ahuSensor,
    //     });
    // }, []);
    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const idxString = searchParams.get('index') ?? '1';

        const idx = parseInt(idxString, 10);
        getRealTimeAHU('', idx);
        getOccupancyAndIaqDevicesList('');
        getAverageValues('', idx);
        getDPTRealtime('', idx);
        getBTURealTime('', idx);

        if (isNaN(idx) || idx > 4 || idx < 1) {
            setIndex(1);
        } else {
            setIndex(idx);
        }
    }, []);
    // useEffect(() => {
    //     console.log('Indexaaaa', index);
    // }, [index]);
    return (
        <>
            {/* {controlModal && (
                <ControlsModal state={controlModal} currentDeviceState={modalInfo} stateControlFn={setControlModal} />
            )} */}
            <Row style={{ marginLeft: '10px' }}>
                {' '}
                <Col xxl={6}>
                    <PageHeading title={'AHU'} />
                </Col>
                <Col xxl={6}>
                    {' '}
                    <DeviceSelectionComponent
                        customerId={customerId}
                        floorId={locationData?.floorId}
                        functionToExecute={handleDeviceSelection}
                        defaultSelection={ahuData?.ahuName ?? ''}
                    />
                </Col>
            </Row>

            <Row style={{ marginLeft: '10px' }}>
                <Col xxl={3} md={6}>
                    {' '}
                    <UnitSelectedWidgetWithControls
                        unitName={ahuData?.ahuName ?? 'Clairco AHU '}
                        location={locationData?.locationName ?? 'Bengaluru'}
                        floor={locationData?.floorName ?? 'Ground Floor'}
                        building={locationData?.buildingName ?? 'Clairco'}
                        deviceState={false}
                        isIcon={true}
                        firstPara={
                            <h6 style={{ display: 'flex', marginTop: '2px' }}>{`Thermostat : ${
                                thermostatStatus ? ' ON' : ' OFF'
                            }`}</h6>
                        }
                        secondPara={
                            <h6 style={{ display: 'flex', marginTop: '2px' }}>{`AHU : ${
                                isDeviceOn ? ' ON' : ' OFF'
                            }`}</h6>
                        }
                    />
                </Col>
                <Col xxl={3} md={6}>
                    <div className="widget-flat-dummy" style={{ padding: '10px', paddingLeft: '15px', margin: '5px' }}>
                        <div style={{ display: 'flex' }}>
                            <h5 style={{ marginBottom: '3px' }}>Energy Consumption</h5>{' '}
                            <div
                                onClick={handleBTUClick}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    marginLeft: '2px',
                                    marginBottom: '6px',
                                    // background: 'white',
                                }}>
                                <Navigator />
                            </div>
                        </div>{' '}
                        <Row>
                            <Col sm={9}>
                                <h5 style={{ marginTop: '0px' }}>BTU- {btuData?.btuSensor ?? 'CCBTU01'}</h5>
                                <h4 style={{ padding: '0px', marginTop: '0px' }}>
                                    {realBTVUalue ? realBTVUalue + ' GJ' : '-'}
                                </h4>
                            </Col>
                            <Col sm={3}>
                                <TimerIcon />
                            </Col>
                        </Row>
                        <LastUpdated lastUpdated={btuRealLastUpdated ? btuRealLastUpdated : '-'} />
                    </div>
                </Col>
                <Col xxl={3} md={6} onClick={handleOccupancyClick} style={{ cursor: 'pointer' }}>
                    <PlainWidget title="OCCUPANTS" value={occupantsSum} lastUpdated={realLastUpdated} />
                </Col>
                <Col xxl={3} md={6}>
                    <PlainWidgetWithTwoParameters
                        title1="Avg Temp"
                        value1={avgTemp ? avgTemp : '-'}
                        unit1="°C"
                        title2="Avg Humidity"
                        value2={avgHumidity ? avgHumidity : '-'}
                        unit2="%"
                        lastUpdated={realLastUpdated}
                        // func2={}
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px', marginBottom: '10px' }}>
                {' '}
                {/* Set temperature */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Set Temperature"
                        value={realSetTemp ? `${realSetTemp}°C` : '-'}
                        lastUpdated={realLastUpdated}
                    />
                </Col>{' '}
                {/* Return air temperature */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Return Air Temperature"
                        value={realReturnTemp ? `${realReturnTemp}°C` : '-'}
                        lastUpdated={realLastUpdated}
                    />
                </Col>{' '}
                {/* Fan Speed */}
                {/* <Col xxl={3} md={6}>
                    <HeadbandWidget title="Fan Speed" value={realFanSpeed} lastUpdated={realLastUpdated} />
                </Col>{' '} */}
                {/* Mode */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget title="Mode" value={realMode} lastUpdated={realLastUpdated} />
                </Col>
                <Col xxl={3} md={6}>
                    <HeadbandWidget title="DPT" value={String(dptRealValue ?? 69.6)} lastUpdated={realLastUpdated} />
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px', marginBottom: '10px' }}>
                {' '}
                <Col xxl={3} md={6}>
                    <PlainWidgetWithUnitsIcon
                        description=""
                        title={
                            <span>
                                {/* instantaneous <br /> */}
                                Instantaneous Energy <br />
                                {/* Required */}
                            </span>
                        }
                        value={[iEnergy]}
                        lastUpdated={btuRealLastUpdated}
                        unit="GJH"
                    />
                </Col>{' '}
                <Col xxl={3} md={6}>
                    <PlainWidgetWithUnitsIcon
                        description=""
                        title={
                            <span>
                                Flow Rate <br />
                                {/* Energy Consumption */}
                                <br />
                                {/* Required */}
                            </span>
                        }
                        value={[flowRate]}
                        lastUpdated={btuRealLastUpdated}
                        unit="M³/HR"
                        // stats={'1'}
                    />
                </Col>{' '}
                <Col xxl={3} md={6}>
                    <PlainWidgetWithUnitsIcon
                        description=""
                        title={
                            <span>
                                Net Flow <br />
                                {/* Energy Consumption */}
                                <br />
                                {/* Required */}
                            </span>
                        }
                        value={[netFlow]}
                        lastUpdated={btuRealLastUpdated}
                        unit="M³"
                        // stats={'1'}
                    />
                </Col>{' '}
                {/* DPT And Delta T Card */}
                <Col xxl={3} md={6}>
                    <TwoParameterWidget deltaT={deltaT} temp1={temp1} temp2={temp2} />{' '}
                </Col>
            </Row>
            <Row ref={trendsGraphRef} style={{ marginLeft: '10px', padding: '10px', paddingLeft: '15px' }}>
                <AHUTrendsChart
                    sensorNameAHU={ahuData?.ahuSensor ?? ''}
                    sensorNameBTU={btuData?.btuSensor ?? ''}
                    deviceId={ahuData?.ahuId ?? ''}
                />
            </Row>
            <Row ref={iaqRef} style={{ marginLeft: '10px' }}>
                <IAQDevicesTable tableData={IAQTableData} />
            </Row>
            <Row ref={occupancyRef} style={{ marginLeft: '10px' }}>
                <OccupancyDevicesTable tableData={occuTableData} />
            </Row>
        </>
    );
};

export default AHU_DevicePage;
