import React from 'react';
import ReactEcharts from 'echarts-for-react';

const EChartThermal = ({ data }: any) => {
    console.log(data);

    const option = {
        tooltip: {
            position: 'top',
        },
        grid: {
            height: '50%',
            top: '10%',
        },
        xAxis: {
            show: false,
            type: 'category',
            data: new Array(24).fill(0),
            splitArea: {
                show: true,
            },
        },
        yAxis: {
            type: 'category',
            show: false,
            data: new Array(24).fill(0),
            splitArea: {
                show: true,
            },
        },
        visualMap: {
            show: false,
            min: 16,
            max: 40,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            color: ['#0033cc', '#66ccff', '#ffcc00', '#ff3300'],
        },
        series: [
            {
                name: 'Thermal Image',
                type: 'heatmap',
                coordinateSystem: 'cartesian2d',
                cellSize: [10, 10],
                data: data,
                label: {
                    show: false,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    return (
        <div>
            <ReactEcharts option={option} style={{ height: '55vh', width: '100%', overflow: 'clip' }} />
        </div>
    );
};

export default EChartThermal;
