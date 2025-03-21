import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card } from 'react-bootstrap';
import * as echarts from 'echarts';
import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
type EChartsOption = echarts.EChartsOption;
interface GaugeChartProps {
    property?: string;
    value?: number;
    deviceName?: string;
    lastUpdated?: string;
    infoClickFn?: (e: React.MouseEvent<HTMLDivElement>, state: string) => void;
}
const GaugeChartIAQ: React.FC<GaugeChartProps> = ({ property, value, deviceName, lastUpdated, infoClickFn }) => {
    // let option: EChartsOption;
    // console.log('Value', value);
    // value = 6;
    // const [aqi, setFanSpeed] = useState(0);
    // const latestData = data && data.length > 0 ? data[data.length - 1] : null;
    // const aqiValue = roundToOneDecimal(latestData?.AQI);
    const getIAQColor = (value: number) => {
        if (value >= 0 && value <= 50) return '#59e759';
        if (value > 50 && value <= 100) return '#4ea4f8';
        if (value > 100 && value <= 200) return '#f2f262';
        if (value > 200 && value <= 300) return '#f5b43e';
        if (value > 300 && value <= 400) return '#FF4500';
        if (value > 400 && value <= 500) return '#8B0000';
        else if (value > 500) return '#8B0000';
        else return '#A9A9A9';
    };
    const getAQILabels = (value: any) => {
        if (value > 0 && value <= 50) return 'Good';
        else if (value > 50 && value <= 100) return 'Moderate';
        else if (value > 100 && value <= 200) return 'Unhealthy ';
        else if (value > 200 && value <= 300) return 'Unhealthy ';
        else if (value > 300 && value <= 400) return 'Very Unhealthy';
        else if (value > 400 && value <= 500) return 'Hazardous';
        else if (value > 500) return 'Hazardous';

        return '';
    };

    const option = {
        tooltip: {
            formatter: '{a} : {c}',
        },
        series: [
            {
                name: 'Air Quality Index',
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
                        color: getIAQColor(Number(value)),
                        // borderColor: '#464646',
                    },
                },
                detail: {
                    valueAnimation: true,
                    formatter: (value: any) => {
                        let val = isNaN(value) ? 'Na' : value;
                        return val;
                    },
                    offsetCenter: [0, '80%'],
                    textStyle: {
                        fontSize: 14,
                    },
                },
                axisLabel: {
                    show: false,
                    fontSize: 8,
                },
                details: {
                    width: 50,
                    height: 14,
                    // fontSize: 14,
                    color: 'inherit',
                    borderColor: 'inherit',
                    borderRadius: 20,
                    borderWidth: 1,
                    formatter: '{value}%',
                },
                data: [
                    {
                        value: value || 'Na',
                        name: getAQILabels(value),
                        detail: {
                            valueAnimation: true,
                            fontSize: 20,
                            offsetCenter: ['0%', '30%'],
                        },
                        title: {
                            offsetCenter: [0, '0%'],
                            textStyle: {
                                fontSize: 6,
                                color: '#8818',
                            },
                        },
                    },
                ],
                min: 0,
                max: 500,
                // splitNumber: 10,
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
                },
            },
        ],
    };

    // useEffect(() => {
    //     if (fanSpeed !== value) setFanSpeed(value);
    // }, [value]);
    return (
        <Card style={{ width: '100%', height: '23.5em' }}>
            {/* style={{ height: '417px' }} */}
            <Card.Body style={{ padding: '0' }}>
                <div style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
                    <h5 style={{ padding: '10px', paddingLeft: '15px' }}>Air Quality Index</h5>
                    {infoClickFn && (
                        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => infoClickFn && infoClickFn(e, 'AQI')}>
                            <InformationIcon />
                        </div>
                    )}
                </div>
                {/* <Card.Body style={{ padding: '10px' }}> */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {/* {value && typeof value === 'number' ? ( */}
                    <ReactEcharts option={option} style={{ height: '250px', width: '250px' }} />
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
                    {typeof value === 'number' && (
                        <h6 style={{ fontSize: '10px', fontWeight: '600' }}>Updated on {lastUpdated} </h6>
                    )}{' '}
                </div>
                {/* //     </Card.Body> */}
                {/* </Card.Body> */}
            </Card.Body>
        </Card>
    );
};

export default GaugeChartIAQ;
