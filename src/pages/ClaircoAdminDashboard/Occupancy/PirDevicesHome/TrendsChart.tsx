import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';

import { coloursTable } from 'appConstants/propertyTable';
import { convertUnixToIST } from 'utils/timeFunctions';
// import { fetchTrendsDPT } from 'helpers/api/services/Clairco/customerSide/ahu';
// import { roundToOneDecimal } from 'utils/maths';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getOccupancyTrendsData } from 'helpers/api/services/Clairco/customerSide/occupancy';
const TrendsChart = ({
    Building = '',
    Floor = '',
    Parameter = '',
    Sensor = '',
    // sensorNameAHU,
    sensorNameoCCU,
    deviceId,
}: any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };

    // const deviceModesReverseMapping: { [key: number]: string } = { 1: 'Cool', 2: 'Heat', 3: ' Ventilation' };
    const parameters: { [key: string]: string } = {
        a: 'Zone Temperature',
        b: 'Occupancy',
        c: 'Humidity',
    };

    const graphOptions: { [key: string]: string } = { a: 'live', b: 'aggregated' };
    const [graphState, setGraphState] = useState('live');
    const [timeGroup, setTimeGroup] = useState<any>(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.a);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.a);
    const [graphXAxis, setGraphXAxis] = useState([]);
    // new`
    const [temp, setTemp] = useState([]);
    const [humidity, setHumidity] = useState([]);
    const [occupancy, setOccupancy] = useState([]);

    // Function that returns graph data corresponding to the user selection
    const getGraphData = (graphState: any) => {
        try {
            if (graphState === parameters.a) return temp;
            else if (graphState === parameters.b) return occupancy;
            else if (graphState === parameters.c) return humidity;
        } catch (error) {
            return [];
        }
    };
    // Function switches X-Axis time array depending on BTU or AHU selected by user

    // Function to get Live data For OCCUPANCY Trends Graph
    const getLiveDataAPI = useCallback(
        async (timeDifference: any) => {
            try {
                if (!sensorNameoCCU) return;

                const deviceType = deviceTypeId['PIR'];
                // // console.log('Epoch time in one hour', startEpoch, timeGroup, convertUnixToIST(startEpoch));
                const data = await getOccupancyTrendsData({
                    sensorName: sensorNameoCCU,
                    timeFrameInHours: timeDifference,
                    deviceTypeId: deviceType,
                });
                const tempArray = data?.data?.map((doc: any) => doc?.data?.RTEMP);
                const humidityArray = data?.data?.map((doc: any) => doc?.data?.HUMI);
                const occupancyArray = data?.data?.map((doc: any) => doc?.data?.OCCUPANCY);
                const xAxisArray = data?.data?.map((doc: any) => convertUnixToIST(doc?.['Epoch time']));

                setTemp(tempArray);
                setHumidity(humidityArray);
                setOccupancy(occupancyArray);
                setGraphXAxis(xAxisArray);
            } catch (error) {
                console.log(error);
            }
        },
        [sensorNameoCCU]
    );

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
            data: graphXAxis,
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

                if (graphPara === parameters.a) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + '°C <br/>';
                    });
                } else if (graphPara === parameters.b) {
                    values.forEach((item: any) => {
                        toolTipContent += item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' <br/>';
                    });
                } else if (graphPara === parameters.c) {
                    //Humidity
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' % <br/>';
                    });
                }
                // } else if (graphPara === parameters.f) {
                //     values.forEach((item: any) => {
                //         toolTipContent +=
                //             item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' M³ <br/>';
                //     });
                // } else if (graphPara === parameters.e) {
                //     values.forEach((item: any) => {
                //         toolTipContent +=
                //             item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' M³/HR <br/>';
                //     });
                // } else if (graphPara === parameters.i) {
                //     values.forEach((item: any) => {
                //         toolTipContent +=
                //             item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' GJH <br/>';
                //     });
                // } else if (graphPara === parameters.j) {
                //     values.forEach((item: any) => {
                //         toolTipContent +=
                //             item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' GJ<br/>';
                //     });
                // } else if (graphPara === parameters.k) {
                //     values.forEach((item: any) => {
                //         toolTipContent +=
                //             item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' Pa<br/>';
                //     });
                // } else {
                //     values.forEach((item: any) => {
                //         toolTipContent +=
                //             item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ' + ' <br/>';
                //     });
                // }

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
                        // if (graphPara === parameters.b) {
                        //     const fanSpeedLabels = [null, 'High', 'Medium', 'Low', 'Auto'];
                        //     return fanSpeedLabels[value] || value;
                        // } else if (graphPara === parameters.d) {
                        //     const deviceStatusModes = [
                        //         null,
                        //         // 'Auto',
                        //         'Cool',
                        //         'Heat',
                        //         'Ventilation',
                        //     ];
                        //     return deviceStatusModes[value];
                        // } else {
                        return `${value}`;
                        // }
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
