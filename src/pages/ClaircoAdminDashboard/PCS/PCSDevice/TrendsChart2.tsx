import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';

import { coloursTable } from 'appConstants/propertyTable';
import { convertDateToEpoch, convertUnixToIST, getCurrentEpochTime } from 'utils/timeFunctions';

import { getPCSAggregate, getPcsData } from 'helpers/api/services/Clairco/customerSide/pcs';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { HyperDatepicker } from 'components';
import downloadIcon from 'assets/icons/downloads.png';
import DownloadModal from './DownloadModal';
import HorizontalButtonGroup1 from 'components/ClaircoButtons/HorizontalButtonGroup1';
import { PCSAgg, PCSLiveTrends } from 'appConstants/PCSFake';

const graphOptions: { [key: string]: string } = { a: 'Live', b: 'Aggregate' };
const timeGrouingConstants: { [key: string]: string } = {
    a: '1',
    b: '6',
    c: '12',
    d: '24',
};
const TrendsChart = ({ sensorName }: any) => {
    const parameters: { [key: string]: string } = {
        d: 'Total Count',
    };
    const [startDate, setStartDate] = useState<Date>(new Date(new Date()));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [downloadModal, setDownloadModal] = useState(false);

    const [graphState, setGraphState] = useState(graphOptions.a);
    const [timeGroup, setTimeGroup] = useState<any>(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.d);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.b);
    const [isLoading, setIsLoading] = useState(false);
    const [graphXAxis, setGraphXAxis] = useState([]);
    const [outCount, setOutCount] = useState([]);
    const [occupants, setOccupants] = useState([]);
    // new`

    const [inCount, setInCount] = useState([]);

    // Function that returns graph data corresponding to the user selection
    const getGraphData = (graphState: any) => {
        try {
            // if (graphState === parameters.a) return temp;
            // else if (graphState === parameters.d)
            return inCount;
            // else if (graphState === parameters.c) return humidity;
        } catch (error) {
            return [];
        }
    };
    const processResponseDataAgg = useCallback((res: any, isAgg = true) => {
        try {
            const incountArray = res?.data?.data?.reverse().map((doc: any) => doc?.inCount);
            const outCountArray = res?.data?.data?.map((doc: any) => doc?.outCount);
            const occupants = res?.data?.data?.map((doc: any) => doc?.occupancy);

            let xAxisArray = res?.data?.data?.map((doc: any) => convertUnixToIST(doc?.['timestamp']));
            if (isAgg) {
                xAxisArray = xAxisArray.map((time: string) => {
                    const [date, hm] = time.split(',').map((s) => s.trim());
                    if (!hm) return time;
                    let [hour, min] = hm.split(':');
                    let prevHour = String((Number(hour) - 1 + 24) % 24).padStart(2, '0');
                    return `${date}, ${prevHour}.${min}-${hour}:${min}`;
                });
            }
            setInCount(incountArray);
            // console.log('Outcount ', xAxisArray);
            setOutCount(outCountArray);
            setGraphXAxis(xAxisArray);
            setOccupants(occupants);
        } catch {
            setInCount([]);
            // console.log('Outcount ', xAxisArray);
            setOutCount([]);
            setGraphXAxis([]);
            setOccupants([]);
        }
    }, []);

    const processResponseData = useCallback((res: any) => {
        try {
            const occupancyArray = res?.data?.data?.reverse().map((doc: any) => doc?.inCount);
            const outCountArray = res?.data?.data?.map((doc: any) => doc?.outCount);
            const diff = res?.data?.data?.map((doc: any) => {
                if (
                    !doc?.inCount ||
                    !doc.outCount ||
                    typeof doc?.inCount !== 'number' ||
                    typeof doc?.outCount !== 'number' ||
                    doc?.inCount - doc.outCount < 1
                )
                    return 0;
                const dif = doc?.inCount - doc?.outCount;
                return dif;
            });

            let xAxisArray = res?.data?.data?.map((doc: any) => convertUnixToIST(doc?.['timestamp']));

            setInCount(occupancyArray);
            setOutCount(outCountArray);
            setGraphXAxis(xAxisArray);
            setOccupants(diff);
        } catch {
            setInCount([]);
            setOutCount([]);
            setGraphXAxis([]);
            setOccupants([]);
        }
    }, []);
    // Function to get Live data
    const getLiveDataAPI = useCallback(async (sensorName: string, timeFrame: string | number) => {
        try {
            if (!sensorName) return;
            setInCount([]);
            setOutCount([]);
            setGraphXAxis([]);
            const endTime = getCurrentEpochTime() * 1000;
            const hour = 3600 * 1000;
            const startTime = endTime - hour * Number(timeFrame);
            setIsLoading(true);
            const res = { data: { data: PCSLiveTrends } };
            // await getPcsData(sensorName, startTime.toString(), endTime.toString());
            // console.log('Live data', res);
            processResponseData(res);
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
            setInCount([]);
            setOutCount([]);
            setGraphXAxis([]);
            const endTime = getCurrentEpochTime() * 1000;
            const hour = 3600 * 1000;
            const startTime = endTime - hour * Number(timeFrame);
            const res = { data: { data: PCSAgg } };
            //  await getPCSAggregate(sensorName, startTime.toString(), endTime.toString());
            processResponseDataAgg(res, true);
        } catch (error) {
            setInCount([]);
            setGraphXAxis([]);
            setOutCount([]);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const changeGraphState = async (current?: string | number) => {
        try {
            if (current) {
                setGraphState(graphOptions[current]);
            }
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

    const handleDatePick = useCallback(async () => {
        try {
            if (!sensorName) return;
            setInCount([]);
            setOutCount([]);
            setGraphXAxis([]);
            const start = startDate.setHours(0, 0, 0, 0);
            const end = endDate.setHours(23, 59, 59, 999);

            const startEpochTime = convertDateToEpoch(start);
            const endEpochTime = convertDateToEpoch(end);
            if (graphState === graphOptions.a && endEpochTime - startEpochTime > 3600 * 24 * 1000) {
                alert('Please select a 24-hour range for live data.');
                return;
            }

            const fetchData = async () => {
                if (graphState === graphOptions.b) {
                    const res = { data: { data: PCSAgg } };
                    // await getPCSAggregate(sensorName, startEpochTime.toString(), endEpochTime.toString());
                    processResponseDataAgg(res, true);
                } else {
                    const res = { data: { data: PCSLiveTrends } };
                    // await getPcsData(sensorName, startEpochTime.toString(), endEpochTime.toString());
                    processResponseData(res);
                }
            };

            await fetchData();
        } catch (e) {
            console.log('Error', e);
        } finally {
            setTimeGroup(5);
            setIsLoading(false);
        }
    }, [sensorName, startDate, endDate, graphState, processResponseData, processResponseDataAgg]);
    const changeGraphParamer = async (parameter: string) => {
        try {
            setGraphPara(parameters[parameter]);
            setGraphLinecolour(coloursTable[parameter]);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDownloadModal = async () => {
        try {
            // console.log('download clicked');
            setDownloadModal((currentState) => !currentState);
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
        legend: {
            show: true,
        },
        xAxis: {
            type: 'category',
            data: graphXAxis,
            axisLabel: {
                rotate: 45, // Rotate the labels 90 degrees to make them vertical
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
                name: graphPara === 'Total Count' ? 'In Count' : graphPara,
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
            ...(graphState === graphOptions.a
                ? [
                      {
                          name: 'Out Count', // Change this to your desired name
                          data: outCount,
                          //   [12, 1, 2, 4, 3, 5, 6, 7, 8, 8, 9, 10], // Replace with your data array
                          type: 'line',
                          connectNulls: true,
                          symbol: 'circle',
                          symbolSize: 5,
                          lineStyle: {
                              //   color: '#FF6B6B', // Different color for the second line
                          },
                      },
                  ]
                : []),
            ...(graphState === graphOptions.a
                ? [
                      {
                          name: 'Occupants', // Change this to your desired name
                          data: occupants,
                          //   [12, 1, 2, 4, 3, 5, 6, 7, 8, 8, 9, 10], // Replace with your data array
                          type: 'line',
                          connectNulls: true,
                          symbol: 'circle',
                          symbolSize: 5,
                          lineStyle: {
                              //   color: '#FF6B6B', // Different color for the second line
                          },
                      },
                  ]
                : []),
            ...(graphState === graphOptions.b
                ? [
                      {
                          name: 'Out Count', // Change this to your desired name
                          data: outCount,
                          //   [12, 1, 2, 4, 3, 5, 6, 7, 8, 8, 9, 10], // Replace with your data array
                          type: 'bar',
                          connectNulls: true,
                          symbol: 'circle',
                          symbolSize: 5,
                          lineStyle: {
                              //   color: '#FF6B6B', // Different color for the second line
                          },
                      },
                  ]
                : []),
            // ...(graphState === graphOptions.b
            //     ? [
            //           {
            //               name: 'Occupants', // Change this to your desired name
            //               data: occupants,
            //               //   [12, 1, 2, 4, 3, 5, 6, 7, 8, 8, 9, 10], // Replace with your data array
            //               type: 'bar',
            //               connectNulls: true,
            //               symbol: 'circle',
            //               symbolSize: 5,
            //               lineStyle: {
            //                   //   color: '#FF6B6B', // Different color for the second line
            //               },
            //           },
            //   ]
            // : []),
        ],
    };
    useEffect(
        function changeTimeSelection() {
            setTimeGroup(timeGrouingConstants.a);
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
            <DownloadModal deviceId={sensorName} modalState={downloadModal} modalControlFn={handleDownloadModal} />

            <Card style={{ color: 'black' }}>
                <Card.Body>
                    <Row>
                        <Tab.Container defaultActiveKey="live">
                            <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                                <div className="ChartHeading" style={{ width: '200px' }}>
                                    <h4 className="header-title">Trends </h4>
                                </div>

                                <Row>
                                    {' '}
                                    <Col xxl={4} style={{ width: '200px', textAlign: 'center' }}>
                                        {/* <h5> {graphPara}</h5> */}
                                    </Col>{' '}
                                    <Col xxl={4} style={{ width: '200px' }}>
                                        {' '}
                                        <h6 style={{ textAlign: 'center' }}>Updated on {'lastUpdated'}</h6>{' '}
                                    </Col>{' '}
                                    <Col
                                        xxl={4}
                                        style={{
                                            minWidth: '200px',
                                            fontSize: '12px',
                                            display: 'flex',
                                            justifyContent: 'end',
                                            alignContent: 'baseline',
                                            height: '30px',
                                            // cursor: 'pointer',
                                        }}>
                                        <div
                                            style={{ textAlign: 'center', cursor: 'pointer' }}
                                            onClick={handleDownloadModal}>
                                            <img src={downloadIcon} alt="" height={'100%'} style={{}} />
                                            <h6 style={{ fontSize: '10px', textAlign: 'center' }}>Download</h6>
                                        </div>{' '}
                                    </Col>
                                </Row>
                            </div>
                            <Row style={{ justifyContent: 'end' }}>
                                <Col lg={3} xs={12} style={{ justifyContent: 'end' }}>
                                    <HorizontalButtonGroup1
                                        choices={Object.keys(graphOptions)}
                                        currentState={graphState === 'Live' ? 'a' : 'b'}
                                        onSelectFn={changeGraphState}
                                        choicesDisplayNames={{ a: 'Live', b: '7 Day' }}
                                    />
                                    {/* Currently only live data is used, if aggregate is needed this can be used,otherwise useless */}
                                </Col>
                            </Row>
                            {/* Date Picker for Aggregate */}
                            {/* {graphState === graphOptions.b ? ( */}

                            <Row className="d-flex justify-content-end">
                                {graphState === 'Aggregate' ? (
                                    <h6 className="d-flex justify-content-end">
                                        *Shows how many people entered and exited during each hour.
                                    </h6>
                                ) : (
                                    <h6 className="d-flex justify-content-end">*Shows Sensor reading in real time </h6>
                                )}{' '}
                            </Row>

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
                                        <TableSkelton />
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
