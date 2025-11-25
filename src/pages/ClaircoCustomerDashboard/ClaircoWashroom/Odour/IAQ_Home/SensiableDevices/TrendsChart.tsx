import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';
import { coloursTable } from 'appConstants/propertyTable';
import { convertUnixToIST } from 'utils/timeFunctions';
import { roundToOneDecimal } from 'utils/maths';
import downloadIcon from 'assets/icons/downloads.png';
import DownloadModal from './DownloadModal';
import { getIaqAggregate, getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { useLocation } from 'react-router-dom';
// import { data } from '../test';
import { dblClick } from '@testing-library/user-event/dist/click';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { conforms } from 'lodash';
import { odourData } from 'appConstants/odour';

const TrendsChart = ({ sensorName, deviceId, buildingId }: any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };

    const parameters: { [key: string]: string } = {
        // a: 'PM 2.5',
        // b: 'PM 10',
        // c: 'CO2',
        d: 'VOC',
        // e: 'AQI',
        // f: 'Temperature',
        // g: 'Humidity',
        // h: 'Outdoor PM 2.5',
        // i: 'Outdoor PM 10',
        // j: 'Pressure',
    };
    const graphOptions: { [key: string]: string } = { a: 'live', b: 'aggregated' };
    const [graphState, setGraphState] = useState(graphOptions.a);

    const [downloadModal, setDownloadModal] = useState(false);
    const [timeGroup, setTimeGroup] = useState<any>(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.d);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.d);
    const [temperature, setTemperature] = useState<any[]>([]);
    const [humidity, sethumidity] = useState<any>([]);
    const [co2, setCo2] = useState<any>([]);
    const [voc, setvoc] = useState<any>([]);
    const [pressure, setPressure] = useState<any>([]);
    const [pm1, setpm1] = useState<any>([]);
    const [pm25, setpm25] = useState<any[]>([]);
    const [pm10, setpm10] = useState<any[]>([]);
    const [aqi, setAqi] = useState<any[]>([]);
    const [outdoorPm25, setOutdoorPm25] = useState([]);
    const [outdoorPm10, setOutdoorPm10] = useState([]);
    const [xAxis, setXAxis] = useState<any>([]);
    const [lastUpdated, setLastUpdated] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function that returns graph data corresponding to the user selection
    const getGraphData = (graphState: any) => {
        try {
            //GraphState here is passed into the function- Don't get confused with variable names
            if (graphState === parameters.a) return pm25;
            else if (graphState === parameters.b) return pm10;
            else if (graphState === parameters.c) return co2;
            else if (graphState === parameters.d) return voc;
            else if (graphState === parameters.e) return aqi;
            else if (graphState === parameters.f) return temperature;
            else if (graphState === parameters.g) return humidity;
            else if (graphState === parameters.h) return outdoorPm25;
            else if (graphState === parameters.i) return outdoorPm10;
            else if (graphState === parameters.j) return pressure;

            // else if (graphState === parameters.i) return opm;
        } catch (error) {
            return [];
        }
    };
    const changeGraphState = async (current: string) => {
        try {
            setGraphState(graphOptions[current]);
        } catch (error) {
            console.log(error);
        }
    };
    // Function to get Live data
    const getLiveDataAPI = useCallback(
        async (sensorName: string, timeGroup: any) => {
            try {
                if (!sensorName) return;
                // console.log('IAQ Live');
                setIsLoading(true);

                // const Id = deviceTypeId['IAQ'];
                const response: any = { data: { ...odourData } };
                // console.log('Odor res', response);
                // await getSensiableIaqData(sensorName, timeGroup);

                const xAxisData = response?.data?.data?.reverse().map((doc: any) => convertUnixToIST(doc?.timestamp));
                // const tempArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.TEMP));
                // const humidityArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.HUM));
                // const pm1Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.PM1));
                // const pm10Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.PM10));
                // const pm25Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.PM25));
                const vocArray = response?.data?.data?.map((doc: any) => roundToOneDecimal(doc?.VOC));
                const pressureArray = response?.data?.data?.map((doc: any) => roundToOneDecimal(doc?.Pa));

                // const aqiArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.AQI));
                // const co2Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.CO2));
                // const outdoorPm25Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.OPM25));
                // const outdoorPm10Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.OPM10));
                // console.log('Trends', vocArray, xAxisData);
                setXAxis(xAxisData);
                // setTemperature(tempArray);
                // sethumidity(humidityArray);
                // setpm1(pm1Array);
                // setpm10(pm10Array);
                // setpm25(pm25Array);
                setPressure(pressureArray);
                setvoc(vocArray);
                // setAqi(aqiArray);
                // setCo2(co2Array);
                setLastUpdated(xAxisData[xAxisData?.length - 1]);
                // setOutdoorPm10(outdoorPm10Array);
                // setOutdoorPm25(outdoorPm25Array);
                setIsLoading(false);

                // console.log(
                // );
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
        [timeGroup, sensorName]
    );
    const getAggregateData = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getIaqAggregate(sensorName, buildingId, deviceId);
            // console.log('Res', res);
            const data = res?.data ?? [];
            const timeArray = Object.keys(data)
                ?.reverse()
                ?.map((time: string | number) => convertUnixToIST(time));
            const values = Object.values(data)?.reverse();
            const tempArray = values.map((doc: any) => roundToOneDecimal(doc?.TEMP));
            const humArray = values.map((doc: any) => roundToOneDecimal(doc?.HUM));
            const pm25Array = values.map((doc: any) => roundToOneDecimal(doc?.PM25));
            const pm10Array = values.map((doc: any) => roundToOneDecimal(doc?.PM10));
            const co2Array = values.map((doc: any) => roundToOneDecimal(doc?.CO2));
            const vocArray = values.map((doc: any) => roundToOneDecimal(doc?.VOC));
            const pm1Array = values.map((doc: any) => roundToOneDecimal(doc?.PM1));
            const aqiArray = values.map((doc: any) => roundToOneDecimal(doc?.AQI));

            // console.log('graph state', graphState, timeArray);
            setXAxis(timeArray ?? []);
            setTemperature(tempArray ?? []);
            sethumidity(humArray ?? []);
            setpm1(pm1Array ?? []);
            setpm10(pm10Array ?? []);
            setpm25(pm25Array ?? []);
            setvoc(vocArray ?? []);
            setAqi(aqiArray ?? []);
            setCo2(co2Array ?? []);
            // setLastUpdated('');
            setOutdoorPm10([]);
            setOutdoorPm25([]);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log('Error Fetching Agrregate1', error);
            setXAxis([]);
            setTemperature([]);
            sethumidity([]);
            setpm1([]);
            setpm10([]);
            setpm25([]);
            setvoc([]);
            setAqi([]);
            setCo2([]);
            setLastUpdated('');
            setOutdoorPm10([]);
            setOutdoorPm25([]);
        }
    }, [graphState]);
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
            // console.log(parameter === 'e' ? pm1 : '');
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
        grid: {
            left: '10%', // Adjust the left margin
            right: '10%', // Adjust the right margin
            bottom: '20%', // Increase the bottom margin to make space for the labels
        },
        xAxis: {
            type: 'category',
            data: xAxis,
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

                if (graphPara === parameters.c || graphPara === parameters.d) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ppm ' + ' <br/>';
                    });
                } else if (
                    graphPara === parameters.a ||
                    graphPara === parameters.b ||
                    graphPara === parameters.h ||
                    graphPara === parameters.i
                ) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' ' + 'µg/m³  <br/>';
                    });
                } else if (graphPara === parameters.f) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' °C <br/>';
                    });
                } else if (graphPara === parameters.g) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + '%  <br/>';
                    });
                } else if (graphPara === parameters.j) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' Pa' + ' <br/>';
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
        toolbox: {
            feature: {
                saveAsImage: {},
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

                axisLabel: {},
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
        if (graphState === graphOptions.b) getAggregateData();
        else getLiveDataAPI(sensorName, timeGroup);
    }, [getLiveDataAPI, graphState, timeGroup, sensorName, getAggregateData]);
    return (
        <>
            <DownloadModal modalState={downloadModal} modalControlFn={handleDownloadModal} deviceId={deviceId} />
            <Card>
                <Card.Body>
                    <Row>
                        <Tab.Container defaultActiveKey="live">
                            <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                                <div className="ChartHeading" style={{ width: '200px' }}>
                                    <h4 className="header-title">Trends </h4>
                                </div>
                                <Row>
                                    <Col xxl={4} style={{ width: '200px', textAlign: 'center' }}>
                                        <h5> {graphPara}</h5>
                                    </Col>{' '}
                                    <Col xxl={4} style={{ width: '200px' }}>
                                        {' '}
                                        <h6 style={{ textAlign: 'center' }}>Updated on {lastUpdated}</h6>{' '}
                                    </Col>{' '}
                                    <Col xxl={4} style={{ width: '200px' }}></Col>
                                    {/* <Col
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
                                    </Col> */}
                                </Row>

                                {/* Currently only live data is used, if aggregate is needed this can be used,otherwise useless */}
                                {/* <Nav as="ul" variant="pills" className="bg-nav-pills p-1 rounded">
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
                                                    // onClick={() => changeGraphState(option)}
                                                >
                                                    {graphOptions[option]}
                                                </Nav.Link>
                                            </Nav.Item>
                                        );
                                    })}{' '}
                                    {/* ); */}
                                {/* })} */}
                                {/* </Nav> */}
                            </div>
                            <Row style={{ justifyContent: 'end' }}>
                                {/* <Col lg={3} xs={12} style={{ justifyContent: 'end' }}>
                                    <ButtonGroup className="w-100 mb-2">
                                        {Object.keys(graphOptions).map((option) => {
                                            return (
                                                <Button // disabled={key !== 'a'}
                                                    // variant="primary"
                                                    // className="btn btn-outline-info"
                                                    key={option}
                                                    active={graphState === option}
                                                    onClick={(e) => changeGraphState(option)}
                                                    style={{
                                                        background:
                                                            graphState == graphOptions[option] ? '#00695C' : '#008675',
                                                        border: '0px',
                                                    }}>
                                                    {graphOptions[option] === 'aggregated' ? '7 Day' : 'Live'}
                                                </Button>
                                            );
                                        })}
                                    </ButtonGroup>{' '}
                                </Col> */}
                            </Row>

                            <Row>
                                <Col md={3} xs={12}>
                                    {/* Time Period Selection Area */}
                                    <ButtonGroup className="" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {graphState === graphOptions?.a ? (
                                            Object.keys(timeGrouingConstants).map((key) => (
                                                <Button
                                                    key={key}
                                                    // disabled={key !== 'a'}
                                                    // variant="primary"
                                                    // className="btn btn-outline-info"
                                                    active={key == timeGroup}
                                                    onClick={(e) => changeTimeGroup(key)}
                                                    style={{
                                                        background:
                                                            timeGroup == timeGrouingConstants[key]
                                                                ? '#00695C'
                                                                : '#008675',
                                                        border: '0px',
                                                        // flex: '1 1 auto',

                                                        // backgroundColor: 'red',
                                                    }}>
                                                    {timeGrouingConstants[key]} hr
                                                </Button>
                                            ))
                                        ) : (
                                            <div style={{ height: '2.5em' }}></div>
                                        )}
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
                                                            padding: '0.35em',
                                                            paddingLeft: '2em',
                                                        }}
                                                        onClick={() => changeGraphParamer(parameter)}
                                                        key={parameter}>
                                                        {' '}
                                                        <div
                                                            style={{
                                                                background: coloursTable[parameter],
                                                                height: '0.75em',
                                                                width: '0.75em',
                                                                borderRadius: '5px',
                                                                marginRight: '1em',
                                                            }}></div>
                                                        <div
                                                            className="form-check"
                                                            style={{
                                                                paddingLeft: '20px',
                                                                marginTop: '0.25em',
                                                                // paddingTop: '0.35em',
                                                                paddingBottom: '0px',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
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

                                <Col md={9} className="chart-container" style={{ minHeight: '40em' }}>
                                    {!isLoading ? (
                                        <ReactEcharts
                                            option={option}
                                            style={{ height: '90vh', width: '100%', overflow: 'clip' }}
                                        />
                                    ) : (
                                        <TableSkelton />
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
