import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, Tab, Col, Row, ButtonGroup, Button } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';
import { coloursTable } from 'appConstants/propertyTable';
import { convertUnixToIST } from 'utils/timeFunctions';
import { roundToOneDecimal } from 'utils/maths';
import downloadIcon from 'assets/icons/downloads.png';
import DownloadModal from './DownloadModal';
import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { useLocation } from 'react-router-dom';

const TrendsChart = ({ sensorName }: any) => {
    const timeGrouingConstants: { [key: string]: string } = {
        a: '1',
        b: '6',
        c: '12',
        d: '24',
    };

    const parameters: { [key: string]: string } = {
        a: 'PM 2.5',
        b: 'PM 10',
        c: 'CO2',
        d: 'VOC',
        e: 'AQI',
        f: 'Temperature',
        g: 'Humidity',
        h: 'Outdoor PM 2.5',
        i: 'Outdoor PM 10',
    };

    const [downloadModal, setDownloadModal] = useState(false);
    const [timeGroup, setTimeGroup] = useState<any>(timeGrouingConstants.a);
    const [graphPara, setGraphPara] = useState(parameters.a);
    const [graphLineColour, setGraphLinecolour] = useState(coloursTable.a);
    const [temperature, setTemperature] = useState([]);
    const [humidity, sethumidity] = useState<any>([]);
    const [co2, setCo2] = useState<any>([]);
    const [voc, setvoc] = useState<any>([]);
    const [pm1, setpm1] = useState<any>([]);
    const [pm25, setpm25] = useState([]);
    const [pm10, setpm10] = useState([]);
    const [aqi, setAqi] = useState([]);
    const [xAxis, setXAxis] = useState<any>([]);
    const [lastUpdated, setLastUpdated] = useState('');

    // Function that returns graph data corresponding to the user selection
    const getGraphData = (graphState: any) => {
        try {
            //GraphState here is passed into the function- Don't get confused with variable names
            if (graphState === parameters.a) return temperature;
            else if (graphState === parameters.b) return co2;
            else if (graphState === parameters.c) return humidity;
            else if (graphState === parameters.d) return voc;
            else if (graphState === parameters.e) return pm1;
            else if (graphState === parameters.f) return pm25;
            else if (graphState === parameters.g) return pm10;
            else if (graphState === parameters.h) return aqi;
        } catch (error) {
            return [];
        }
    };

    // Function to get Live data
    const getLiveDataAPI = useCallback(
        async (sensorName: string, timeGroup: any) => {
            try {
                if (!sensorName) return;
                const Id = deviceTypeId['IAQ'];
                // const sensorName = 'IAQ24011';
                const response = await getIaqData({
                    sensorName,
                    timeFrameInHours: timeGroup,
                    deviceTypeId: Id,
                });
                const xAxisData = response?.data?.reverse().map((doc: any) => convertUnixToIST(doc?.timestamp));
                const tempArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.TEMP));
                const humidityArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.HUM));
                const pm1Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.PM1));
                const pm10Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.PM10));
                const pm25Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.PM25));
                const vocArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.VOC));
                const aqiArray = response?.data?.map((doc: any) => roundToOneDecimal(doc?.AQI));
                const co2Array = response?.data?.map((doc: any) => roundToOneDecimal(doc?.CO2));
                setXAxis(xAxisData);
                setTemperature(tempArray);
                sethumidity(humidityArray);
                setpm1(pm1Array);
                setpm10(pm10Array);
                setpm25(pm25Array);
                setvoc(vocArray);
                setAqi(aqiArray);
                setCo2(co2Array);
                setLastUpdated(xAxisData[xAxisData?.length - 1]);
                // console.log(
                //     'IAQ Trends res:',
                //     // xAxisData,
                //     // tempArray,
                //     // humidityArray
                //     pm1Array
                //     // pm10Array,
                //     // pm25Array,
                //     // vocArray,
                //     // aqiArray,
                //     // co2Array
                // );
            } catch (error) {
                console.log(error);
            }
        },
        [timeGroup, sensorName]
    );

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
            console.log(parameter === 'e' ? pm1 : '');
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

                if (graphPara === parameters.c) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' %' + ' <br/>';
                    });
                } else if (graphPara === parameters.d || graphPara === parameters.b) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + 'ppm' + ' <br/>';
                    });
                } else if (graphPara === parameters.a) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + ' °C <br/>';
                    });
                } else if (graphPara === parameters.e || graphPara === parameters.f || graphPara === parameters.g) {
                    values.forEach((item: any) => {
                        toolTipContent +=
                            item.marker + ' ' + item.seriesName + ' ' + ':' + ' ' + item.value + 'µg/m³ <br/>';
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
        getLiveDataAPI(sensorName, timeGroup);
    }, [getLiveDataAPI, timeGroup, sensorName]);

    return (
        <>
            <DownloadModal modalState={downloadModal} modalControlFn={handleDownloadModal} />
            <Card>
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
                                        <h5> {graphPara}</h5>
                                    </Col>{' '}
                                    <Col xxl={4} style={{ width: '200px' }}>
                                        {' '}
                                        <h6 style={{ textAlign: 'center' }}>Updated on {lastUpdated}</h6>{' '}
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
                                        }}>
                                        {' '}
                                        <img
                                            src={downloadIcon}
                                            alt=""
                                            height={'100%'}
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleDownloadModal}
                                        />
                                        {/* <h6 style={{ fontSize: '10px' }}>Updated on {updatedTime}</h6>{' '} */}
                                    </Col>
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
