import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { ParamNameForDisplay } from '../../../../utils/AQI/analytics';
const yLabels = [null, 'Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous'];
const StepLineChart = ({ series, xAxis }: any) => {
    const option = {
        title: {
            // text: 'Step Line',
        },
        animationDuration: 1000,
        grid: {
            left: '10%',
            right: '10%',
            bottom: '22%',
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (values: any) {
                let toolTipContent = values[0].name + '<br/>';
                // console.log('Tool tip values', values);
                values.forEach((item: any) => {
                    toolTipContent +=
                        item?.marker +
                        ' ' +
                        ParamNameForDisplay[item?.seriesName] +
                        ' ' +
                        ':' +
                        ' ' +
                        yLabels[Number(item?.value)] +
                        ' <br/>';
                });
                return toolTipContent;
            },
        },
        legend: {
            show: false,
            // data: series?.map((sr: any) => sr?.name ?? ''),
        },

        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        xAxis: {
            type: 'category',
            data: xAxis,
            axisLabel: {
                rotate: 60,
                textStyle: {
                    align: 'right',
                },
                // interval: 1,
                margin: 30,
            },
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 6,
            interval: 1,
            axisLabel: {
                formatter: (value: number) => yLabels[value] || '',
            },
            // data: [null, 'Good', 'Moderate', 'Poor', 'unhealthy', 'severe', 'Hazardous'],
        },
        series: series,
    };

    useEffect(() => {
        // console.log('Series', series);
    }, []);
    return (
        <div className="chart-container ">
            {' '}
            <ReactEcharts option={option} style={{ height: '35em', width: '60em' }} className="responsive-echart" />
        </div>
    );
};
export default StepLineChart;
