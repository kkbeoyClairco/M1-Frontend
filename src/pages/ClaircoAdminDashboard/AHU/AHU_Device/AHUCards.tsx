import LastUpdated from 'components/ClaircoCustomerDashboard/General/LastUpdated/LastUpdated';
import TimerIcon from 'components/ClaircoCustomerDashboard/Icons/TimerIcon';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import PlainWidget from 'components/ClaircoCustomerDashboard/Widgets/PlainWidget';
import PlainWidgetWithTwoParameters from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithTwoParameters';
import UnitSelectedWidgetWithControls from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidgetWithControls';
import React, { useCallback, useEffect, useState } from 'react';
import { AHUModeReverseMapping } from 'appConstants/DeviceMappingConstants';
import {
    fetchAHURealTime,
    fetchBTURealTime,
    fetchAverageValuesForAHU,
    fetchRealtimeDPT,
} from 'helpers/api/services/Clairco/customerSide/ahu';
// import {} from 'helpers/api/services/Clairco/customerSide/ahu';
import { Col, Row } from 'react-bootstrap';
import { roundToDecimal, roundToOneDecimal } from 'utils/maths';
import { convertUnixToIST, convertUnixToLocalTime } from 'utils/timeFunctions';
import { TwoParameterWidget } from './TwoParameterWidget';
import PlainWidgetWithUnitsIcon from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithUnitsIcon';
import ControlsModal from './ControlsModal';
import { isAdmin } from 'utils/storageFunctions';
import AHUControlsModal from 'components/ClaircoControls/AHUControls/AHUControlsModal';
import { toast } from 'sonner';
const fanSpeedReverseMapping: { [key: number]: string } = {
    0: 'High',
    1: 'Medium',
    2: 'Low',
    3: 'Auto',
};
const AHUCards = ({ ahuData, locationData, btuData }: any) => {
    const [realFanSpeed, setRealFanSpeed] = useState<any>();
    const [realMode, setRealMode] = useState<any>();
    const [realReturnTemp, setRealReturnTemp] = useState<any>();
    const [realSetTemp, setRealSetTemp] = useState<any>();
    const [realLastUpdated, setRealLastUpdated] = useState<any>();
    const [btuRealLastUpdated, setBTURealLastUpdated] = useState<any>();
    const [avgTemp, setAvgTemp] = useState<any>();
    const [avgHumidity, setAverageHumidity] = useState<any>();
    const [occupantsSum, setOccupantsSum] = useState<any>();

    const [isDeviceOn, setIsDeviceOn] = useState<boolean>();
    const [controlModal, setControlModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [deltaT, setDeltaT] = useState<any>();
    const [temp1, setTemp1] = useState<any>();
    const [temp2, setTemp2] = useState<any>();
    const [netFlow, setNetFlow] = useState<any>();
    const [flowRate, setFlowRate] = useState<any>();
    const [realBTVUalue, setRealBTUValue] = useState<any>();
    const [thermostatStatus, setThermostatStatus] = useState(false);
    const [iEnergy, setIEnergy] = useState<any>();
    const [dptRealValue, setDptRealValue] = useState<any>();
    const [isLoading, setIsLoading] = useState({ AHU: false, BTU: false });
    // Data Fetching and Manipulation
    // Real time BTU
    const getBTURealTime = useCallback(async (sensorName) => {
        if (!sensorName) return;
        try {
            setIsLoading((curr) => ({ ...curr, BTU: true }));
            const res = await fetchBTURealTime(sensorName);
            const lastUpdated = convertUnixToLocalTime(Number(res?.data?.[0]?.['Epoch time']?.$numberDecimal));
            const instEnergy = roundToOneDecimal(res?.data?.[0]?.data?.['Instantaneous Energy Rate']);
            const tempOne = roundToOneDecimal(res?.data?.[0]?.data?.Temp1);
            const tempTwo = roundToOneDecimal(res?.data?.[0]?.data?.Temp2);
            const netFlowRate = roundToOneDecimal(res?.data?.[0]?.data?.['Net Flow']);
            const FlowRateInst = roundToOneDecimal(res?.data?.[0]?.data?.Flowrate);
            const BTUValue = roundToOneDecimal(res?.data?.[0]?.data?.['Total Energy'] || 0);

            const tempDiff = roundToOneDecimal(tempTwo - tempOne) ?? '-';
            // const lastUpdated = res?.data[0].data['Epoch time'].$numberDecimal;
            // console.log('BTU last updated', lastUpdated);
            setIEnergy(instEnergy);
            setTemp1(tempOne);
            setTemp2(tempTwo);
            setNetFlow(netFlowRate);
            setFlowRate(FlowRateInst);
            setBTURealLastUpdated(lastUpdated);
            setRealBTUValue(BTUValue);
            setDeltaT(tempDiff);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading((curr) => ({ ...curr, BTU: false }));
        }
    }, []);

    // Real Time AHU
    const getRealTimeAHU = useCallback(async (sensorName: any) => {
        try {
            if (!sensorName) return;
            setIsLoading((curr) => ({ ...curr, AHU: true }));
            const res: any = await fetchAHURealTime(sensorName);
            const mode = res?.data?.[0]?.data?.MODE || 10;
            // console.log('AHU Real time:');
            const fanMode = res?.data?.[0]?.data?.FANMODE;
            const returnTemp = res?.data?.[0]?.data?.RTEMP
                ? roundToDecimal(Number(res?.data?.[0]?.data?.RTEMP) / 10)
                : 'N/A';
            const setTemp = res?.data?.[0]?.data?.STEMP
                ? roundToDecimal(Number(res?.data?.[0]?.data?.STEMP) / 10)
                : 'N/A';
            const updatedTime = convertUnixToLocalTime(Number(res?.data?.[0]?.['Epoch time']?.['$numberDecimal']));
            const currentDeviceStatus = res?.data?.[0]?.data?.RELAY1_STATE;
            const thermoStat = res?.data?.[0]?.data?.THSTAT ?? 0;
            setThermostatStatus(thermoStat);
            setRealFanSpeed(fanSpeedReverseMapping[+fanMode]);
            setIsDeviceOn(currentDeviceStatus ? true : false);
            setRealMode(AHUModeReverseMapping[mode]);
            setRealReturnTemp(returnTemp);
            setRealSetTemp(setTemp);
            setRealLastUpdated(updatedTime);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading((curr) => ({ ...curr, AHU: false }));
        }
    }, []);

    // Average Values
    const getAverageValues = useCallback(async (ahuId: any) => {
        if (!ahuId) return;

        const averages = await fetchAverageValuesForAHU(ahuId);
        setAverageHumidity(averages?.data?.avgHumi ? roundToOneDecimal(averages?.data?.avgHumi) : 'N/A');
        setAvgTemp(averages?.data?.avgRtemp ? roundToDecimal(averages?.data?.avgRtemp) : 'N/A');
        setOccupantsSum(averages?.data?.occupancySum ? roundToDecimal(averages?.data?.occupancySum) : 'N/A');
    }, []);

    //Real time DPT
    const getDPTRealtime = useCallback(async (deviceId?: any) => {
        try {
            if (!deviceId) return;
            const response = await fetchRealtimeDPT(deviceId);
            // console.log('DTP');

            const value = roundToOneDecimal(response?.data?.[0]?.value ?? 0);
            // const dtpLastUpdated = convertUnixToIST(response?.data?.[0]?.timestamp);
            // setDptRealLastUpdated(dtpLastUpdated);
            setDptRealValue(value);
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Device Control modal
    const handleDeviceControlModal = async () => {
        try {
            // console.log('Clicked');
            const userIsAdmin = isAdmin();

            if (!userIsAdmin || !ahuData?.ahuName || isLoading.AHU) {
                console.log(isLoading);
                toast.error(
                    'We’re experiencing a temporary delay. Please try again in a short while. Thank you for your patience!'
                );
                return;
            }

            const obj = {
                deviceName: ahuData?.ahuName,
                status: isDeviceOn,
                setTemp: realSetTemp,
                thermoStatMode: realMode ?? '',
                deviceId: ahuData.ahuId ?? '',
            };
            setModalInfo(obj);
            setControlModal((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getRealTimeAHU(ahuData?.ahuSensor);
        // getOccupancyAndIaqDevicesList(ahuData?.ahuId);
        getAverageValues(ahuData?.ahuId);
        getDPTRealtime(ahuData?.ahuId);
    }, [ahuData, getAverageValues, getDPTRealtime, getRealTimeAHU]);
    useEffect(() => {
        getBTURealTime(btuData?.btuSensor);
    }, [btuData, getBTURealTime]);
    return (
        <Row className="mx-2">
            {controlModal && !isLoading.AHU && (
                <AHUControlsModal
                    state={controlModal}
                    currentDeviceState={modalInfo}
                    stateControlFn={setControlModal}
                />
            )}
            <Row style={{ marginLeft: '10px' }}>
                <Col xxl={3} md={6}>
                    <UnitSelectedWidgetWithControls
                        unitName={ahuData?.ahuName}
                        iconFunction={handleDeviceControlModal}
                        location={locationData?.locationName ?? ''}
                        floor={locationData?.floorName ?? ''}
                        building={locationData?.buildingName ?? ''}
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
                {/* Energy Consuption */}
                <Col xxl={3} md={6}>
                    <div className="widget-flat-dummy" style={{ padding: '10px', paddingLeft: '15px', margin: '5px' }}>
                        <div style={{ display: 'flex' }}>
                            <h5 style={{ marginBottom: '3px' }}>Energy Consumption</h5>{' '}
                            <div
                                // onClick={handleBTUClick}
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
                                <h6 style={{ marginTop: '0px' }}>BTU- {btuData?.btuSensor}</h6>
                                <h4 style={{ padding: '0px', marginTop: '0px' }}>
                                    {realBTVUalue ? realBTVUalue + ' GJ' : 'N/A'}
                                </h4>
                            </Col>
                            <Col sm={3}>
                                <TimerIcon />
                            </Col>
                        </Row>
                        <LastUpdated lastUpdated={btuRealLastUpdated ? btuRealLastUpdated : '-'} />
                    </div>
                </Col>

                {/* Occupancy */}
                <Col
                    xxl={3}
                    md={6}
                    // onClick={handleOccupancyClick}
                    style={{ cursor: 'pointer' }}>
                    <PlainWidget title="OCCUPANTS" value={occupantsSum} lastUpdated="" />
                </Col>
                <Col xxl={3} md={6}>
                    <PlainWidgetWithTwoParameters
                        title1="Avg Temp"
                        value1={avgTemp ? avgTemp : 'N/A'}
                        unit1="°C"
                        title2="Avg Humidity"
                        value2={avgHumidity ? avgHumidity : 'N/A'}
                        unit2="%"
                        lastUpdated=""
                        // func2={}
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: '10px', marginBottom: '20px' }}>
                {' '}
                {/* Set temperature */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Set Temperature"
                        value={realSetTemp ? `${realSetTemp}°C` : 'N/A'}
                        lastUpdated={realLastUpdated}
                    />
                </Col>{' '}
                {/* Return air temperature */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget
                        title="Return Air Temperature"
                        value={realReturnTemp ? `${realReturnTemp}°C` : 'N/A'}
                        lastUpdated={realLastUpdated}
                    />
                </Col>{' '}
                {/* Fan Speed */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget title="Fan Speed" value={realFanSpeed} lastUpdated={realLastUpdated} />
                </Col>{' '}
                {/* Mode */}
                <Col xxl={3} md={6}>
                    <HeadbandWidget title="Mode" value={realMode} lastUpdated={realLastUpdated} />
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
                    <TwoParameterWidget deltaT={deltaT} temp1={temp1} temp2={temp2} dpt={dptRealValue} />{' '}
                </Col>
            </Row>
        </Row>
    );
};

export default AHUCards;
