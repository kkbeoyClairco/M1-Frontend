import ReactEcharts from 'echarts-for-react';

// Expected Data Format:
// The `data` prop should be an array of arrays where:
// - The first element of each inner array is a category (string).
// - The second element is a numeric value (number).
// Example:
// [
//   ['Very Poor', 83.1],
//   ['Poor', 43.3],
//   ['Satisfactory', 86.4],
//   ['Good', 72.4],
//   ['Excellent', 72.4],
// ]

// Expected Colors Format:
// The `colors` prop should be an object where:
// - Keys are category names (strings).
// - Values are color codes (strings).
// Example:
// {
//   'Very Poor': '#e74c3c',
//   'Poor': '#f39c12',
//   'Satisfactory': '#E7E75F',
//   'Good': '#129F17',
//   'Excellent': '#59e759',
// }

const BarChart = ({ colors, data }: any) => {
    const option = {
        legend: { show: false },
        tooltip: {},
        dataset: {
            source: data,
        },
        xAxis: { type: 'category' },
        yAxis: {},

        series: [
            {
                type: 'bar',
                itemStyle: {
                    color: colors,
                },
            },
        ],
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            {' '}
            <ReactEcharts option={option} style={{ height: '24em', width: '45em' }} className="responsive-echart" />
        </div>
    );
};

export default BarChart;
