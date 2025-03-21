import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import AlertTable from '../DeviceSpecific/Alerts';
import GaugeChart from 'components/ClaircoCharts/GaugeChart';
import StrokedGauge from 'components/ClaircoCharts/StrokedGauge';
import TrendsChart from './TrendsChart';
import { IndoorUnitListTable } from './IndoorUnitListTable';
import {
    getIndoorUnitTableData,
    getLiveDataOfIndoorUnit,
    getOccupantsCount,
} from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import Select from 'react-select';
import occupancyIcon from '../../../../assets/images/occupanacy_icon.png';
import { useLocation } from 'react-router-dom';
import OccupancyTrendsModal from './OccupancyTrendsModal';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
interface LocationState {
    state: { key: string; name: string; id: string };
    pathname: string;
}

const VRVVRFSensorPage = () => {
    const [tableData, setTableData] = useState([]);
    const [deviceSelected, setDeviceSelected] = useState('');
    const [deviceIdSelected, setDeviceIdSelected] = useState();
    const [deviceAliasName, setDeviceAliasName] = useState('');
    const [graphData, setGraphData] = useState([]);
    const [temperature, setTemperature] = useState(0);
    const [fanSpeed, setFanSpeed] = useState<any>();
    const [lastUpdated, setLastUpdated] = useState('');
    const [isOccuModalOpen, setIsOccuModalOpen] = useState(false);
    const [occupantsNumber, setoccupantsNumber] = useState(0);
    const [selectedZoneId, setSelectedZoneId] = useState();
    const selectIndoorUnitRed = useRef<HTMLDivElement>(null);
    const [isIndoorDeviceOn, setIsIndoorDeviceOn] = useState();
    const [indoorUnitId, setIndoorUnitId] = useState('');
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
                if (key && key == doc._id && doc.aliasName) {
                    const obj = { aliasName: doc.aliasName || '', deviceName: doc.name || '' };
                    return obj;
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getIndoordata = async (indoorUnitId: any) => {
        try {
            if (!indoorUnitId) return;

            const data = await getIndoorUnitTableData(indoorUnitId);
            const objReceived: any = await getDevicName(data?.data);
            const { aliasName, deviceName } = objReceived || { aliasName: '', deviceName: '' };
            setTableData(data?.data);
            setDeviceSelected(deviceName ? deviceName : data?.data[0]['name']);
            setDeviceAliasName(aliasName ? aliasName : data?.data[0]['aliasName']);
            setDeviceIdSelected(key ? key : data?.data[0]._id);
            setSelectedZoneId(data?.data[0].zoneId);
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
            // console.log('Occupants Count', res, occupantsCount);
            setoccupantsNumber(occupantsCount);
        } catch (error) {
            setoccupantsNumber(0);
            console.log(error);
        }
    };

    const handleDeviceSelection = async (e: any) => {
        try {
            // console.log('device selection:', e);
            setDeviceSelected(e.name);
            setDeviceIdSelected(e.value);
            setDeviceAliasName(e.label);
            setSelectedZoneId(e.zoneId);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const indoorUnitId = location?.state?.id ?? '';
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name') ?? '';
        const building = searchParams.get('building') ?? '';
        const locationName = searchParams?.get('location') ?? '';
        const floor = searchParams.get('floor') ?? '';
        // console.log('sensor name', name, 'building', building, 'location', locationName, 'floor', floor);
        setUnitDetails({ name, floor, building, location: locationName });
        setIndoorUnitId(indoorUnitId);
        if (key && selectIndoorUnitRed.current) {
            const y = selectIndoorUnitRed.current.offsetTop;
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
        getIndoordata(indoorUnitId);
        getOccupantCount(key);
    }, []);

    //Function excecution to change the graph data
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
            <PageHeading title={'Indoor Unit'} />
            {/* <Row style={{ marginLeft: '10px' }}>
                <Col xs={12}>
                    <div className="page-title-box">
                        <div className="page-title-right"></div>
                        <h4 className="page-title">Indoor Unit</h4>
                    </div>
                </Col>
            </Row> */}
            {/* Unit Name Card */}
            <Row style={{ marginLeft: '10px' }}>
                <Col xxl={3} md={3}>
                    <UnitSelectedWidget
                        unitName={unitDetails?.name}
                        location={unitDetails?.location}
                        floor={unitDetails?.floor}
                        building={unitDetails?.building}
                        deviceState={false}
                        swithDisabled={true}
                    />
                    {/* Alert Table */}
                    <Row style={{ height: '83%', marginTop: '20px' }}>
                        <Card style={{ marginTop: '20px', height: '78%', marginBottom: '20px' }}>
                            <Card.Body>
                                {' '}
                                <AlertTable />
                                <div
                                    style={{
                                        height: '80%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <h6>Coming Soon..!</h6>
                                </div>
                            </Card.Body>
                        </Card>
                        {/* <Card style={{ marginTop: '1px', height: '47%', marginBottom: '20px' }}>
                            <Card.Body></Card.Body>
                        </Card> */}
                    </Row>
                </Col>
                {/* Indoor Unit List table */}
                <Col md={9} style={{}}>
                    {' '}
                    <IndoorUnitListTable />
                </Col>
            </Row>

            {/* Row for Selected Unit Data */}
            <Row ref={selectIndoorUnitRed}>
                <Col md={12} style={{ marginLeft: '10px' }}>
                    <Card>
                        <Card.Body>
                            <Col md={8} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <h5>Indoor Unit:</h5> <div></div>
                                <Form.Group className="mb-1">
                                    <Select
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                width: '260px', // Adjust the width as needed
                                                marginLeft: '135px',
                                            }),
                                        }}
                                        name="areaId"
                                        placeholder={deviceAliasName}
                                        onChange={(e) => handleDeviceSelection(e)}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={tableData.map((data: any) => ({
                                            value: data._id,
                                            label: data.aliasName,
                                            name: data.name,
                                            zoneId: data.zoneId,
                                        }))}
                                    />
                                </Form.Group>{' '}
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Occupancy Count */}
            <Row>
                {' '}
                <Col md={3}>
                    {' '}
                    <Card
                        title="Please click to see the trends"
                        style={{
                            marginTop: '1px',
                            height: '94%',
                            marginBottom: '20px',
                            marginLeft: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={handleOccuModal}>
                        <Card.Body>
                            <Row>
                                <h5>Occupancy</h5>
                            </Row>
                            <Row style={{ height: '75%' }}>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <img
                                        style={{ height: '60px', marginTop: '80px' }}
                                        src={occupancyIcon}
                                        alt=""
                                    />{' '}
                                </div>
                                <div
                                    style={{
                                        marginTop: '0px',
                                        height: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}>
                                    <h2>{occupantsNumber}</h2>{' '}
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                                    <h5>Members</h5>
                                </div>{' '}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>{' '}
                <Col md={9}>
                    <Row style={{ display: 'flex' }}>
                        <Col md={6}>
                            <Card>
                                <Card.Body style={{ padding: '0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            paddingTop: '10px',
                                            paddingLeft: '20px',
                                            justifyContent: 'space-between',
                                            paddingBottom: '22px',
                                        }}>
                                        <h5 style={{}}>Zone Temperature(°C)</h5>
                                        <div style={{ width: '170px' }}>
                                            {' '}
                                            <h6 style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>
                                                Updated on {lastUpdated}
                                            </h6>
                                        </div>
                                    </div>
                                    <StrokedGauge
                                        property={'Temperature'}
                                        value={temperature}
                                        deviceName={deviceAliasName}
                                    />{' '}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card style={{ height: '417px' }}>
                                <Card.Body style={{ padding: '0' }}>
                                    <div style={{ display: 'flex', padding: '0px', justifyContent: 'space-between' }}>
                                        <h5 style={{ padding: '10px', paddingLeft: '15px' }}>Fan Speed</h5>{' '}
                                        <div
                                            style={{
                                                width: '180px',
                                                paddingTop: '10px',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                            }}>
                                            <h6 style={{ fontSize: '10px', fontWeight: '600' }}>
                                                Updated on {lastUpdated}{' '}
                                            </h6>
                                        </div>
                                    </div>
                                    <GaugeChart property={'fanspeed'} value={fanSpeed} deviceName={deviceAliasName} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* Trends Graph */}
            <Row style={{ marginLeft: '10px' }}>
                <Col md={12}>
                    <TrendsChart
                        tempFucnction={setTemperature}
                        fanSpeedFunction={setFanSpeed}
                        deviceName={deviceSelected}
                        getLastUpdated={setLastUpdated}
                        deviceAliasName={deviceAliasName}
                        setIsIndoorDeviceOn={setIsIndoorDeviceOn}
                    />
                </Col>
            </Row>
        </>
    );
};

export default VRVVRFSensorPage;
