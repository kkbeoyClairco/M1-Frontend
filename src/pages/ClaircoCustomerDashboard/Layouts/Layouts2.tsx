import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { getDataForSVGManipulation } from 'helpers/api/services/Clairco/customerSide/occupancy';
import { coloursTable } from 'appConstants/propertyTable';
import { OccupantsLayoutSVG } from 'components/ClaircoCustomerDashboard/OccupantsLayoutSVG';
import { useRedux } from 'hooks';
import { getUserDetailsFromSession } from 'utils/storageFunctions';
import {
    getAhuToolTipData,
    getGreenAndRedForAHU,
    getGreenAndRedForOccupancy,
    getGreenAndRedForVRF,
    getOccupancyToolTipData,
    getVrvToolTipData,
} from 'utils/floorPlan';
import { MODIFY_ALERT } from 'appConstants/claircoConstants';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { ahuToolTipData, occupancyLayoutData } from 'appConstants/dataToSvg';
import { convertUnixToIST } from 'utils/timeFunctions';
import { OccupantsLayoutSVG2 } from 'components/ClaircoCustomerDashboard/OccupantsLayoutSVG3';
// ...existing code...
type ToolTipDataType = {
    name: string;
    deviceId?: string;
    count?: string | number;
    temp?: string | number;
    humi?: string | number;
    updatedOn?: string;
    data?: any;
};

