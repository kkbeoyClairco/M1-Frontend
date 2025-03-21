import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const StackedBarChart = () => {

    const [ChartData , setChartData] = useState([0]);


    //  const getChartData=async()=>{
    //     try{
    //         const response = await getChartData();
    //         setChartData(data);
    //       }
    //       catch (e: any) {
    //         console.log(e.message);
    //     }
    // }
    useEffect(() => {
      
        setChartData([44, 55, 41, 37, 22]);
    }, []);

    // default options
    const apexBarChartStackedOpts: ApexOptions = {
        chart: {
            height: 300,
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            // updated this
            bar: {
                distributed: true,
                horizontal: true,
                barHeight: '75%',
                dataLabels: {
                    position: 'bottom',
                },
            },
        },
        dataLabels: {
            // added this
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: ['#fff'],
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex];
            },
            offsetX: 0,
            // dropShadow: {
            //     enabled: true,
            // },
        },
        // title: {
        //     // added this
        //     text: 'Yearly Results',
        //     offsetX: 10,
        // },
        xaxis: {
            categories: ['Bosch Main', 'HK Office', 'New York', 'Dubai', 'Hong Kong'],
            labels: {
                formatter: function (val) {
                    return val;
                },
            },
        },
        // yaxis: {
        //     title: {
        //         text: undefined,
        //     },
        // },
        yaxis: {
            labels: {
                show: false,
            },
        },
        colors: ['#727CF5', '#6C757D', '#0ACF97', '#FA5C7C', '#FFC35A'],
       
        // tooltiop to display the X-axis category value only
        tooltip: {
            x: {
                show : false
            },
            y: {
                title: {
                    formatter: function () {
                        return '';
                    },
                },
                formatter: function (val, opts) {
                    return opts.w.globals.labels[opts.dataPointIndex] + ' :  ' + val;
                },

            },
        },
        
        fill: {
            opacity: 1,
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                },
            },
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: '#f1f3fa',
        },
    };

    // chart data
    const apexBarChartStackedData = [
        {
            name: 'Countries',
            data: ChartData,
        },
    ];

    return (
        <Card>
            <Card.Body>
                <h4 className="header-title mb-n3">Building Wise Split</h4>
                <Chart
                    options={apexBarChartStackedOpts}
                    series={apexBarChartStackedData}
                    type="bar"
                    className="apex-charts"
                    height={280}
                />
            </Card.Body>
        </Card>
    );
};

export default StackedBarChart;
