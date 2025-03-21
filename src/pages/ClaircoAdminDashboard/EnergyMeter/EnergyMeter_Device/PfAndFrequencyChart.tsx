import React, { useEffect, useState } from 'react';
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';
import { array } from 'yup';
interface GraphOptions {
    [key: string]: number;
}
interface ChartsProps {
    title?: string;
    legands?: string[];
    powerFactor?: any;
    frequency?: any;
    yAxisUnit?: any;
    xAxisInput?: any;
    timeStateFn?: any;
}

const PfAndFrequencyChart: React.FC<ChartsProps> = ({
    title,
    powerFactor,
    frequency,
    yAxisUnit,
    xAxisInput,
    timeStateFn,
}) => {
    // const [chartData, setChartData] = useState(initialChartData);
    const [timePeriod, setTimePeriod] = useState(1);
    const [graphXAxis, setGraphXAxis] = useState([]);
    const [occupancyData, setOccupancyData] = useState([]);
    const graphOptions: GraphOptions = {
        '1hr': 1,
        '6hr': 6,
        '12hr': 12,
        '24hr': 24,
    };
    const samplelegands = ['Phase R', 'Phase Y', 'Phase B'];
    const changeTimePeriod = async (key: number) => {
        try {
            // console.log('Graph state changed', key);
            setTimePeriod(key);
            timeStateFn(key);
        } catch (error) {
            console.log(error);
        }
    };

    //Graph Option
    const option = {
        xAxis: {
            type: 'category',
            data: xAxisInput,
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {},

        yAxis: [
            {
                type: 'value',
                name: yAxisUnit,
                position: 'left',
                nameLocation: 'middle',
                nameTextStyle: {
                    padding: [0, 40, 40, 0], // Adjust padding to move the label away from the axis
                },
                axisLine: {
                    lineStyle: {
                        // color: 'black',
                    },
                },
                axisLabel: {
                    formatter: `{value}`,
                },
            },
            // {
            //     type: 'value',
            //     name: 'Set Temperature',
            //     position: 'right',
            //     nameLocation: 'middle',
            //     nameTextStyle: {
            //         padding: [30, 40, 0, 0], // Adjust padding to move the label away from the axis
            //     },
            //     axisLine: {
            //         lineStyle: { color: '#ff7f0e' },
            //     },
            //     axisLabel: {
            //         formatter: '{value} °C',
            //     },
            // },
        ],
        series: [
            {
                name: 'Power Factor',
                data: powerFactor,
                // [20, 32, 29, 34, 29, 23],
                type: 'line',
                // stack: 'Total',
                yAxisIndex: 0,
                connectNulls: true,
                // lineStyle: { color: '#ff7f0e' }, // Orange for Temperature line
            },
            {
                name: 'Frequency',
                data: frequency,
                // [20, 32, 29, 34, 29, 23],
                type: 'line',
                // stack: 'Total',
                connectNulls: true,
                yAxisIndex: 0,
                // lineStyle: { color: '#ff7f0e' }, // Orange for Temperature line
            },
        ],
    };
    useEffect(() => {
        // const array1: any = Object.entries(xAxisInput)?.map(([name, array], index) => {
        //     return array;
        // });
        // console.log('Map:', array1);
        // setGraphXAxis(array1[0]);
    });
    return (
        <div>
            {' '}
            <Card>
                <Card.Body>
                    <Tab.Container defaultActiveKey="1hr">
                        <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                            <div className="ChartHeading" style={{ width: '200px' }}>
                                <h4 className="header-title">{title} Trends</h4>
                            </div>
                            <div style={{ width: '450px', display: 'flex', justifyContent: 'end' }}>
                                {/* {samplelegands.map((legand) => {
                                    return (
                                        <>
                                            <p style={{ margin: '5px' }} className="">
                                                {title} Trends
                                            </p>
                                        </>
                                    );
                                })} */}
                            </div>{' '}
                            <Nav as="ul" variant="pills" className="bg-nav-pills p-1 rounded">
                                {Object.keys(graphOptions).map((key: any) => {
                                    return (
                                        <Nav.Item as="li" key={key}>
                                            {' '}
                                            <Nav.Link
                                                // as={Link}
                                                style={{
                                                    background: timePeriod == graphOptions[key] ? '#00695C' : '#008675',
                                                    border: '0px',
                                                    borderBlockWidth: timePeriod == graphOptions[key] ? '5px' : '0px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    // backgroundColor: 'red',
                                                }}
                                                className="py-1"
                                                // to="#"
                                                eventKey={graphOptions[key]}
                                                // {...graphOptions[key]}
                                                defaultChecked={graphOptions[key] === timePeriod}
                                                onClick={() => changeTimePeriod(graphOptions[key])}>
                                                {key}
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        </div>

                        {/* Time Period Selection Area */}
                        <Row>
                            {/* <ReactEcharts option={option} style={{ height: '400px', width: '70%' }} /> */}

                            <Col md={12}>
                                <Tab.Content>
                                    <ReactEcharts option={option} style={{ height: '500px', width: '100%' }} />
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PfAndFrequencyChart;
