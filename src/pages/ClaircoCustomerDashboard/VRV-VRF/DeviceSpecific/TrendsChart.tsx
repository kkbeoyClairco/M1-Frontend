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
import { deviceModesReverseMapping } from 'appConstants/DeviceMappingConstants';
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
}: any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };
    const parameters: { [key: string]: string } = {
        d: 'Device Status',
        a: 'Temperature',
        c: 'Set Temperature',
        b: 'Fan Speed',
        e: 'Modes',
    };

    //Mapping moodified to avoid the graph from plungig into zero State
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
    const deviceStatus: { [key: string]: number } = {
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

    const graphOptions: { [key: string]: string } = { a: 'live', b: 'aggregated' };
    const [graphState, setGraphState] = useState(graphOptions.a);
    const [timeGroup, setTimeGroup] = useState(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.d);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.a);
    const [deviceStatusArray, setDeviceStatusArray] = useState([]);
    const [ambTemperature, setAmbientTemperature] = useState([]);
    const [setTemp, setSetTemp] = useState([]);
    const [fanSpeedData, setFanSpeedData] = useState([]);
    const [xAxisCategory, setXAxisCategory] = useState([]);
    const [updatedTime, setUpdatedaTime] = useState('');
    const [modeArray, setModeArray] = useState([]);
    const [autoFanTime, setAutoFanTime] = useState([]);
    const isDeviceOn = async (deviceName: any, input: any) => {
        try {
            if (!input) return;
            // let isOn = 'OFF';
            // for (let i = 0; i < input.length; i++) {
            //     if (input[i].Status == 'ON') {
            //         return true;
            //     }
            // }
            return input[input.length - 1].Status === 'ON' ? true : false;
        } catch (error) {
            console.log(error);
        }
    };
    // Function to get Live data
    const getLiveDataAPI = useCallback(async () => {
        try {
            const data = await getLiveDataOfIndoorUnit(deviceName, timeGroup);
            const isOn = await isDeviceOn(deviceName, data.data);
            const tableData1 = data.data.reverse();
            const tableData = tableData1.map((data: any) => {
                return data['Amb Temp'];
            });
            const tableDataSetTemp = tableData1.map((data: any, i: number) => {
                return data['Set Temp'];
            });
            const time = tableData1.map((data: any, i: number) => {
                const convertedTime = convertUnixToIST(data['Epoch time']);

                return convertedTime;
            });
            const fanSpeed = tableData1.map((data: any, i: number) => {
                return fanSpeedObject[data['Fan Speed'] || 0];
            });

            // const autoFanModeTime = tableData1
            //     .filter((doc: any) => {
            //         return doc['Fan Speed'] === 'Auto';
            //         // convertTimeToDates(doc['Epoch time']);
            //     })
            //     .map((doc: any) => {
            //         return convertUnixToIST(doc['Epoch time']);
            //     });
            const statusArray = tableData1.map((doc: any) => deviceStatus[doc.Status]);
            const modeArray = tableData1.map((doc: any) => deviceModes[doc.Mode]);
            const updatedTime = convertUnixToIST(tableData1[tableData1.length - 1]['Epoch time']);

            setIsIndoorDeviceOn(isOn);
            setUpdatedaTime(updatedTime);
            setAmbientTemperature(tableData);
            tempFucnction(tableData[tableData.length - 1]);
            setXAxisCategory(time);
            setSetTemp(tableDataSetTemp);
            fanSpeedFunction(fanSpeed[0] || 0);
            setFanSpeedData(fanSpeed);
            setDeviceStatusArray(statusArray);
            setModeArray(modeArray);
        } catch (error) {
            console.log(error);
        }
    }, [graphState, deviceName, timeGroup, tempFucnction, fanSpeedFunction]);

    // Function to get Aggregate Data
    const getAggregateData = useCallback(async () => {
        try {
            const data = await getAggregateDataOfIndoorUnit(deviceName, timeGroup);
            // console.log('Aggregate data ', data);
            const ambientTempAvg = data.data.map((doc: any) => {
                return doc.averages['Amb Temp Avg'];
            });
            const averageTime = data.data.map((doc: any) => {
                return convertUnixToIST(doc.averages['Avg Epoch Time']);
            });

            const setTempAverage = data.data.map((doc: any) => {
                return doc.averages['Set Temp Avg'];
            });

            const averageStatus = data.data.map((doc: any) => deviceStatus[doc.averages['Most Frequent Status']]);
            const averageMode = data.data.map((doc: any) => deviceModes[doc.averages['Most Frequent Mode']]);
            const response = data.data as { averages: { 'Avg Epoch Time': number } }[];

            const updatedTime = convertUnixToIST(response[response.length - 1].averages['Avg Epoch Time']);

            // console.log('Auto fan time:', averageStatus, averageMode);
            //Fan speed data missing in aggregate. Needs to be added
            setXAxisCategory(averageTime);
            setUpdatedaTime(updatedTime);
            setAmbientTemperature(ambientTempAvg);
            setSetTemp(setTempAverage);
            setDeviceStatusArray(averageStatus);
            setModeArray(averageMode);
            // setAutoFanTime(autoFanModeTime);
        } catch (error) {
            console.log(error);
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
            data: xAxisCategory,
            axisLabel: {
                rotate: 60, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'right',
                },
                margin: 30,
            },
        },

        //Add tool tip with proper values for Paramertes
        tooltip: {
            trigger: 'axis',
            show: true,
            formatter: function (values: any) {
                let toolTipContent = values[0].name + '<br/>';
                if (graphPara === parameters.a || graphPara === parameters.c) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ' + '°C <br/>';
                    });
                } else if (graphPara === parameters.b) {
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
                } else if (graphPara === parameters.e) {
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
                }
                // values.forEach((item: any) => {
                //     toolTipContent +=
                //         item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ' + 'kWh <br/>';
                // });
                // console.log('tool tip', toolTipContent, values, deviceModesReverseMapping[values]);
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
    function getGraphData(graphPara: any) {
        try {
            if (graphPara === parameters.a) return ambTemperature;
            else if (graphPara === parameters.b) return fanSpeedData;
            else if (graphPara === parameters.c) return setTemp;
            else if (graphPara === parameters.d) return deviceStatusArray;
            else return modeArray;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    useEffect(() => {
        const setUpFetch = () => {
            if (graphState === graphOptions.a) {
                getLiveDataAPI();
                return setInterval(getLiveDataAPI, 30000);
            } else {
                getAggregateData();
                return setInterval(getAggregateData, 30000);
            }
        };
        const intervalId = setUpFetch();

        return () => {
            clearInterval(intervalId);
        };
    }, [graphState, timeGroup, deviceName]);

    useEffect(() => {
        getLastUpdated(updatedTime);
    }, [updatedTime]);

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
                                    {/* {Object.keys(graphOptions).map((key) => {
                                        return ( */}
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
                                                style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}
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
                                                        onClick={() => changeGraphParamer(parameter)}
                                                        checked={graphPara == parameters[parameter]}
                                                    />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        {parameters[parameter] == parameters.a
                                                            ? 'Zone Temperature'
                                                            : parameters[parameter]}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}{' '}
                                </Col>
                                <Col md={9}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="live">
                                            <ReactEcharts option={option} style={{ height: '500px', width: '850px' }} />

                                            {/* <Chart
                                                options={apexLineChartWithAnnotationOpts}
                                                series={
                                                    graphPara == parameters.b
                                                        ? fanSpeedData
                                                        : graphPara == parameters.a
                                                        ? ambTemperature
                                                        : setTemp
                                                }
                                                type="line"
                                                className="apex-charts"
                                                height={350}
                                            /> */}
                                        </Tab.Pane>
                                        {/* <Tab.Pane eventKey="aggregated">
                                            <ReactEcharts option={option} style={{ height: '500px', width: '100%' }} />
                                        </Tab.Pane> */}
                                    </Tab.Content>
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
