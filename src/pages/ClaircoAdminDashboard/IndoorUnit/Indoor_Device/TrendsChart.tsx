import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';

import { coloursTable, propertyTable, unitTables } from 'appConstants/propertyTable';
import {
    getAggregateDataOfIndoorUnit,
    getLiveDataOfIndoorUnit,
} from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import { convertUnixToIST } from 'utils/timeFunctions';
import { colors } from 'react-select/dist/declarations/src/theme';
import { deviceModesReverseMapping, deviceTypeId } from 'appConstants/DeviceMappingConstants';
import {
    getArrgregateIndoorUnitData,
    getIndoorUnitLiveData,
} from 'helpers/api/services/Clairco/adminSide/indoorDevices';
import { roundToOneDecimal } from 'utils/maths';
const TrendsChart = ({
    Building = '',
    Floor = '',
    Parameter = '',
    Sensor = '',
    deviceAliasName,
    deviceName,
    tempFucnction,
    fanSpeedFunction,
    getLastUpdated,
    setIsIndoorDeviceOn,
    setCardData,
}: any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };
    const parameters: { [key: string]: string } = {
        d: 'Device Status',
        a: 'Zone Temperature',
        c: 'Set Temperature',
        b: 'Fan Speed',
        e: 'Modes',
    };

    //Mapping moodified to avoid the graph from plunging into zero State
    const fanSpeedObject: { [key: string]: number } = {
        Auto: 1,
        Low: 2,
        'Low+': 3,
        Med: 4,
        'Med+': 5,
        High: 6,
    };
    const fanSpeedReverseMapping: { [key: number]: string } = {
        1: 'Auto',
        2: 'Low',
        3: 'Low+',
        4: 'Med',
        5: 'Med+',
        6: 'High',
    };
    const deviceStatusConstant: { [key: string]: number } = {
        OFF: 1,
        ON: 2,
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

    const graphOptions: { [key: string]: string } = { a: 'Live', b: 'Aggregate' };
    const [graphState, setGraphState] = useState(graphOptions.a);
    const [timeGroup, setTimeGroup] = useState(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.d);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.a);
    // states to store parameters coming from api
    const [deviceStatus, setDeviceStatus] = useState<number[]>([]);
    const [zoneTemp, setZoneTemp] = useState([]);
    const [setTemp, setSetTemp] = useState([]);
    const [fanSpeed, setFanSpeed] = useState([]);
    const [mode, setMode] = useState([]);
    const [xAxis, setXAxis] = useState<string[]>([]);
    const [updatedTime, setUpdatedaTime] = useState('');

    function getGraphData(graphPara: any) {
        try {
            if (graphPara === parameters.a) return zoneTemp;
            else if (graphPara === parameters.b) return fanSpeed;
            else if (graphPara === parameters.c) return setTemp;
            else if (graphPara === parameters.d) return deviceStatus;
            else return mode;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    // const [autoFanTime, setAutoFanTime] = useState([]);
    // const isDeviceOn = async (deviceName: any, input: any) => {
    //     try {
    //         if (!input) return;
    //         // let isOn = 'OFF';
    //         // for (let i = 0; i < input.length; i++) {
    //         //     if (input[i].Status == 'ON') {
    //         //         return true;
    //         //     }
    //         // }
    //         return input[input.length - 1].Status === 'ON' ? true : false;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // Function to get Live data
    const getTrendData = useCallback(
        async (sensorName: string) => {
            try {
                if (!sensorName) return;
                const deviceTypeId1 = deviceTypeId['VRV/VRF'];
                const res: any = (await getIndoorUnitLiveData(deviceTypeId1, sensorName, 24)) ?? {};
                const xAxisData = res?.data?.reverse()?.map((data: { 'Epoch time'?: string | number }) => {
                    const convertedTime = convertUnixToIST(data?.['Epoch time']);
                    return convertedTime;
                });
                const deviceStatusData: number[] = res?.data?.map((data: { Status?: string }) =>
                    data?.['Status'] === 'ON' ? 2 : 1
                );
                const zoneTempData = res?.data?.map((data: { 'Amb Temp'?: number }) =>
                    data?.['Amb Temp'] ? roundToOneDecimal(data?.['Amb Temp']) : null
                );
                const fanspeedData = res?.data?.map((data: { 'Fan Speed'?: string }) =>
                    data?.['Fan Speed'] ? fanSpeedObject[data?.['Fan Speed']] : null
                );
                const setTempData = res?.data?.map((data: { 'Set Temp'?: number }) =>
                    data?.['Set Temp'] ? roundToOneDecimal(data?.['Set Temp']) : null
                );
                const modeData = res?.data?.map((data: { Mode?: string }) =>
                    data?.['Mode'] ? deviceModes[data?.['Mode']] : null
                );
                setDeviceStatus(deviceStatusData ?? []);
                setXAxis(xAxisData ?? []);
                setZoneTemp(zoneTempData ?? []);
                setFanSpeed(fanspeedData ?? []);
                setSetTemp(setTempData ?? []);
                setMode(modeData ?? []);
            } catch (error) {
                console.log(error);
                setDeviceStatus([]);
                setXAxis([]);
                setZoneTemp([]);
                setFanSpeed([]);
                setSetTemp([]);
                setMode([]);
            }
        },
        [graphState, deviceName, timeGroup]
    );

    // Function to get Aggregate Data
    const getAggregateData = useCallback(async () => {
        try {
            const data = await getArrgregateIndoorUnitData(deviceName, timeGroup);
            const zoneTempAvg = data.data.map((doc: any) => {
                return doc.averages?.['Amb Temp Avg'] ? roundToOneDecimal(doc.averages?.['Amb Temp Avg']) : null;
            });
            const averageTime = data.data.map((doc: any) => {
                return doc.averages?.['Avg Epoch Time'] ? convertUnixToIST(doc.averages?.['Avg Epoch Time']) : null;
            });

            const setTempAverage = data.data.map((doc: any) => {
                return doc.averages?.['Set Temp Avg'] ? roundToOneDecimal(doc.averages?.['Set Temp Avg']) : null;
            });

            const averageStatus = data?.data?.map((doc: any) => {
                return doc?.averages?.['Most Frequent Status']
                    ? doc?.averages?.['Most Frequent Status'] === 'OFF'
                        ? 1
                        : 2
                    : null;
            });
            const averageMode = data.data.map((doc: any) =>
                doc.averages['Most Frequent Mode'] ? deviceModes[doc.averages['Most Frequent Mode']] : null
            );

            // const response = data.data as { averages: { 'Avg Epoch Time': number } }[];

            // const updatedTime = convertUnixToIST(response[response.length - 1].averages['Avg Epoch Time']);

            setDeviceStatus(averageStatus ?? []);
            setXAxis(averageTime ?? []);
            setZoneTemp(zoneTempAvg ?? []);
            setFanSpeed([]);
            setSetTemp(setTempAverage ?? []);
            setMode(averageMode ?? []);
        } catch (error) {
            console.log(error);

            setDeviceStatus([]);
            setXAxis([]);
            setZoneTemp([]);
            setFanSpeed([]);
            setSetTemp([]);
            setMode([]);
        }
    }, [graphState, deviceName, timeGroup, tempFucnction, fanSpeedFunction]);
    const changeGraphState = async (current: string) => {
        try {
            setGraphState(graphOptions[current]);
        } catch (error) {
            console.log(error);
        }
    };
    const changeTimeGroup = async (timeGroupKey: string) => {
        try {
            // console.log('Time Gap changed:', timeGroupKey);
            setTimeGroup(timeGrouingConstants[timeGroupKey]);
        } catch (error) {
            console.log(error);
        }
    };

    //Changes the graph with the Parameter selection : Parameter is passed -"a","b" etc from parameters object defined in the start of this module
    const changeGraphParamer = async (parameter: string) => {
        try {
            setGraphPara(parameters[parameter]);
            setGraphLinecolour(coloursTable[parameter]);
        } catch (error) {
            console.log(error);
        }
    };

    //Echarts Graph Option
    const option = {
        grid: {
            left: '10%', // Adjust the left margin
            right: '10%', // Adjust the right margin
            bottom: '25%', // Increase the bottom margin to make space for the labels
        },
        xAxis: {
            type: 'category',
            data: xAxis,
            axisLabel: {
                rotate: 60, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'right',
                },
                margin: 30,
            },
        },

        //Tool tip
        tooltip: {
            trigger: 'axis',
            show: true,
            formatter: function (values: any) {
                let toolTipContent = values[0].name + '<br/>';
                // Temperature
                if (graphPara === parameters.a || graphPara === parameters.c) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ' + '°C <br/>';
                    });
                }
                // Fan speed
                else if (graphPara === parameters.b) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker +
                            ' ' +
                            item.seriesName +
                            ' ' +
                            ':' +
                            ' ' +
                            fanSpeedReverseMapping[item.value] +
                            ' <br/>';
                    });
                }
                // Device Mode
                else if (graphPara === parameters.e) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker +
                            ' ' +
                            item.seriesName +
                            ' ' +
                            ':' +
                            ' ' +
                            deviceModesReverseMapping[item.value] +
                            ' <br/>';
                    });
                } else if (graphPara === parameters.d) {
                    const deviceStatusModes = [null, 'OFF', 'ON'];
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker +
                            ' ' +
                            item.seriesName +
                            ' ' +
                            ':' +
                            ' ' +
                            deviceStatusModes[item.value] +
                            ' <br/>';
                    });
                }
                return toolTipContent;
            },
        },

        yAxis: [
            {
                type: 'value',
                name: graphPara,
                position: 'left',
                nameLocation: 'middle',
                minInterval: 1,
                nameTextStyle: {
                    padding: [0, 40, 50, 0],
                },

                axisLabel: {
                    formatter: function (value: any) {
                        if (graphPara === parameters.b) {
                            const fanSpeedLabels = [null, 'Auto', 'Low', 'Low+', 'Medium', 'Medium+', 'High'];
                            return fanSpeedLabels[value] || value;
                        } else if (graphPara === parameters.d) {
                            const deviceStatusModes = [null, 'OFF', 'ON'];
                            return deviceStatusModes[value];
                        } else if (graphPara === parameters.e) {
                            const deviceStatusModes = [
                                null,
                                'Auto',
                                'Heat',
                                'Dry',
                                'Fan',
                                'Cool',
                                'AutoHeat',
                                'AutoCool',
                            ];
                            return deviceStatusModes[value];
                        } else {
                            return `${value} ${unitTables[graphPara]}`;
                        }
                    },
                },
            },
        ],
        series: [
            {
                name: graphPara,
                data: getGraphData(graphPara),
                // graphPara === parameters.b ? fanSpeedData : graphPara == parameters.a ? ambTemperature : setTemp,
                type: 'line',
                connectNulls: true,
                // yAxisIndex: 0,
                symbol: 'diamond',
                symbolSize: 5,
                lineStyle: {
                    color: graphLineColour,
                },
            },
        ],
    };

    useEffect(() => {
        if (graphState === graphOptions.b) getTrendData(deviceName);
        if (graphState === graphOptions.b) getAggregateData();
    }, [graphState, timeGroup, deviceName, getTrendData, graphOptions.b, getAggregateData]);

    // useEffect(() => {
    //     getLastUpdated(updatedTime);
    // }, [updatedTime]);

    return (
        <>
            <Card>
                <Card.Body>
                    <Row>
                        <Tab.Container defaultActiveKey="live">
                            <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                                <div className="ChartHeading" style={{ width: '200px' }}>
                                    <h4 className="header-title">Trends ({graphState})</h4>
                                </div>
                                <Row>
                                    {' '}
                                    <div style={{ width: '200px', textAlign: 'center' }}>
                                        <h5> {graphPara == parameters.a ? 'Zone Temperature' : graphPara}</h5>
                                    </div>{' '}
                                    <div style={{ width: '200px' }}>
                                        {' '}
                                        <h6 style={{ textAlign: 'center' }}>{deviceAliasName}</h6>{' '}
                                    </div>{' '}
                                    <div style={{ width: '300px', fontSize: '12px' }}>
                                        {' '}
                                        <h6 style={{ fontSize: '10px' }}>Updated on {updatedTime}</h6>{' '}
                                    </div>
                                </Row>
                                <Nav as="ul" variant="pills" className="bg-nav-pills p-1 rounded">
                                    {/* Aggregate or Live selection area */}
                                    {Object.keys(graphOptions).map((option) => {
                                        return (
                                            <Nav.Item as="li" key={option}>
                                                {' '}
                                                <Nav.Link
                                                    style={{
                                                        background:
                                                            graphState == graphOptions[option] ? '#00695C' : '#008675',
                                                        border: '0px',
                                                        // height: '25px',
                                                        // backgroundColor: 'red',
                                                    }}
                                                    as={Link}
                                                    className="py-1"
                                                    to="#"
                                                    eventKey="live"
                                                    // {graphOptions[key]}
                                                    onClick={() => changeGraphState(option)}>
                                                    {graphOptions[option]}
                                                </Nav.Link>
                                            </Nav.Item>
                                        );
                                    })}{' '}
                                    {/* ); */}
                                    {/* })} */}
                                </Nav>
                            </div>

                            {/* Time Period Selection Area */}
                            <Row>
                                <Col md={3}>
                                    <ButtonGroup>
                                        {Object.keys(timeGrouingConstants).map((key) => (
                                            <Button
                                                key={key}
                                                // disabled={key !== 'a'}
                                                // variant="primary"
                                                // className="btn btn-outline-info"
                                                active={key == timeGroup}
                                                onClick={(e) => changeTimeGroup(key)}
                                                style={{
                                                    background:
                                                        timeGroup == timeGrouingConstants[key] ? '#00695C' : '#008675',
                                                    border: '0px',
                                                    // backgroundColor: 'red',
                                                }}>
                                                {timeGrouingConstants[key]} hr
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                    {/* Parameter selection area */}
                                    {Object.keys(parameters).map((parameter) => {
                                        return (
                                            <div
                                                onClick={() => changeGraphParamer(parameter)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: '20px',
                                                }}
                                                key={parameter}>
                                                {' '}
                                                <div
                                                    style={{
                                                        background: coloursTable[parameter],
                                                        height: '10px',
                                                        width: '10px',
                                                        borderRadius: '5px',
                                                        marginRight: '10px',
                                                    }}></div>
                                                <div
                                                    className="form-check"
                                                    style={{ padding: '20px', justifyContent: 'center' }}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id={parameter}
                                                        checked={graphPara === parameters[parameter]}
                                                    />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        {parameters[parameter]}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}{' '}
                                </Col>
                                <Col md={9}>
                                    {/* <Tab.Content>
                                        <Tab.Pane eventKey="live"> */}
                                    <ReactEcharts option={option} style={{ height: '500px', width: '100%' }} />
                                    {/* </Tab.Pane>
                                    </Tab.Content> */}
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default TrendsChart;
