import ReactEcharts from 'echarts-for-react';

// Expected Parameters Format:
// The `parameters` prop should be an array of strings.
// Example:
// [ 'Very Poor', 'Poor',  'Satisfactory',  'Good', 'Excellent' ]

// Expected xAxis Format:
// The `xAxis` prop should be an array of strings.
// Example:
// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Expected Data Format:
// The `data` prop should be an array of arrays where:
// - The first element of each inner array corresponds to the first element in the parameter and second corresponds to the second element of hte parameter.
// Example:
// [100, 302, 301, 334, 390, 330, 320,225],
//   [320, 132, 101, 134, 90, 230, 210,256],
//   [220, 182, 191, 234, 290, 330, 310,0],
//   [150, 212, 201, 154, 190, 330, 410,0],
//   [820, 832, 901, 934, 1290, 1330, 1320,0]

// Expected Color Formats
// The `color` prop should be an array of hexcodes in strings.

// Example: ['#59e759', '#129F17', '#E7E75F', '#f39c12', '#e74c3c'];

const StackedBarChart = ({ parameters, xAxisData, data, colors }: any) => {
    const grid = {
        left: '10%',
        right: '10%',
        bottom: '22%',
    };
    const series = parameters?.map((name: any, sid: number) => {
        return {
            name,
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: {
                show: true,
                formatter: (params: any) => params?.value + '%',
            },
            data: data?.[sid]?.map(
                (d: any, did: any) => (d === null || d === 0 ? '' : d)
                // (totalData[did] <= 0 ? 0 : d / totalData[did])
            ),
            itemStyle: {
                color: colors[sid],
            },
            tooltip: {
                show: true,
            },
        };
    });
    const option = {
        legend: {
            selectedMode: 'multiple',
        },
        grid,
        yAxis: {
            show: false,
            type: 'value',
            minInterval: 1,
        },
        xAxis: {
            type: 'category',
            data: xAxisData ?? [],
            axisLabel: {
                rotate: 60, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'right',
                },
                // interval: 1,
                margin: 30,
            },
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        series,
    };
    // console.log('series', series);
    return (
        // <div className="d-flex justify-content-center align-items-center">
        <div className="chart-container ">
            {' '}
            <ReactEcharts option={option} style={{ height: '35em', width: '60em' }} className="responsive-echart" />
        </div>
    );
};

export default StackedBarChart;
