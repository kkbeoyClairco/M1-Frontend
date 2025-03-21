import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';

interface GraphOptions {
    [key: string]: string;
}
interface WeekSubOptions {
    [key: string]: string;
}
interface ChartsProps {
    title?: string;
    legands?: string[];
    data?: any;
    xAxisInput?: any;
    yAxisUnit?: string;
    powerR?: any;
    powerB?: any;
    powerAverage?: any;
    powerY?: any;
    timeStateFn?: any;
    timeStateFn2?: any;
    occupancyData?: any;
    temperatureData?: any;
}

const PowerChart: React.FC<ChartsProps> = ({
    title,
    powerR,
    powerY,
    powerB,
    powerAverage,
    xAxisInput,
    timeStateFn,
    timeStateFn2,
    occupancyData,
    temperatureData,
}) => {
    const [timePeriod, setTimePeriod] = useState('day');
    const [weekSubOptions, setWeekSubOptions] = useState('hourly');
    const graphOptions: GraphOptions = {
        // '1hr': 1,
        // '6hr': 6,
        // '12hr': 12,
        Day: 'day',
        Week: 'week',
        Month: 'month',
    };
    const weeklyGraphSuboptions: WeekSubOptions = {
        Hourly: 'hourly',
        Daily: 'daily',
    };
    const handleWeekSubOption = async (key: string) => {
        try {
            setWeekSubOptions(key);
            timeStateFn2(key);
        } catch (error) {
            console.log(error);
        }
    };
    const changeTimePeriod = async (key: string) => {
        try {
            setTimePeriod(key);
            timeStateFn(key);
        } catch (error) {
            console.log(error);
        }
    };

    //Graph Option
    const option = {
        xAxis: {
            grid: {
                left: '10%', // Adjust the left margin
                right: '10%', // Adjust the right margin
                bottom: '45%', // Increase the bottom margin to make space for the labels
            },
            type: 'category',
            data: xAxisInput,
            axisLabel: {
                rotate: 35, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'right',
                },
                margin: 10,
            },
            // min: xAxisInput[0],
            // max: xAxisInput[xAxisInput.length - 1],
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (values: any) {
                let toolTipContent = values[0].name + '<br/>';
                // console.log('tool tip', values);
                values.forEach((item: any) => {
                    toolTipContent +=
                        item.marker +
                        ' ' +
                        item.seriesName +
                        ' ' +
                        ':' +
                        ' ' +
                        item.value +
                        ' ' +
                        `${
                            item.seriesName === 'Occupants'
                                ? ''
                                : item.seriesName === 'Temperature'
                                ? '°C'
                                : 'kWh <br/>'
                        }`;
                });
                return toolTipContent;
            },
            axisPointer: {
                type: 'cross',
            },
        },
        legend: {
            selected: {
                'Overall A': true, // Active by default
                'Phase B': false, // Inactive by default
                'Phase Y': false, // Inactive by default
                'Phase R': false,
            },
        },

        yAxis: [
            {
                type: 'value',
                name: 'Power',
                position: 'left',
                // nameLocation: 'middle',
                // nameTextStyle: {
                //     padding: [0, 40, 40, 0], // Adjust padding to move the label away from the axis
                // },
                axisLine: {
                    show: true,
                    lineStyle: {
                        show: true,
                        // color: 'black',
                    },
                },

                axisLabel: {
                    formatter: `{value} `,
                },
            },

            // {
            //     type: 'value',
            //     name: 'Occupants',
            //     position: 'right',
            //     alignTicks: true,
            //     // nameLocation: 'top',

            //     offset: 80,
            //     axisLine: {
            //         show: true,
            //         lineStyle: {
            //             // color: colors[1],
            //         },
            //     },
            //     axisLabel: {
            //         formatter: '{value}',
            //     },
            // },
            // {
            //     type: 'value',
            //     name: 'Temperature',
            //     position: 'right',
            //     // nameLocation: 'middle',

            //     alignTicks: true,
            //     offset: 5,
            //     axisLine: {
            //         show: true,
            //         lineStyle: {
            //             // color: colors[1],
            //         },
            //     },
            //     axisLabel: {
            //         formatter: '{value}°C',
            //     },
            // },
        ],
        series: [
            {
                name: 'Overall',
                data: powerAverage,
                type: 'bar',
                //  timePeriod === 'week' ? (weekSubOptions === 'hourly' ? 'line' : 'bar') : 'bar',
                emphasis: {
                    focus: 'series',
                },
                itemStyle: {
                    color: '#228B22 ',
                },

                yAxisIndex: 0,
                connectNulls: true,
            },
            {
                name: 'Phase B',
                data: powerB,
                type: 'bar',
                emphasis: {
                    focus: 'series',
                },

                // stack: 'Total',
                yAxisIndex: 0,
                connectNulls: true,
            },

            {
                name: 'Phase Y',
                data: powerY,
                type: 'bar',
                itemStyle: {
                    color: '#FFCE5C',
                },
                emphasis: {
                    focus: 'series',
                },
                // stack: 'Total',
                yAxisIndex: 0,
                connectNulls: true,
            },
            {
                name: 'Phase R',
                data: powerR,
                type: 'bar',
                itemStyle: {
                    color: '#EF436B',
                },
                emphasis: {
                    focus: 'series',
                },
                // stack: 'Total',
                yAxisIndex: 0,
                connectNulls: true,
            },
            // {
            //     name: 'Occupants',
            //     data: occupancyData,
            //     type: 'line',
            //     itemStyle: {
            //         color: '#EF436B',
            //     },
            //     emphasis: {
            //         focus: 'series',
            //     },
            //     // stack: 'Total',
            //     yAxisIndex: 1,
            //     connectNulls: true,
            // },
            // {
            //     name: 'Temperature',
            //     data: temperatureData,
            //     type: 'line',
            //     itemStyle: {
            //         // color: '#E85C0D',
            //     },
            //     emphasis: {
            //         focus: 'series',
            //     },
            //     // stack: 'Total',
            //     yAxisIndex: 2,
            //     connectNulls: true,
            // },
        ],
    };

    return (
        <div>
            {' '}
            <Card>
                <Card.Body>
                    <Tab.Container defaultActiveKey="1hr">
                        <div
                            className="align-items-center d-sm-flex justify-content-sm-between mb-3"
                            key={Math.random() * 1000}>
                            <div className="ChartHeading" style={{ width: '200px' }}>
                                <h4 className="header-title">{title} Trends</h4>
                            </div>
                            <div style={{ width: '450px', display: 'flex', justifyContent: 'end' }}></div>{' '}
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
                                })}{' '}
                            </Nav>
                        </div>
                        <Col md={3} style={{ display: 'flex', alignContent: 'end' }}>
                            {' '}
                            {timePeriod === 'week' ? (
                                Object.keys(weeklyGraphSuboptions).map((option) => {
                                    return (
                                        <div>
                                            <Button
                                                style={{
                                                    background:
                                                        weekSubOptions === weeklyGraphSuboptions[option]
                                                            ? '#00695C'
                                                            : '#008675',
                                                    border: '0px',
                                                    borderBlockWidth:
                                                        weekSubOptions === weeklyGraphSuboptions[option]
                                                            ? '5px'
                                                            : '0px',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    // backgroundColor: 'red',
                                                }}
                                                className="py-1"
                                                // to="#"
                                                // eventKey={graphOptions[key]}
                                                // {...graphOptions[key]}
                                                defaultChecked={graphOptions[option] === option}
                                                onClick={() => handleWeekSubOption(weeklyGraphSuboptions[option])}>
                                                {option}
                                            </Button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ height: '33px' }}></div>
                            )}
                        </Col>

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

export default PowerChart;

// codes to research

// xAxisInput?.map((doc: any) => {
//     return {
//         name: yAxisUnit,
//         data: doc,
//         type: 'line',
//         stack: 'Total',
//         yAxisIndex: 0,
//         lineStyle: {
//             color: '#1f77b4', // Blue for Occupancy line
//         },
//     };
// }),
// Object.entries(xAxisInput)?.map(([name, array], index) => {
//     console.log('Map:', index, array);
//     return {
//         name: name,
//         data: [20, 32, 29, 34, 29, 23],
//         type: 'line',
//         stack: 'Total',
//         yAxisIndex: index,
//         lineStyle: { color: '#ff7f0e' }, // Orange for Temperature line
//     };
// }),
