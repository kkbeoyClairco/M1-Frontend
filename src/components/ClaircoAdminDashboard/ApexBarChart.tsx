import React from 'react';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

type ApexBarChartWidgetProps = {
    colors?: Array<string>;
    type?: 'line' | 'bar';
    name?: string;
    data?: Array<number>;
    textClass?: string;
    bgClass?: string;
    description?: string;
    // title?: string;
    title?: React.ReactNode;

    stats?: string;
    icon?: string;
    trend: {
        textClass: string;
        icon: string;
        value: string;
    };
};

export const ApexBarChart = ({
    colors,
    type,
    name,
    data,
    textClass,
    bgClass,
    description,
    title,
    stats,
    trend,
}: ApexBarChartWidgetProps) => {
    const options: ApexOptions = {
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '60%',
            },
        },
        xaxis: {
            crosshairs: {
                width: 1,
            },
        },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        colors: colors || ['#008FFB'],
        tooltip: {
            fixed: {
                enabled: false,
            },
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: function (seriesName: string) {
                        return '';
                    },
                },
            },
            marker: {
                show: false,
            },
        },
    };

    // chart data
    const series = [{ name: name || 'Data', data: data || [] }];
    return (
        <div>
            <Chart className="apex-charts" options={options} series={series} type={type || 'bar'} height={60} />
        </div>
    );
};
