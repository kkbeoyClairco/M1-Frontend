import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import AlertTable from '../DeviceSpecific/Alerts';

import TrendsChart from 'components/ClaircoTrends/VrvVrf/TrendsChart';
import { IndoorUnitListTable } from './IndoorUnitListTable';
import { getIndoorUnitTableData, getOccupantsCount } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import OccupancyTrendsModal from './OccupancyTrendsModal';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { VRFOccupancyWidget } from 'components/ClaircoWidgets/VrfVrv/VRFOccupancyWidget';
import { VRFTemperatureWidget } from 'components/ClaircoWidgets/VrfVrv/VRFTemperatureWidget';
import FanSpeedWidget from 'components/ClaircoWidgets/VrfVrv/FanSpeedWidget';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getIndoorUnitLiveData } from 'helpers/api/services/Clairco/adminSide/indoorDevices';
import { roundToOneDecimal } from 'utils/maths';
import { convertUnixToIST } from 'utils/timeFunctions';

interface LocationState {
    state: { key: string; name: string; parentId: string };
    pathname: string;
}

//Mapping moodified to avoid the graph from plunging into zero State
const fanSpeedObject: { [key: string]: number } = {
    Auto: 1,
    Low: 2,
    'Low+': 3,
    Med: 4,
    'Med+': 5,
    High: 6,
};

const deviceModes: { [key: string]: number } = {
    Auto: 1,
    AutoCool: 7,
    AutoHeat: 6,
    Cool: 5,
    Dry: 3,
    Fan: 4,
    Heat: 2,
};

