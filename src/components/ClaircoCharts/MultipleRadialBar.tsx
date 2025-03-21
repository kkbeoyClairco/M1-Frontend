import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

import { Card } from 'react-bootstrap';
import { number } from 'yup';

const MultipleRadialBar = () => {
    const apexDonutOpts: ApexOptions = {
        chart: {
            height: 350,
            type: 'radialBar',
        },
        labels: ['PM 2.5', 'PM 10'],
        // colors: [' #0ACF97', '#727cf5'],

        // colors: ['#F44336', '#E91E63', '#9C27B0'],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '10px',
            offsetX: 0,
            offsetY: -10,
        },

        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 240,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };
    const apexDonutData: number[] = [50, 55];

    return (
        <div>
            {' '}
            <Card>
                <Card.Body style={{ padding: '0' }}>
                    {/* <h4 className="header-title mb-3">Spline Area</h4> */}
                    <Chart
                        options={apexDonutOpts}
                        series={apexDonutData}
                        type="radialBar"
                        height={330}
                        className="apex-charts"
                    />
                </Card.Body>
            </Card>
        </div>
    );
};

export default MultipleRadialBar;
