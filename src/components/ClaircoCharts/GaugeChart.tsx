import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Card } from 'react-bootstrap';
import { propertyTable, unitTables, coloursTable } from 'appConstants/propertyTable';

import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;
interface GaugeChartProps {
    property: string;
    value: number;
    deviceName: string;
}
const GaugeChart: React.FC<GaugeChartProps> = ({ property, value, deviceName }) => {
    let option: EChartsOption;
    // console.log('Value', value);
    // value = 6;
    const [fanSpeed, setFanSpeed] = useState(0);
    const fanSpeedObject: { [key: number]: string } = {
        1: 'auto',
        2: 'Low',
        3: 'Low+',
        4: 'Medium',
        5: 'Medium+',
        6: 'High',
    };
    option = {
        legands: {
            show: true,
        },
        tooltip: {
            // trigger: 'axis',
            borderWidth: 0,
            // backgroundColor: 'rgba(50, 50, 50, 0.7)',

            textStyle: {
                color: '#6c757d',
                fontSize: 14,
            },
            // formatter: '{b}',
            formatter: 'Fan Speed: {b}',
        },
        series: [
            {
                type: 'gauge',
                startAngle: -120,
                endAngle: -60,
                min: 1,
                max: 6.5,
                // splitNumber: 6,

                progress: {
                    show: false,
                    width: 3,
                    roundCap: true,
                },
                itemStyle: {
                    color: '#004EFF',
                    // shadowColor: 'rgba(0,138,255,0.45)',
                    // shadowBlur: 10,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: '75%',
                    width: 3,
                    offsetCenter: [0, '5%'],
                },
                axisLine: {
                    lineStyle: {
                        width: 5,
                        color: [
                            [0.1666, '#5470C6'], //auto
                            [0.33, '#73C0DE'],
                            [0.49, '#91CC75'],
                            [0.66, '#3BA272'],
                            [0.82, '#FAC858'],
                            [1, '#EE6666'],
                        ],
                    },
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#999',
                    },
                },
                splitLine: {
                    length: 1,
                    lineStyle: {
                        width: 1,
                        color: '#999',
                    },
                },

                axisLabel: {
                    distance: -20,
                    // color: '#999',
                    fontSize: 12,
                    rotate: 'tangential',
                    // formatter: function (value: number) {
                    //     const labels: { [key: string]: string } = {
                    //         4.95: 'V-High',
                    //         4.4: 'High',
                    //         3.3: 'Medium',
                    //         2.2: 'Low',
                    //         1.1: 'V-Low',
                    //         0.55: 'Auto',
                    //     };
                    //     return labels[value] ? `{a|${labels[value]}}` : '';
                    // },
                    // rich: {
                    //     a: {
                    //         padding: [0, 10, 0, 10], // Adjust padding to move the labels
                    //         // color: '#999',
                    //     },
                    // },

                    formatter: function (value) {
                        // console.log('Vlaues to formatter', value);
                        if (value === 5.95) {
                            return 'High';
                        } else if (value === 5.4) {
                            return 'Medium+            '; //Space is deliberatly given to style the position of label
                        } else if (value === 4.3) {
                            return 'Medium';
                        } else if (value === 3.2) {
                            return 'Low+';
                        } else if (value === 2.1) {
                            return '       Low';
                        } else if (value === 1.55) {
                            return 'Auto';
                        }
                        return '';
                    },
                },
                anchor: {
                    show: false,
                    showAbove: true,
                    size: 25,
                    itemStyle: {
                        borderWidth: 10,
                    },
                },
                title: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bold',
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 0,
                    offsetCenter: [0, '80%'],
                },
                data: [
                    {
                        value: value + 0.25 || 0,
                        name: fanSpeedObject[value],
                        title: {
                            offsetCenter: ['0%', '110%'],
                        },
                    },
                ],
            },
        ],
    };
    useEffect(() => {
        if (fanSpeed !== value) setFanSpeed(value);
    }, [value]);
    return (
        <div className="d-flex justify-content-center">
            <ReactEcharts option={option} style={{ height: '20em', width: '100%' }} /> {/* </Card.Body> */}
        </div>
    );
};

export default GaugeChart;
