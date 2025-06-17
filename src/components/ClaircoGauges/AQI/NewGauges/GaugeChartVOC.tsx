import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Card } from 'react-bootstrap';
import { propertyTable, unitTables, coloursTable } from 'appConstants/propertyTable';

import * as echarts from 'echarts';
import { conforms } from 'lodash';
import { string } from 'yup';
import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
type EChartsOption = echarts.EChartsOption;
interface GaugeChartProps {
    property: string;
    value: number;
    deviceName: string;
    lastUpdated?: string;
    infoClickFn?: (e: React.MouseEvent<HTMLDivElement>, state: string) => void;
}
const GaugeChartVOC: React.FC<GaugeChartProps> = ({ property, value, deviceName, lastUpdated, infoClickFn }) => {
    // console.log('VOC Val', value);
    // Function to determine color based on VOC value
    const getVocColor = (value: number) => {
        if (value > 0 && value <= 40) return '#59e759';
        else if (value > 40 && value <= 100) return '#4ea4f8';
        // else if (value <= 40 && value <= 100) return 'Poor';
        else if (value >= 101 && value <= 300) return '#f2f262';
        else if (value >= 301 && value <= 1000) return '#FF4500';
        else return '#A9A9A9';
    };
    const getVoCLabel = (value: number) => {
        if (value > 0 && value <= 40) return 'Good';
        else if (value > 40 && value <= 100) return 'Moderate';
        // else if (value <= 40 && value <= 100) return 'Poor';
        else if (value >= 101 && value <= 300) return 'Poor';
        else if (value >= 301 && value <= 1000) return 'Unhealthy';
        else return '';
    };
    const min = 0;
    const max = 500;

    // ECharts option configuration
    const option = {
        tooltip: {
            formatter: '{a} : {c} ppm',
        },
        series: [
            {
                name: 'Volatile Organic Compounds',
                type: 'gauge',
                radius: '77.66%',
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
                        color: getVocColor(value),
                        // borderColor: '#464646',
                    },
                },
                detail: {
                    valueAnimation: true,
                    formatter: (value: any) => {
                        let val = isNaN(value) ? 'Na' : value + ' ppm';
                        return val;
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
                    // fontSize: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                    // formatter: '{value}%',
                },
                axisLine: {
                    lineStyle: {
                        // color: [[1, gaugeColor]],
                        width: 14,
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
                },

                data: [
                    {
                        value: value || 'Na', // Display the latest VOC value
                        name: getVoCLabel(value),

                        formatter: (value: any) => {
                            // console.log('Value', value);
                            return '';
                        },
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
                            offsetCenter: ['0%', '30%'],
                        },
                    },
                ],
                // title: {
                //     fontSize: 15
                //   },

                min: min,
                max: max,
                // splitNumber: 10,
            },
        ],
    };

    return (
        <Card style={{ width: '100%' }}>
            {/* style={{ height: '417px' }} */}
            <Card.Body style={{ padding: '0' }}>
                <div
                    // xxl={2}
                    style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
                    <h5 style={{ padding: '10px', paddingLeft: '15px', textOverflow: 'clip', textAlign: 'center' }}>
                        Volatile Organic Compounds
                    </h5>{' '}
                    {infoClickFn ? (
                        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => infoClickFn && infoClickFn(e, 'VOC')}>
                            <InformationIcon />{' '}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                {/* <Card.Body style={{ padding: '10px' }}> */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ReactEcharts option={option} style={{ height: '250px', width: '250px' }} />{' '}
                    <div style={{ padding: '5px', display: 'flex', justifyContent: 'center' }}></div>{' '}
                    <h6>{deviceName}</h6>
                </div>{' '}
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
                {/* //     </Card.Body> */}
                {/* </Card.Body> */}
            </Card.Body>
        </Card>
    );
};

export default GaugeChartVOC;