const VRVVRFSensorPage = () => {
    //Indoor unit list
    const [indoorUnitList, setIndoorUnitList] = useState([]);
    const [deviceSelected, setDeviceSelected] = useState('');
    const [deviceIdSelected, setDeviceIdSelected] = useState();
    const [deviceAliasName, setDeviceAliasName] = useState('');
    // const [graphData, setGraphData] = useState([]);
    const [temperature, setTemperature] = useState<number>();
    const [fanSpeed, setFanSpeed] = useState<any>();
    const [lastUpdated, setLastUpdated] = useState('');
    const [isOccuModalOpen, setIsOccuModalOpen] = useState(false);
    const [occupantsNumber, setoccupantsNumber] = useState(0);
    const [selectedZoneId, setSelectedZoneId] = useState();
    const selectIndoorUnitRef = useRef<HTMLDivElement>(null);
    const [isIndoorDeviceOn, setIsIndoorDeviceOn] = useState();
    const [parentUnitId, setParentUnitId] = useState('');
    const [unitDetails, setUnitDetails] = useState({ name: '', floor: '', building: '', location: '' });
    // const occupancyMapper = useRef();
    const location = useLocation() as LocationState;
    const key = location.state?.key ?? '';

    const handleOccuModal = async () => {
        try {
            // return;
            // console.log('Occu modal contorl');
            setIsOccuModalOpen((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };
    const getCurretTemperature = async (array: number[]) => {
        try {
            // const latestTemperature = array[0]['Epoch time'];
        } catch (error) {
            console.log(error);
        }
    };

    const getDevicName = async (data: any) => {
        try {
            for (const doc of data) {
                // console.log('Table dataaaa', doc);
                if (key && key == doc.id && doc.aliasName) {
                    const obj = { aliasName: doc.aliasName || '', deviceName: doc.name || '' };
                    return obj;
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getIndoordata = async (parentUnitId: any) => {
        try {
            console.log('Parent Unit Id', parentUnitId);
            if (!parentUnitId) return;
            const data = await getIndoorUnitTableData(parentUnitId);
            const objReceived: any = await getDevicName(data?.data ?? []);
            const { aliasName, deviceName } = objReceived || { aliasName: '', deviceName: '' };
            setIndoorUnitList(data?.data ?? []);
            setDeviceSelected(deviceName ? deviceName : data?.data?.[0]?.['name'] ?? '');
            setDeviceAliasName(aliasName ? aliasName : data?.data?.[0]?.['aliasName'] ?? '');
            setDeviceIdSelected(key ? key : data?.data?.[0]?.id);
            setSelectedZoneId(data?.data?.[0].zoneId);
        } catch (error) {
            console.log(error);
        }
    };
    //API To get the occupants count based on the Device Id
    const getOccupantCount = async (deviceId: any) => {
        try {
            const res = await getOccupantsCount(deviceId);
            const occupantsCount = res?.data
                .map((doc: any) => {
                    return doc.occupancy.metaData['occupancy_number'];
                })
                .reduce((sum: number, currentValue: number) => (sum += currentValue));
            setoccupantsNumber(occupantsCount);
        } catch (error) {
            setoccupantsNumber(0);
            console.log(error);
        }
    };

    const handleDeviceSelection = async (e: any) => {
        try {
            setDeviceSelected(e?.name);
            setDeviceIdSelected(e?.value);
            setDeviceAliasName(e?.label);
            setSelectedZoneId(e?.zoneId);
        } catch (error) {
            console.log(error);
        }
    };

    const getLiveData = async (sensorName: string) => {
        try {
            if (!sensorName) return;

            const deviceTypeId1 = deviceTypeId['VRV/VRF'];
            const res: any = (await getIndoorUnitLiveData(deviceTypeId1, sensorName)) ?? {};
            const lastUpdated = convertUnixToIST(res?.data?.['Epoch time']);

            // const deviceStatusData: string | number = res?.data?.[0]?.data?.['Status'];
            const zoneTemp = roundToOneDecimal(res?.data?.['Amb Temp']);
            const fanspeed = fanSpeedObject[res?.data?.['Fan Speed']];
            // const setTempData = roundToOneDecimal(res?.data?.[0]?.['Set Temp']);
            // const mode = deviceModes[res?.data?.['Mode']];

            // console.log('Res', res, zoneTemp, fanspeed, lastUpdated, mode);
            setFanSpeed(fanspeed);
            setLastUpdated(lastUpdated);
            setTemperature(zoneTemp);
        } catch (error) {
            console.log(error);
            setFanSpeed('');
            setLastUpdated('N/A');
            setTemperature(0);
        }
    };
    useEffect(() => {
        const parentUnitId = location?.state?.parentId ?? '';
        // console.log('Parent Unit id', parentUnitId);
        const path = location?.pathname;
        const paramsString = path.split('/')?.pop();
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name') ?? '';
        const building = searchParams.get('building') ?? '';
        const locationName = searchParams?.get('location') ?? '';
        const floor = searchParams.get('floor') ?? '';
        setUnitDetails({ name, floor, building, location: locationName });
        setParentUnitId(parentUnitId);
        if (key && selectIndoorUnitRef.current) {
            const y = selectIndoorUnitRef.current.offsetTop;
            window.scrollTo({
                top: y - 60,
                left: 100,
                behavior: 'smooth',
            });
        } else
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        getIndoordata(parentUnitId);
        getOccupantCount(key);
    }, []);
    useEffect(() => {
        getLiveData(deviceSelected);
        // console.log('Device Selected', deviceIdSelected);
    }, [deviceSelected]);
    useEffect(() => {
        getOccupantCount(deviceIdSelected);
    }, [deviceIdSelected]);

    return (
        <>
            {isOccuModalOpen && (
                <OccupancyTrendsModal
                    modalState={isOccuModalOpen}
                    modalControlFn={setIsOccuModalOpen}
                    name={deviceAliasName}
                    zoneId={selectedZoneId}
                />
            )}
            {/* Heading */}
            <PageHeading title={'Outdoor Unit'} />

            <Row className="d-flex align-items-stretch mx-3 ml-2 mb-3" style={{ height: '100%' }}>
                <Col xs={12} lg={3} className=" px-2 pt-0 mx-0 d-flex flex-column justify-content-center">
                    {/* Unit Name Card */}
                    <div className="h-25" style={{ minHeight: '12em' }}>
                        <UnitSelectedWidget
                            unitName={unitDetails?.name ?? 'Device'}
                            location={unitDetails?.location ?? 'Location'}
                            floor={unitDetails?.floor ?? 'Floor'}
                            building={unitDetails?.building ?? 'Building'}
                            deviceState={false}
                            swithDisabled={true}
                        />
                    </div>
                    {/* Alert Table Dummy*/}
                    <Card className="p-2 mx-0 ml-6 h-75 mb-1 shadow-lg rounded-lg flex-grow-1 d-flex flex-column">
                        <Card.Body className="d-flex flex-column flex-grow-1">
                            <AlertTable />
                            <div
                                style={{
                                    // height: '80%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <h6>Coming Soon..!</h6>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Indoor Unit List table */}
                <Col className="h-100 mx-0 pl-4 px-2" xs={12} lg={9}>
                    <IndoorUnitListTable parentUnitId={parentUnitId} tableData={indoorUnitList} />
                </Col>
            </Row>

            {/* Indoor unit selection section */}
            <Row className="mx-2" ref={selectIndoorUnitRef}>
                <Card className="mx-0">
                    <Card.Body>
                        <Row>
                            {' '}
                            <Col xs={12} lg={3}>
                                <h5>Indoor Unit:</h5>
                            </Col>
                            <Col xs={12} lg={9} className="d-flex justify-content-start">
                                <Select
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            width: '13em', // Adjust the width as needed
                                            // marginLeft: '135px',
                                            // maxWidth: '100%',
                                        }),
                                    }}
                                    name="areaId"
                                    placeholder={deviceAliasName}
                                    onChange={(e) => handleDeviceSelection(e)}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={indoorUnitList?.map((data: any) => ({
                                        value: data?.id ?? '',
                                        label: data?.aliasName ?? '',
                                        name: data?.name ?? '',
                                        zoneId: data?.zoneId ?? '',
                                    }))}
                                />
                                <div
                                    style={{
                                        width: '150px',
                                        display: 'flex',
                                        marginLeft: '20px',
                                        justifyContent: 'start',
                                        padding: '7px',
                                    }}>
                                    {' '}
                                    <div
                                        className="rounded-lg"
                                        style={{
                                            height: '20px',
                                            width: '20px',
                                            borderRadius: '10px',
                                            marginLeft: '10px',
                                            marginRight: '10px',
                                            borderWidth: '10px',
                                            background: `${isIndoorDeviceOn ? 'green' : 'red'}`,
                                        }}></div>
                                    <p>{isIndoorDeviceOn ? 'ON' : 'OFF'}</p>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
            <Row className="d-flex flex-row px-0 mx-1 mt-1 mb-1 justifiy-content-between">
                {/* Occupancy Count */}
                <Col lg={4} className="" onClick={handleOccuModal}>
                    <VRFOccupancyWidget occupanctsCount={occupantsNumber} />
                </Col>{' '}
                {/* Zone temperature */}
                <Col lg={4} className="">
                    <VRFTemperatureWidget
                        temperature={temperature ?? 0}
                        deviceName={deviceAliasName ?? ''}
                        lastUpdated={lastUpdated ?? ''}
                    />
                </Col>
                {/* Fanspeed */}
                <Col lg={4} className="">
                    <FanSpeedWidget lastUpdated={lastUpdated} speed={fanSpeed} deviceName={deviceAliasName} />
                </Col>
            </Row>

            {/* Trends Graph */}
            <Row className="mx-2">
                <TrendsChart deviceName={deviceSelected} deviceAliasName={deviceAliasName} />
            </Row>
        </>
    );
};

export default VRVVRFSensorPage;
