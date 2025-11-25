import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
// import { getDataOAHULayout, getDataOccupancyLayout } from 'helpers/api/services/Clairco/customerSide/occupancy';
import { coloursTable } from 'appConstants/propertyTable';
import { OccupantsLayoutSVG } from './OccupantsLayoutSVG';
import { convertUnixToIST } from 'utils/timeFunctions';
import { divyaSreeAHULayout } from 'appConstants/dataToSvg';
type Legands = {
    OCCUPANCY: { green: string; red: string; grey: string };
    'VRF-VRV': { green: string; red: string; grey: string };
};
const LayoutAHU = () => {
    const [graphState, setGraphState] = useState('VRF-VRV');
    const [greenOccupancy, setGreenOccupancy] = useState({});
    const [redOccuancy, setRedOccupancy] = useState({});
    const [greenVRF, setGreenVRF] = useState({});
    const [redVRF, setRedVRF] = useState({});
    const [occupancyDeviceIds, setOccupancyDeviceIds] = useState({});
    const [lastUpdated, setLastUpdated] = useState<any>('');
    const [occDataTooltip, setOccDataTooltip] = useState();
    const [vrfDataTooltip, setVrfDataTooltip] = useState();
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [ahuData, setAhuData] = useState<any>();

    const changeGraphState = async (state: any) => {
        // console.log('Graph option changed', state);
        setGraphState(state);
    };
    const graphOptions: Record<string, string> = {
        'VRF-VRV': 'VRF-VRV',
        OCCUPANCY: 'OCCUPANCY',
    };
    const legands: Legands = {
        'VRF-VRV': {
            green: 'Cooling ON',
            red: 'Cooling Off',
            grey: 'Offline',
        },
        OCCUPANCY: {
            green: 'Unoccupied',
            red: 'Occupied',
            grey: 'Offline',
        },
    };

    // Function that makes fetches data from backend for the layouts
    const getDataForLayout = useCallback(async () => {
        try {
            setIsDataLoading(true);
            const data: any = divyaSreeAHULayout;
            // await getDataOAHULayout();
            // || { occupancyData: [], devices: [] };
            // console.log('res', data);
            const currentTime = Math.floor(Date.now() / 1000);
            const ahuData = data?.devices?.filter((doc: any) => doc?.name.split(' ')?.[0] === 'AHU');
            const occuData = data?.devices?.filter((doc: any) => doc?.name.split(' ')?.[0] !== 'AHU');
            // console.log('Data', ahuData, occuData);
            //
            let greenElementsOccu = occuData
                .filter(
                    (doc: any) =>
                        doc?.rawData?.occupancy?.metaData?.occupancy_number != 0 &&
                        typeof doc?.rawData?.occupancy?.metaData?.occupancy_number === 'number' &&
                        Number(currentTime - doc.rawData?.occupancy?.epochTime) > 0
                    //  &&
                    // Number(currentTime - doc.rawData?.occupancy?.epochTime) < 600 * 3
                )
                .map((doc: any) => doc.id);
            let redElementsOccu = occuData
                .filter(
                    (doc: any) =>
                        doc?.rawData?.occupancy?.metaData?.occupancy_number === 0 &&
                        Number(currentTime - doc.rawData?.occupancy?.epochTime) > 0
                    // &&
                    // Number(currentTime - doc.rawData?.occupancy?.epochTime) < 600 * 3
                )
                .map((doc: any) => doc.id);
            // console.log('Green elements occu', greenElementsOccu, redElementsOccu);
            const greenElementsVRF = ahuData
                .filter(
                    (doc: any) =>
                        doc?.rawData?.ahuRawData?.data?.['RELAY1_STATE'] === 1 &&
                        Number(currentTime - doc.rawData?.ahuRawData['Epoch time'])
                    // &&
                    // Number(currentTime - doc.rawData?.ahuRawData['Epoch time']) < 600 * 3
                )
                .map((doc: any) => doc?.id);

            const redElementsVRF = ahuData
                .filter(
                    (doc: any) =>
                        Number(doc?.rawData?.ahuRawData?.data?.RELAY1_STATE) === 0 &&
                        Number(currentTime - doc.rawData?.ahuRawData['Epoch time']) > 0
                    //  &&
                    // Number(currentTime - doc.rawData?.ahuRawData['Epoch time']) < 600 * 3
                )
                .map((doc: any) => doc?.id);
            // const lastUpdated = convertUnixToIST(
            //     Math.max(...ahuData.map((doc: any) => doc.rawData?.ahuRawData['Epoch time']))
            // );
            const occupancyDeviceIdMapper = occuData?.reduce(
                (accu: Record<string, string>, doc: { id: string; name: string }) => {
                    accu[doc.id] = doc.name;
                    // accu["name"]=occuDummy[]
                    return accu;
                },
                {}
            );
            //  const occuDevice=Object.entries(  occupancyDeviceIdMapper).
            // VRF Tool tip data
            const deviceDataTooltip = ahuData.reduce((accu: any[], doc: any) => {
                const extracted = {
                    // name: doc?.rawData?.ahuRawData,
                    deviceId: doc?.id,
                    name: doc?.name ?? '',
                    ...doc?.rawData?.ahuRawData,
                };
                accu.push(extracted);
                return accu;
            }, []);
            // // Extracting occupants device id to count
            // console.log('Data1', greenElementsVRF);
            let occupantsDataToTooltip = occuData.reduce(
                (
                    accu: any[],
                    doc: any
                    // { deviceId: string; name: string; epochTime: number; metaData: { occupancy_number: number } }
                ) => {
                    const isDeviceOnline = Number(currentTime - doc?.rawData?.occupancy?.epochTime) > 0;
                    // &&
                    // Number(currentTime - doc?.rawData?.occupancy?.epochTime) < 600 * 3;

                    const extracted = {
                        name: doc.name,
                        deviceId: doc.id,
                        count: isDeviceOnline ? doc.rawData?.occupancy?.metaData.occupancy_number : 'Na',
                        updatedOn: convertUnixToIST(doc?.rawData?.occupancy?.epochTime),
                    };
                    accu.push(extracted);
                    // accu[doc.deviceId] = doc.metaData.occupancy_number || 0;
                    return accu;
                },
                []
            );
            const lastUpdatedTimeAHU = Math.max(...ahuData.map((doc: any) => doc?.rawData?.ahuRawData?.['Epoch time']));

            const lastUpdatedTimeOCCU = Math.max(
                ...occuData.map((doc: any) => doc?.rawData?.occupancy?.['epochTime'] ?? 0)
            );
            // const currentTime = Math.floor(Date.now() / 1000);
            // const timeDifference = currentTime - lastUpdatedTime;
            const lastUpdated = convertUnixToIST(Math.max(lastUpdatedTimeAHU, lastUpdatedTimeOCCU));
            // console.log('Last updated', lastUpdated);
            // if (timeDifference > 600) {
            //     greenElementsOccu = {};
            //     redElementsOccu = {};
            //     occupantsDataToTooltip = [];
            // }
            // Dummy data for occupancy Name
            // const occuDummy = {
            //     CS30929: 'Abdul Desk',
            //     CS10738: 'Srikanth Desk',
            //     CS30931: 'Srikanth Desk',
            //     CS30947: 'Neeraj Desk',
            //     CS10475: 'Venkatesh Desk',
            //     CS30653: 'Pantry',
            //     CS30821: 'Murali Desk',
            //     CS10750: 'Meeting Room 2',
            //     CS30966: 'Meeting Room 1',
            //     CS5336: 'Meeting Room 1',
            //     CS30963: 'Shiva Desk',
            //     CS30879: 'Manish Desk',
            // };
            const occuDummy = {
                CS30929: 'Abdul Desk',
                CS10738: 'Naresh Desk',
                CS30931: 'Srikanth Desk',
                CS30963: 'Neeraj Desk',
                CS30879: 'Venkatesh Desk',
                CS30653: 'Pantry',
                CS30821: 'Murali Desk',
                CS10750: 'Meeting Room 2',
                CS30966: 'Meeting Room 1',
                CS5336: 'Meeting Room 1',
                CS4158: 'Shiva Desk',
                CS4066: 'Manish Desk',
                CS10475: 'Vinneth Desk',
                CS30947: 'Arun Desk',
            };
            // Updating the name to AliasName
            // for (let i = 0; i < occupantsDataToTooltip.length; i++) {
            //     const currentName = occupantsDataToTooltip[i].name;

            //     occupantsDataToTooltip[i]['name'] = occuDummy[currentName as keyof typeof occuDummy];
            // }

            //Colour inverted on Occupancy- part of UX
            setAhuData(ahuData);
            setGreenOccupancy(redElementsOccu);
            setRedOccupancy(greenElementsOccu);
            setGreenVRF(greenElementsVRF);
            setRedVRF(redElementsVRF);
            setOccupancyDeviceIds(occupancyDeviceIdMapper);
            setLastUpdated(lastUpdated);
            setOccDataTooltip(occupantsDataToTooltip);
            setVrfDataTooltip(deviceDataTooltip);
            setIsDataLoading(false);
        } catch (error) {
            console.log(error);
            setIsDataLoading(false);
        }
    }, []);
    useEffect(() => {
        getDataForLayout();
        // return ()=>
    }, []);
    // useEffect(() => {
    //     // console.log('Data to tooltip', occDataTooltip, vrfDataTooltip);
    // }, [occDataTooltip, vrfDataTooltip]);
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
                            <h6>Bengaluru &gt; Clairco &gt; 1st Floor </h6>
                        </Row>
                    </Col>
                    <Col md={6} style={{ paddingTop: '20px' }}>
                        {' '}
                        <Nav>
                            {Object.keys(graphOptions).map((option: any) => {
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
                                                        graphState === graphOptions[option] ? '#00695C' : '#008675',
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
                                                {option == 'VRF-VRV' ? 'AHU ' : 'Occupancy'}
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
                    </Col>
                    {/* Occupants SVG */}
                </Row>{' '}
                <Row style={{ height: '534px' }}>
                    {' '}
                    <OccupantsLayoutSVG
                        currentState={graphState}
                        elementsToGreen={graphState === 'VRF-VRV' ? greenVRF : greenOccupancy}
                        elementsToRed={graphState === 'VRF-VRV' ? redVRF : redOccuancy}
                        occupancyDeviceIds={occupancyDeviceIds}
                        vrfTooltipData={vrfDataTooltip}
                        occupancyTooltipData={occDataTooltip}
                        isDataLoading={isDataLoading}
                        ahuData={ahuData}
                    />
                </Row>
            </Card>
        </Col>
    );
};

export default LayoutAHU;
