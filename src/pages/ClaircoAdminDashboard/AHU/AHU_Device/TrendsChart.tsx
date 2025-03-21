import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';

import { coloursTable, oneHourInMilliseconds, propertyTable, unitTables } from 'appConstants/propertyTable';
import {
    getAggregateDataOfIndoorUnit,
    getLiveDataOfIndoorUnit,
} from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import { convertDateToEpoch, convertUnixToIST } from 'utils/timeFunctions';
import { colors } from 'react-select/dist/declarations/src/theme';
import { fetchAHUTrends, fetchBTUTrendsData, fetchTrendsDPT } from 'helpers/api/services/Clairco/customerSide/ahu';
import { start } from 'repl';
import { roundToOneDecimal } from 'utils/maths';
import { deviceModesReverseMapping } from 'appConstants/DeviceMappingConstants';
const TrendsChart = ({
    sensorNameAHU,
    sensorNameBTU,
    deviceId,
}: // deviceAliasName,
// deviceName,
// tempFucnction,
// fanSpeedFunction,
// getLastUpdated,
// setIsIndoorDeviceOn,
any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };
    const fanSpeedReverseMapping: { [key: number]: string } = {
        1: 'High',
        2: 'Medium',
        3: 'Low',
        4: 'Auto',
    };

    const deviceModesReverseMapping: { [key: number]: string } = { 1: 'Cool', 2: 'Heat', 3: ' Ventilation' };
    const parameters: { [key: string]: string } = {
        a: 'Set Temperature',
        c: 'Return Air Temperature',
        b: 'Fan Speed',
        d: 'Mode',
        e: 'Flow Rate',
        f: 'Net Flow',
        g: 'Temp1',
        h: 'Temp2',
        i: 'Instant Energy',
        j: 'Total Energy',
        k: 'DPT',
    };

    // const fanSpeedObeject: { [key: string]: number } = {
    //     Auto: 0,
    //     'Very Low': 1,
    //     Low: 2,
    //     Med: 3,
    //     High: 4,
    //     'Very High': 5,
    // };

    const graphOptions: { [key: string]: string } = { a: 'live', b: 'aggregated' };
    const [graphState, setGraphState] = useState('live');
    const [timeGroup, setTimeGroup] = useState<any>(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.a);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.a);
    const [ambTemperature, setAmbientTemperature] = useState([]);
    const [setTemp, setSetTemp] = useState<any>([]);
    const [fanSpeedData, setFanSpeedData] = useState<any>([]);
    const [modesData, setModesData] = useState<any>([]);
    const [returnAirTempData, setReturnAirTempData] = useState<any>([]);
    const [btuXAxisCategory, setBtuXAxisCategory] = useState<any>([]);
    const [ahuXAxisCategory, setAhuXAxisCategory] = useState<any>([]);

    const [updatedTime, setUpdatedaTime] = useState('');
    const [autoFanTime, setAutoFanTime] = useState([]);

    const [flowRate, setFlowRate] = useState([]);
    const [netFlow, setNetFlow] = useState([]);
    const [temp1, setTemp1] = useState([]);
    const [temp2, setTemp2] = useState([]);
    const [IEnergy, setIEnergy] = useState([]);
    const [totalEnergy, setTotalEnergy] = useState([]);
    const [dptData, setDptData] = useState([]);
    const [dptXAxis, setDptXAxis] = useState([]);
    // console.log('Device Names', sensorNameAHU, sensorNameBTU);
    // Function that returns graph data corresponding to the user selection
    const getGraphData = (graphState: any) => {
        try {
            if (graphState === parameters.a) return setTemp;
            else if (graphState === parameters.b) return fanSpeedData;
            else if (graphState === parameters.c) return returnAirTempData;
            else if (graphState === parameters.d) return modesData;
            else if (graphState === parameters.e) return flowRate;
            else if (graphState === parameters.f) return netFlow;
            else if (graphState === parameters.g) return temp1;
            else if (graphState === parameters.h) return temp2;
            else if (graphState === parameters.i) return IEnergy;
            else if (graphState === parameters.j) return totalEnergy;
            else if (graphState === parameters.k) return dptData;
        } catch (error) {
            return [];
        }
    };
    // Function switches X-Axis time array depending on BTU or AHU selected by user
    const getXaxisData = (graphPara: any) => {
        try {
            if ([parameters.a, parameters.b, parameters.c, parameters.d].includes(graphPara)) return ahuXAxisCategory;
            else if (parameters.k === graphPara) return dptXAxis;
            else return btuXAxisCategory;
        } catch (error) {
            return [];
        }
    };

    const getDPTTrends = useCallback(
        async (timeDifference: any) => {
            try {
                if (!deviceId) return;
                const currentEpoch = convertDateToEpoch(new Date());
                const startEpoch = currentEpoch - oneHourInMilliseconds * timeDifference;
                const response = await fetchTrendsDPT(
                    deviceId,
                    Math.floor(startEpoch / 1000),
                    Math.floor(currentEpoch / 1000)
                );
                // console.log('DPT x axis', response);
                const values = response?.data?.map((doc: any) => {
                    return roundToOneDecimal(doc?.value);
                });
                const times = response?.data?.map((doc: any) => {
                    return convertUnixToIST(doc?.timestamp);
                });

                setDptData(values);
                setDptXAxis(times);
            } catch (error) {
                console.log(error);
            }
        },
        [deviceId]
    );

    // Function to get Live data
    const getLiveDataAPI = useCallback(
        async (timeDifference: any) => {
            try {
                if (!sensorNameAHU || !sensorNameBTU) return;
                const currentEpoch = convertDateToEpoch(new Date());
                const startEpoch = currentEpoch - oneHourInMilliseconds * timeDifference;
                //add the DEvice name, start time and end time
                // console.log('Epoch time in one hour', startEpoch, timeGroup, convertUnixToIST(startEpoch));
                const data = await fetchBTUTrendsData(
                    sensorNameBTU,
                    Math.floor(startEpoch / 1000),
                    Math.floor(currentEpoch / 1000)
                );
                const ahuData = await fetchAHUTrends(
                    sensorNameAHU,
                    Math.floor(startEpoch / 1000),
                    Math.floor(currentEpoch / 1000)
                );
                // console.log('AHU trends', sensorNameAHU, ahuData);
                //  BTU
                const flowRateArray = data?.data.reverse().map((doc: any) => doc.data.Flowrate);
                const netRateArray = data?.data.map((doc: any) => doc.data['Net Flow']);
                const temp1Array = data?.data.map((doc: any) => doc.data.Temp1);
                const temp2Array = data?.data.map((doc: any) => doc.data.Temp2);
                const instantEnergyArray = data?.data.map((doc: any) => doc.data['Instantaneous Energy Rate']);
                const totalEnergyArray = data?.data.map((doc: any) => doc.data['Total Energy']);
                const xAxisData = data?.data.map((doc: any) => convertUnixToIST(doc['Epoch time']['$numberDecimal']));
                // AHU
                const setTemperatures =
                    ahuData?.data?.reverse().map((doc: any) => roundToOneDecimal(doc.data.STEMP / 10)) || [];
                const fanSpeedArray = ahuData?.data?.map((doc: any) => doc.data.FANMODE + 1) || [];
                const modeArray = ahuData?.data?.map((doc: any) => doc.data.MODE) || [];
                const returnAirTempArray =
                    ahuData?.data?.map((doc: any) => roundToOneDecimal(doc.data.RTEMP / 10)) || [];
                const timeArray =
                    ahuData?.data?.map((doc: any) => convertUnixToIST(doc['Epoch time'].$numberDecimal)) || [];
                // console.log('AHU Data extracted:', fanSpeedArray);
                // AHU
                setSetTemp(setTemperatures);
                setModesData(modeArray);
                setFanSpeedData(fanSpeedArray);
                setReturnAirTempData(returnAirTempArray);
                setAhuXAxisCategory(timeArray);
                // BTU
                setFlowRate(flowRateArray);
                setNetFlow(netRateArray);
                setTemp1(temp1Array);
                setTemp2(temp2Array);
                setTotalEnergy(totalEnergyArray);
                setIEnergy(instantEnergyArray);
                setBtuXAxisCategory(xAxisData);
            } catch (error) {
                console.log(error);
            }
        },
        [sensorNameBTU, sensorNameAHU]
    );

    // Function to get Aggregate Data
    // const getAggregateData = useCallback(async () => {
    //     try {
    //         // console.log('Aggregateapi');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, [graphState]);
    const changeGraphState = async (current: string) => {
        try {
            setGraphState(graphOptions[current]);
        } catch (error) {
            console.log(error);
        }
    };
    const changeTimeGroup = async (timeGroupKey: string) => {
        try {
            // console.log(timeGrouingConstants[timeGroupKey]);
            setTimeGroup(timeGrouingConstants[timeGroupKey]);
        } catch (error) {
            console.log(error);
        }
    };

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
            bottom: '20%', // Increase the bottom margin to make space for the labels
        },
        xAxis: {
            type: 'category',
            data: getXaxisData(graphPara),
            axisLabel: {
                rotate: 60, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'right',
                },
                // interval: 1,
                margin: 30,
            },
        },

        tooltip: {
            trigger: 'axis',
            formatter: function (values: any) {
                let toolTipContent = values[0].name + '<br/>';

                if (graphPara === parameters.b) {
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
                } else if (graphPara === parameters.d) {
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
                } else if (
                    graphPara === parameters.a ||
                    graphPara === parameters.c ||
                    graphPara === parameters.g ||
                    graphPara === parameters.h
                ) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' °C <br/>';
                    });
                } else if (graphPara === parameters.f) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' M³ <br/>';
                    });
                } else if (graphPara === parameters.e) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' M³/HR <br/>';
                    });
                } else if (graphPara === parameters.i) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' GJH <br/>';
                    });
                } else if (graphPara === parameters.j) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' GJ<br/>';
                    });
                } else {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ' + ' <br/>';
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
                    padding: [0, 40, 40, 0],
                },

                axisLabel: {
                    formatter: function (value: any) {
                        if (graphPara === parameters.b) {
                            const fanSpeedLabels = [null, 'High', 'Medium', 'Low', 'Auto'];
                            return fanSpeedLabels[value] || value;
                        } else if (graphPara === parameters.d) {
                            const deviceStatusModes = [
                                null,
                                // 'Auto',
                                'Cool',
                                'Heat',
                                'Ventilation',
                            ];
                            return deviceStatusModes[value];
                        } else {
                            return `${value}`;
                        }
                    },
                },
            },
        ],
        series: [
            {
                name: graphPara,
                data: getGraphData(graphPara),
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
        getLiveDataAPI(timeGroup);
        getDPTTrends(timeGroup);
    }, [getLiveDataAPI, timeGroup]);

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
                                        <h5> {graphPara}</h5>
                                    </div>{' '}
                                    <div style={{ width: '200px' }}>
                                        {' '}
                                        {/* <h6 style={{ textAlign: 'center' }}>{}</h6>{' '} */}
                                    </div>{' '}
                                    <div style={{ width: '300px', fontSize: '12px' }}>
                                        {' '}
                                        {/* <h6 style={{ fontSize: '10px' }}>Updated on {updatedTime}</h6>{' '} */}
                                    </div>
                                </Row>

                                {/* Currently only live data is used, if aggregate is needed this can be used,otherwise useless */}
                                <Nav as="ul" variant="pills" className="bg-nav-pills p-1 rounded">
                                    {Object.keys([]).map((option) => {
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
                                <Col md={3} xs={12}>
                                    <ButtonGroup style={{ display: 'flex', flexWrap: 'wrap' }}>
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
                                                    // flex: '1 1 auto',

                                                    // backgroundColor: 'red',
                                                }}>
                                                {timeGrouingConstants[key]} hr
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                    {/* Parameter selection area */}
                                    <div className="flex-container">
                                        <div className="parameter-container" style={{ paddingTop: '20px' }}>
                                            {' '}
                                            {Object.keys(parameters).map((parameter) => {
                                                return (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '6px',
                                                            paddingLeft: '20px',
                                                        }}
                                                        onClick={() => changeGraphParamer(parameter)}
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
                                                            style={{
                                                                paddingLeft: '20px',
                                                                paddingTop: '10px',
                                                                paddingBottom: '0px',
                                                                justifyContent: 'center',
                                                            }}>
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="flexRadioDefault"
                                                                id={parameter}
                                                                // onClick={() => changeGraphParamer(parameter)}
                                                                checked={graphPara == parameters[parameter]}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="flexRadioDefault1">
                                                                {parameters[parameter]}
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>{' '}
                                    </div>
                                </Col>

                                <Col md={9} className="chart-container">
                                    <ReactEcharts
                                        option={option}
                                        style={{ height: '90vh', width: '100%', overflow: 'clip' }}
                                    />
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
