import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Col, Row } from 'react-bootstrap';
import { ApexOptions } from 'apexcharts';
import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
import ReactECharts from 'echarts-for-react';
import { roundToZeroDecimal } from 'utils/maths';

const PMChart = ({ data, lastUpdated, infoClickFn }: any) => {
    // const latestData = data && data.length > 0 ? data[data.length - 1] : null;
    // const apexData = latestData ? [latestData.PM10 || 0, latestData.PM25 || 0, latestData.PM1 || 0] : [0, 0, 0];
    // const latestData = data && data.length > 0 ? data[data.length - 1] : null;
    const [showText, setShowText] = useState(true);
    let Data =
        data && Object.keys(data).length > 0
            ? [
                  roundToZeroDecimal(data?.pm10),
                  roundToZeroDecimal(data?.pm25),
                  //   roundToOneDecimal(latestData.PM1 || 0),
              ]
            : [0, 0];
    // console.log('Data:', data, Data);
    // Data = [85, 925];

    const getPM10Color = (value: number) => {
        if (value >= 0 && value <= 54) return '#59e759';
        else if (value >= 55 && value <= 154) return '#4ea4f8';
        else if (value >= 155 && value <= 254) return '#f2f262';
        else if (value >= 255 && value <= 354) return '#f5b43e';
        else if (value >= 355 && value <= 424) return '#FF4500';
        else if (value >= 424) return '#8B0000';
        else return '#A9A9A9';
    };

    const getPM25Color = (value: number) => {
        if (value >= 0 && value <= 12) return '#59e759';
        else if (value >= 13 && value <= 35) return '#4ea4f8';
        else if (value >= 36 && value <= 55) return '#f2f262';
        else if (value >= 56 && value <= 150) return '#f5b43e';
        else if (value >= 151 && value <= 250) return '#FF4500';
        else if (value >= 251) return '#8B0000';
        else return '#A9A9A9';
    };
    const getPM10Labels = (value: number) => {
        if (value >= 0 && value <= 54) return 'Good';
        else if (value >= 55 && value <= 154) return 'Moderate';
        else if (value >= 155 && value <= 254) return 'Unhealthy';
        else if (value >= 255 && value <= 354) return 'Very Unhealthy';
        else if (value >= 355 && value <= 424) return 'Very Unhealthy';
        else if (value >= 424) return 'Hazardous';
        else return '';
    };

    const getPM25Labels = (value: number) => {
        if (value >= 0 && value <= 12) return 'Good';
        else if (value >= 13 && value <= 35) return 'Moderate';
        else if (value >= 36 && value <= 55) return 'Unhealthy';
        else if (value >= 56 && value <= 150) return 'Very Unhealthy';
        else if (value >= 151 && value <= 250) return 'Very Unhealthy';
        else if (value >= 251) return 'Hazardous';
        else return '';
    };
    const getPM1Color = (value: number) => {
        if (value >= 0 && value <= 12) return '#00FF00';
        else if (value >= 13 && value <= 35) return '#1E90FF';
        else if (value >= 36 && value <= 55) return '#FFFF00';
        else if (value >= 56 && value <= 150) return '#FFA500';
        else if (value >= 151 && value <= 250) return '#FF4500';
        else if (value >= 251) return '#8B0000';
        else return '#A9A9A9';
    };

    const series = [
        {
            name: 'PM 2.5',
            type: 'gauge',
            radius: '77.66%',
            max: 250,
            startAngle: 90,
            endAngle: -270,
            pointer: {
                show: false,
            },
            center: ['50%', '50%'],
            progress: {
                show: true,
                overlap: false,
                roundCap: false,
                clip: false,
                itemStyle: {
                    borderWidth: 0,
                    color: getPM25Color(Data?.[1] ?? -1),
                    // fontSize: 2,
                    // borderColor: '#464646',
                },
            },
            detail: {
                valueAnimation: true,
                formatter: (value: any) => {
                    let val = !value || isNaN(value) ? 'Na' : `${value} µg/m³`;
                    return showText ? `${val}` : null;
                },
                offsetCenter: [0, '80%'],
                textStyle: {
                    fontSize: 14,
                    // lineHeight: 20,
                },
                // width: 50,
                // height: 14,
                // fontSize: 14,
                // color: 'inherit',
                // borderColor: 'inherit',
                // borderRadius: 20,
                // borderWidth: 1,
                // formatter: '{value}%',
            },
            axisLabel: {
                show: false,
            },
            details: {
                width: 50,
                height: 14,
                // fontSize: 3,
                color: 'inherit',
                borderColor: 'inherit',
                borderRadius: 20,
                borderWidth: 1,
                // formatter: '{value}%',
            },
            axisLine: {
                lineStyle: {
                    // color: [[1, gaugeColor]],
                    width: 10,
                },
            },
            // pointer: {
            //     itemStyle: {
            //         color: gaugeColor,
            //     },
            // },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
                length: 6,
                lineStyle: {
                    width: 2,
                    color: '#999',
                },
            },
            anchor: {
                show: false,
                showAbove: true,
                size: 25,
                itemStyle: {
                    // borderWidth: 10,
                    // borderColor: gaugeColor,
                },
            },
            title: {
                show: showText,
                fontSize: 14,
            },
            data: [
                {
                    value: Data?.[1] ?? 'Na', // Display the latest VOC value
                    name: 'PM 2.5',
                    // getVoCLabel(Vocvalue),
                    // max: 500,
                    // formatter: (value: any) => {
                    //     // console.log('Value', value);
                    //     let val = isNaN(value) ? '' : value;
                    //     return val;
                    // },
                    title: {
                        offsetCenter: [0, '0%'],
                        textStyle: {
                            fontSize: 6,
                            // color: 'red',
                        },
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 20,
                        offsetCenter: [0, '30%'],
                    },
                },
            ],
        },
        {
            name: 'PM 10',
            type: 'gauge',
            radius: '70%',
            max: 425,
            startAngle: 90,
            endAngle: -270,
            pointer: {
                show: false,
            },
            center: ['50%', '50%'],
            progress: {
                show: true,
                overlap: false,
                roundCap: false,
                clip: false,
                itemStyle: {
                    borderWidth: 0,
                    color: getPM10Color(Data?.[0] ?? -1),
                    // borderColor: '#464646',
                },
            },
            detail: {
                valueAnimation: true,
                formatter: (value: any) => {
                    let val = !value || isNaN(value) ? 'Na' : `${value} µg/m³`;
                    return !showText ? `${val}` : null;
                },
                offsetCenter: [0, '80%'],
                textStyle: {
                    fontSize: 14,
                    // lineHeight: 20,
                },
                // width: 50,
                // height: 14,
                // fontSize: 14,
                // color: 'inherit',
                // borderColor: 'inherit',
                // borderRadius: 20,
                // borderWidth: 1,
                // formatter: '{value}%',
            },
            axisLabel: {
                show: false,
            },
            details: {
                width: 50,
                height: 14,
                // fontSize: 8,
                color: 'inherit',
                borderColor: 'inherit',
                borderRadius: 20,
                borderWidth: 1,
                // formatter: '{value}%',
            },
            axisLine: {
                lineStyle: {
                    // color: [[1, gaugeColor]],
                    width: 10,
                },
            },
            // pointer: {
            //     itemStyle: {
            //         color: gaugeColor,
            //     },
            // },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
                length: 6,
                lineStyle: {
                    width: 2,
                    color: '#999',
                },
            },
            anchor: {
                show: false,
                showAbove: true,
                size: 25,
                itemStyle: {
                    // borderWidth: 10,
                    // borderColor: gaugeColor,
                },
            },
            title: {
                show: true,
                fontSize: 14,
            },
            data: [
                {
                    value: Data?.[0] ?? 'Na', // Display the latest VOC value
                    name: 'PM 10',
                    // getVoCLabel(Vocvalue),
                    max: 425,
                    formatter: (value: any) => {
                        // console.log('Value', value);
                        return '';
                    },
                    title: {
                        show: !showText,
                        offsetCenter: [0, '0%'],
                        textStyle: {
                            fontSize: 6,
                            // color: 'red',
                        },
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 20,
                        offsetCenter: [0, '33.5%'],
                    },
                },
            ],
        },
    ];
    // ECharts option configuration
    const option = {
        tooltip: {
            formatter: '{a} : {c} µg/m³',
        },
        series: series,
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setShowText((prev) => !prev);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(interval);
    }, []);
    return (
        <Card style={{ width: '100%' }}>
            {/* style={{ height: '417px' }} */}
            <Card.Body style={{ padding: '0' }}>
                <div style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
                    <h5 style={{ padding: '10px', paddingLeft: '15px' }}> Particulate Matter</h5>{' '}
                    <div onClick={(e: React.MouseEvent<HTMLDivElement>) => infoClickFn && infoClickFn(e, 'PM')}>
                        <InformationIcon />
                    </div>
                </div>{' '}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ReactECharts option={option} style={{ height: '250px', width: '250px' }} />
                </div>
                {/* <Row className="text-center mb-3" style={{ fontSize: '0.6em' }}>
                    <Col sm={4}>
                        <p className="text-muted mb-0 ">
                            <i
                                className="mdi mdi-checkbox-blank-circle"
                                style={{ color: getPM10Color(apexData[0]) }}></i>{' '}
                            PM10
                        </p>
                    </Col>
                    <Col sm={4}>
                        <p className="text-muted mb-0">
                            <i
                                className="mdi mdi-checkbox-blank-circle"
                                style={{ color: getPM25Color(apexData[1]) }}></i>{' '}
                            PM2.5
                        </p>
                    </Col>
                    <Col sm={4}>
                        <p className="text-muted mb-0 ">
                            <i
                                className="mdi mdi-checkbox-blank-circle "
                                style={{ color: getPM25Color(apexData[1]) }}></i>{' '}
                            PM1
                        </p>
                    </Col>
                </Row> */}
                <div
                    style={{
                        // width: '180px',
                        // paddingTop: '10px',
                        // fontSize: '12px',
                        // textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <h6 style={{ fontSize: '10px', fontWeight: '600' }}>Updated on {lastUpdated} </h6>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PMChart;
