import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';

import { coloursTable } from 'appConstants/propertyTable';
import { convertDateToEpoch, convertUnixToIST, getCurrentEpochTime } from 'utils/timeFunctions';

import {} from 'helpers/api/services/Clairco/customerSide/occupancy';
import { getPCSAggregate, getPcsData } from 'helpers/api/services/Clairco/customerSide/pcs';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { HyperDatepicker } from 'components';
import { TrendsSkelton3 } from 'components/ClaircoSkeltonLoaders/TrendsSkelton3';
const TrendsChart = ({ sensorName }: any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };

    const parameters: { [key: string]: string } = {
        d: 'Total Count',
    };
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 1)));
    const [endDate, setEndDate] = useState<Date>(new Date());

    const graphOptions: { [key: string]: string } = { b: 'Aggregate', a: 'Live' };
    const [graphState, setGraphState] = useState(graphOptions.b);
    const [timeGroup, setTimeGroup] = useState<any>(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.d);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.b);
    const [isLoading, setIsLoading] = useState(false);
    const [graphXAxis, setGraphXAxis] = useState([]);
    const [outCount, setOutCount] = useState([1, 2, 3, 4]);
    // new`

    const [occupancy, setOccupancy] = useState([]);

    // Function that returns graph data corresponding to the user selection
    const getGraphData = (graphState: any) => {
        try {
            // if (graphState === parametegraphOptionsrs.a) return temp;
            // else if (graphState === parameters.d)
            return occupancy;
            // else if (graphState === parameters.c) return humidity;
        } catch (error) {
            return [];
        }
    };

    const processResponseData = useCallback((res: any) => {
        const occupancyArray = res?.data?.data?.reverse().map((doc: any) => doc?.inCount);
        const xAxisArray = res?.data?.data?.map((doc: any) => convertUnixToIST(doc?.['timestamp']));
        setOccupancy(occupancyArray);
        setGraphXAxis(xAxisArray);
    }, []);
    // Function to get Live data
    const getLiveDataAPI = useCallback(async (sensorName: string, timeFrame: string | number) => {
        try {
            if (!sensorName) return;
            const endTime = getCurrentEpochTime() * 1000;
            const hour = 3600 * 1000;
            const startTime = endTime - hour * Number(timeFrame);
            setIsLoading(true);
            const res = await getPcsData(sensorName, startTime.toString(), endTime.toString());
            processResponseData(res);
            setOutCountArray(res);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }, []);
    // Function to get Aggregate data
    const fetchAggregateData = async (sensorName: string, timeFrame: string | number) => {
        try {
            if (!sensorName) return;
            setIsLoading(true);
            const endTime = getCurrentEpochTime() * 1000;
            const hour = 3600 * 1000;
            const startTime = endTime - hour * Number(timeFrame);
            const res = await getPCSAggregate(sensorName, startTime.toString(), endTime.toString());
            processResponseData(res);
            setOutCount([]);
        } catch (error) {
            setOccupancy([]);
            setGraphXAxis([]);

            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const changeGraphState = async (current: string) => {
        try {
            setGraphState(graphOptions[current]);
        } catch (error) {
            console.log(error);
        }
    };
    const changeTimeGroup = async (timeGroupKey: string) => {
        try {
            setTimeGroup(timeGrouingConstants[timeGroupKey]);
        } catch (error) {
            console.log(error);
        }
    };

    const setOutCountArray = async (res: any) => {
        try {
            const outCountArray = res?.data?.data?.map((doc: any) => doc?.outCount);

            setOutCount(outCountArray);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDatePick = useCallback(async () => {
        try {
            if (!sensorName) return;
            const start = startDate.setHours(0, 0, 0, 0);
            const end = endDate.setHours(0, 0, 0, 0);

            const startEpochTime = convertDateToEpoch(start);
            const endEpochTime = convertDateToEpoch(end);
            if (graphState === graphOptions.a && endEpochTime - startEpochTime > 3600 * 24 * 1000) {
                alert('Please select a 24-hour range for live data.');
                return;
            }

            const fetchData = async () => {
                if (graphState === graphOptions.b) {
                    const res = await getPCSAggregate(sensorName, startEpochTime.toString(), endEpochTime.toString());
                    processResponseData(res);
                    setOutCount([]);
                } else {
                    const res = await getPcsData(sensorName, startEpochTime.toString(), endEpochTime.toString());
                    processResponseData(res);
                    setOutCountArray(res);
                }
            };

            await fetchData();
        } catch (e) {
            console.log('Error', e);
        } finally {
            setTimeGroup(5);
            setIsLoading(false);
        }
    }, [sensorName, startDate, endDate, graphState, graphOptions, processResponseData]);
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
        // seres: {
        //     type: 'bar',
        // },
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
        toolbox: {
            feature: {
                saveAsImage: {},
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
                        return `${value}`;
                    },
                },
            },
        ],
        series: [
            {
                name: graphPara,
                data: getGraphData(graphPara),
                type: graphState === graphOptions.b ? 'bar' : 'line',
                connectNulls: true,
                // yAxisIndex: 0,
                symbol: 'diamond',
                symbolSize: 5,
                lineStyle: {
                    // color: graphLineColour,
                },
            },
            {
                name: 'OutCount',
                data: outCount,
                type: 'line',
                connectNulls: true,
                // yAxisIndex: 0,
                symbol: 'diamond',
                symbolSize: 5,
                lineStyle: {
                    // color: 'red',
                },
            },
        ],
    };
    useEffect(
        function changeTimeSelection() {
            setTimeGroup(1);
        },
        [graphState]
    );

    useEffect(
        function apiCallHandler() {
            if (!Object.values(timeGrouingConstants).some((val) => val == timeGroup)) return;
            if (graphState === graphOptions.b) fetchAggregateData(sensorName, timeGroup);
            else if (graphState === graphOptions.a) getLiveDataAPI(sensorName, timeGroup);
        },
        [getLiveDataAPI, timeGroup, graphState, sensorName]
    );

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
                                        {/* <h5> {graphPara}</h5> */}
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
                                    {Object.keys(graphOptions).map((option) => {
                                        return (
                                            <Nav.Item as="li" key={option}>
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
                                </Nav>
                            </div>
                            {/* Date Picker for Aggregate */}
                            {/* {graphState === graphOptions.b ? ( */}
                            <Row>
                                <div className="d-flex flex-column flex-lg-row align-items-center p-2">
                                    <label style={{ padding: '10px' }} htmlFor="">
                                        From
                                    </label>
                                    <HyperDatepicker
                                        value={startDate}
                                        inputClass="form-control-light"
                                        onChange={(date: any) => {
                                            setStartDate(date);
                                        }}
                                    />
                                    <label htmlFor="" style={{ padding: '10px', marginLeft: '50px' }}>
                                        To
                                    </label>
                                    <HyperDatepicker
                                        value={endDate}
                                        inputClass="form-control-light"
                                        onChange={(date: any) => {
                                            setEndDate(date);
                                        }}
                                    />{' '}
                                    <Button
                                        className="ms-md-3 mt-2 mt-md-0"
                                        style={{
                                            // margin: '20px',
                                            // marginTop: '10px',
                                            background: '#008675',
                                            // borderWidth: '0px',
                                        }}
                                        onClick={handleDatePick}>
                                        Submit
                                    </Button>{' '}
                                </div>
                            </Row>
                            {/* ) : (
                                <div style={{ height: '65px' }}></div>
                            )} */}

                            {/* Time Period Selection Area */}
                            <Row>
                                <Col md={3} xs={12}>
                                    {/* Time Period Selection Area */}
                                    <ButtonGroup className="" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {Object.keys(timeGrouingConstants).map((key) => (
                                            <Button
                                                key={key}
                                                active={key === timeGroup}
                                                onClick={(e) => changeTimeGroup(key)}
                                                style={{
                                                    background:
                                                        timeGroup == timeGrouingConstants[key] ? '#00695C' : '#008675',
                                                    border: '0px',
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

                                <Col md={9} className="chart-container" style={{ minHeight: '44em' }}>
                                    {isLoading ? (
                                        <TrendsSkelton3 />
                                    ) : (
                                        <ReactEcharts
                                            option={option}
                                            style={{ height: '90vh', width: '100%', overflow: 'clip' }}
                                        />
                                    )}
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
