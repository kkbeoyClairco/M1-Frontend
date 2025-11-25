import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import classNames from 'classnames';
import { ApexOptions } from 'apexcharts';

type StatisticsChartWidgetProps = {
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
    lastUpdated?: string;
    trend: {
        textClass: string;
        icon: string;
        value: string;
    };
};

const StatisticsChartWidget = ({
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
    lastUpdated,
}: StatisticsChartWidgetProps) => {
    //  default options
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
        <Card className={classNames('widget-flat', bgClass)} style={{ height: '390px' }}>
            <Card.Body style={{}}>
                <h5
                    className={classNames('fw-normal', 'mt-0', 'text-truncate', textClass ? textClass : 'text-muted')}
                    title={description}>
                    {title}
                </h5>
                <Row className="align-items-center">
                    {/* <Col className="col-6"> */}

                    <Row style={{ height: '220px', display: 'flex', alignContent: 'center', paddingTop: '20px' }}>
                        <h2 style={{ paddingTop: '0' }} className="my-2 py-1">
                            {stats}
                        </h2>
                        <p style={{ paddingTop: '0' }} className="my-2 py-1">
                            Data based on <br />
                            <p style={{ marginLeft: '20px' }}>{lastUpdated}</p>
                        </p>
                    </Row>
                    {trend && (
                        <p className={classNames('mb-0', textClass ? textClass : 'text-muted')}>
                            <span className={classNames(trend.textClass, 'me-2')}>
                                {/* <i className={trend.icon}></i> {1} */}
                            </span>
                        </p>
                    )}
                    {/* </Col> */}
                    <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {' '}
                        <Col className="col-6">
                            <div className="text-end">
                                <Chart
                                    className="apex-charts"
                                    options={options}
                                    series={series}
                                    type={type || 'bar'}
                                    height={60}
                                />
                            </div>
                        </Col>
                    </Row>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default StatisticsChartWidget;