// const [toolTipData, setToolTipData] = useState<ToolTipDataType[]>([]);
// ...existing code...
type LayoutPropsType = { floorId?: string; devices?: string[]; floorPlanUrl: string };
type Legands = {
    'VRF-VRV': { green: string; red: string; grey: string };
    AHU: { green: string; red: string; grey: string };
    OCCUPANCY: { green: string; red: string; grey: string };
};
const OccupantsLayout2 = ({ floorId, devices, floorPlanUrl }: LayoutPropsType) => {
    // console.log('Active devies', devices);
    const [graphState, setGraphState] = useState<any>('OCCUPANCY');
    const [greenOccupancy, setGreenOccupancy] = useState({});
    const [redOccuancy, setRedOccupancy] = useState({});

    const [redAHU, setRedAHU] = useState({});
    const [greenAHU, setGreenAHU] = useState({});

    const [greenVRF, setGreenVRF] = useState({});
    const [redVRF, setRedVRF] = useState({});
    const [lastUpdated, setLastUpdated] = useState('');
    const [toolTipData, setToolTipData] = useState<ToolTipDataType[]>([]);
    const [occDataTooltip, setOccDataTooltip] = useState([]);
    const [vrfDataTooltip, setVrfDataTooltip] = useState();
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [activeDevices, setActiveDevices] = useState<any>([]);
    const { dispatch, appSelector } = useRedux();

    const getGreenIds = (currentState: any) => {
        try {
            if (currentState === 'VRF-VRV') return greenVRF;
            else if (currentState === 'AHU') return greenAHU;
            else if (currentState === 'OCCUPANCY') return greenOccupancy;
        } catch (error) {
            console.log('error passing green Ids svg layer', error);
        }
    };
    const getRedIds = (currentState: any) => {
        try {
            if (currentState === 'VRF-VRV') return redVRF;
            else if (currentState === 'AHU') return redAHU;
            else if (currentState === 'OCCUPANCY') return redOccuancy;
        } catch (error) {
            console.log('error passing green Ids svg layer', error);
        }
    };
    // Creates an active device list from the floor level device information
    const getActiveDevices = (devicesArray: any) => {
        try {
            const activeDevices = [];
            if (devicesArray?.includes(deviceTypeId['AHU'])) activeDevices.push('AHU');
            if (devicesArray?.includes(deviceTypeId['VRV/VRF'])) activeDevices.push('VRF-VRV');
            if (devicesArray?.includes(deviceTypeId['Occupancy'])) activeDevices.push('OCCUPANCY');
            setGraphState(activeDevices?.[0]);
            setActiveDevices(activeDevices);
        } catch (error) {
            console.log(error);
        }
    };
    //Getting Active Building and Floor from Redux
    const {
        activeBuilding: { buildingName },
        activeFloor: { floorName },
    } = appSelector((state: any) => state.HomePageReducer);
    const data = getUserDetailsFromSession();

    //Change Graph States -VRF-VRV ||  OCCUPANCY
    const changeGraphState = async (state: any) => {
        if (isDataLoading) return;
        setGraphState(state);
    };

    const graphOptions: Record<string, string> = {
        // 'VRF-VRV': 'VRF-VRV',
        OCCUPANCY: 'OCCUPANCY',
        AHU: 'AHU',
    };
    const legands: Legands = {
        'VRF-VRV': {
            green: 'Device ON',
            red: 'Device Off',
            grey: 'Offline',
        },
        AHU: {
            green: 'Device ON',
            red: 'Device Off',
            grey: 'Offline',
        },
        OCCUPANCY: {
            green: 'Unoccupied',
            red: 'Occupied',
            grey: 'Offline',
        },
    };

    // Function that fetches data for the layouts
    const getDataForLayout = useCallback(async (floorId: string, currentState: string) => {
        try {
            // MODIFY_ALERT Needs Rework
            setIsDataLoading(true);

            if (currentState === graphOptions['VRF-VRV']) {
                //VRF
                // const id = deviceTypeId['VRV/VRF'];
                // const data = await getDataForSVGManipulation(floorId, id);
                // const { greenElementsVRF, redElementsVRF } = await getGreenAndRedForVRF(data?.data?.devices);
                // const indoorUnitDataTooltip = await getVrvToolTipData(data?.data?.devices);
                // setGreenVRF(greenElementsVRF);
                // setRedVRF(redElementsVRF);
                // setToolTipData(indoorUnitDataTooltip);
            } else if (currentState === graphOptions['AHU']) {
                //AHU
                // const id = deviceTypeId['AHU'];
                // const data = await getDataForSVGManipulation(floorId, id);
                // const { greenElementsAHU, redElementsAHU } = await getGreenAndRedForAHU(data?.data?.devices);
                // const ahuToolTip = await getAhuToolTipData(data?.data?.devices);
                // return ['670bb1928728900f244c1449'];
                setGreenAHU(['670bb1928728900f244c1449']);
                setRedAHU([]);
                // const ahuDataToolTip = await getAhuToolTipData(ahuToolTipData);
                const ahuDataToolTip = ahuToolTipData.map((data) => ({ ...data }));
                // console.log('ahu', ahuDataToolTip);
                setToolTipData(
                    ahuDataToolTip // ahuToolTipData.map((item: any) => ({
                    //     name: item.name,
                    //     deviceId: item.deviceId,
                    //     status: item.data?.COUNT ?? '', // or another relevant field
                    //     temp: item.data?.STEMP ?? '', // or another relevant field
                    //     humi: item.data?.HUMI ?? '', // or another relevant field
                    //     updatedOn: item['Epoch time'] ? convertUnixToIST(item['Epoch time']) : '',
                    // }))
                );
            } else if (currentState === graphOptions['OCCUPANCY']) {
                //OCCUPANCY
                // const id = deviceTypeId['Occupancy'];
                // const data = await getDataForSVGManipulation(floorId, id);
                // const { greenElementsOccu, redElementsOccu } = await getGreenAndRedForOccupancy(data?.data?.devices);
                // const occupantsDataToTooltip = await getOccupancyToolTipData(data?.data?.devices);

                const dummyGreen = [
                    '670bb4f01ec68b8c2a56386d',
                    '670bb4b81ec68b8c2a56385d',
                    '670bb4d91ec68b8c2a563867',
                    '670bb52a1ec68b8c2a56387d',
                    '670bb5471ec68b8c2a563883',
                    '670bb4d21ec68b8c2a563865',
                    '66f684160b7e6d271d9949aa',
                    '670bb4ca1ec68b8c2a563863',
                    '670bb4a71ec68b8c2a563859',
                    '670bb4b21ec68b8c2a56385b',
                    '670bb4e11ec68b8c2a563869',
                    '670bb4e71ec68b8c2a56386b',
                    '670bb4c41ec68b8c2a563861',
                    '67f3672d457e8986140bb22c',
                    '67f3673d457e8986140bb22d',
                ];

                const dummyRed = [
                    '670bb5241ec68b8c2a56387b',
                    '670bb4ff1ec68b8c2a563871',
                    '670bb5411ec68b8c2a563881',
                    '670bb55a1ec68b8c2a563887',
                    '670bb5061ec68b8c2a563873',
                    '670bb5161ec68b8c2a563877',
                    '670bb50d1ec68b8c2a563875',
                    '670bb51d1ec68b8c2a563879',
                    '670bb5351ec68b8c2a56387f',
                    '670bb4f81ec68b8c2a56386f',
                    '670bb54e1ec68b8c2a563885',
                    '67f36749457e8986140bb22e',
                ];
                setRedOccupancy(dummyRed);
                setGreenOccupancy(dummyGreen);
                setToolTipData(occupancyLayoutData);
            }

            setLastUpdated(lastUpdated);
            setIsDataLoading(false);
        } catch (error) {
            console.log(error);
            setIsDataLoading(false);
        }
    }, []);
    useEffect(() => {
        // getActiveDevices(devices);
    }, [devices]);
    useEffect(() => {
        getDataForLayout('floorId', graphState);
    }, [graphState, floorId]);
    return (
        <Col md={12} style={{ padding: '20px', paddingTop: '10px' }}>
            <Card style={{ height: '665px' }}>
                {' '}
                <Row style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '20px' }}>
                    <Col md={6} style={{ padding: '20px' }}>
                        <Row style={{ paddingLeft: '20px', color: 'black' }}>
                            <h4>Layout Overview</h4>
                        </Row>
                        <Row style={{ paddingLeft: '20px' }}>
                            <h6>
                                {' Bengaluru'} &gt;{' Clairco'} &gt; {' Ground Floor'}
                            </h6>
                        </Row>
                    </Col>
                    <Col md={6} style={{ paddingTop: '20px' }}>
                        <Nav>
                            {/* Layout selection */}
                            {Object.keys({}).map((option: any) => {
                                // if (activeDevices.includes(option))
                                return (
                                    <Nav.Item as="li" key={option}>
                                        <div
                                            className="btn-group"
                                            style={{ border: '0px' }}
                                            role="group"
                                            aria-label="Basic example">
                                            {' '}
                                            <Nav.Link
                                                disabled={isDataLoading}
                                                style={{
                                                    background:
                                                        graphState == graphOptions[option] ? '#00695C' : '#008675',
                                                    // borderRadius: '5px',
                                                    width: '9em',
                                                    color: 'white',
                                                    padding: '25px',
                                                    textAlign: 'center',
                                                    fontWeight: graphState === graphOptions[option] ? 'bold' : '100',
                                                }}
                                                className="py-1"
                                                eventKey="device"
                                                onClick={() => changeGraphState(option)}>
                                                {option == 'VRF-VRV'
                                                    ? 'Indoor Unit'
                                                    : option == 'OCCUPANCY'
                                                    ? 'Occupancy'
                                                    : option}
                                            </Nav.Link>{' '}
                                        </div>
                                    </Nav.Item>
                                );
                            })}{' '}
                        </Nav>
                        <Row style={{ paddingTop: '10px' }}>
                            <div
                                style={{
                                    fontSize: '10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '90%',
                                    height: '30px',
                                    alignItems: 'center',
                                }}>
                                {/* Legands */}
                                {graphState &&
                                    Object.entries(legands[graphState as keyof Legands]).map(([colour, meaning]) => {
                                        return (
                                            <Row
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'start',
                                                    paddingLeft: '15px',
                                                    width: '180px',
                                                }}
                                                key={meaning}>
                                                <Col
                                                    md={1}
                                                    style={{
                                                        background: coloursTable[colour],
                                                        height: '10px',
                                                        width: '1px',
                                                        borderRadius: '5px',
                                                    }}></Col>
                                                <Col md={6} style={{ width: 'auto' }}>
                                                    {meaning}
                                                </Col>
                                            </Row>
                                        );
                                    })}{' '}
                            </div>
                        </Row>{' '}
                        <Row style={{ paddingTop: '0px' }}>
                            <h6>Last Updated on {convertUnixToIST(new Date())} </h6>
                        </Row>
                        <Row style={{ paddingTop: '0px' }}>
                            <h5>2 of 4 stalls occupied </h5>
                        </Row>
                    </Col>
                </Row>{' '}
                <Row style={{ height: '534px' }}>
                    {' '}
                    {floorPlanUrl && (
                        <OccupantsLayoutSVG2
                            floorPlanUrl={floorPlanUrl}
                            activeDevice={activeDevices}
                            currentState={graphState}
                            //Red and Green device ids
                            elementsToGreen={getGreenIds(graphState)}
                            elementsToRed={getRedIds(graphState)}
                            // ToolTipData
                            // vrfTooltipData={vrfDataTooltip}
                            // occupancyTooltipData={occDataTooltip}
                            toolTipData1={toolTipData ?? []}
                            // Loading status
                            isDataLoading={false}
                        />
                    )}
                </Row>
            </Card>
        </Col>
    );
};

export default OccupantsLayout2;
