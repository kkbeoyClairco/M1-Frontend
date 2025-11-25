import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import classNames from 'classnames';
import { ApexOptions } from 'apexcharts';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';
type StatisticsChartWidgetProps = {
    colors?: Array<string>;
    type?: 'line' | 'bar';
    name?: string;
    data?: Array<number> | String;
    textClass?: string;
    bgClass?: string;
    description?: string;
    // title?: string;
    title?: React.ReactNode;
    functionToExecute?: () => void;
    stats?: string;
    icon?: string;
    lastUpdated?: any;
    stats2?: string;
    trend?:
        | {
              textClass?: string;
              icon?: string;
              value?: string;
          }
        | any;
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
    stats2,
    functionToExecute,
}: StatisticsChartWidgetProps) => {
    const handleClick = async () => {
        try {
            functionToExecute?.();
        } catch (error) {
            console.log(error);
        }
    };
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
    return (
        <Card onClick={handleClick} className={classNames('widget-flat', bgClass)} style={{ height: '145px' }}>
            <Card.Body>
                <Row className="align-items-center">
                    <Row>
                        <Col sm={9}>
                            <h5
                                className={classNames(
                                    'fw-normal',
                                    'mt-0',
                                    'text-truncate',
                                    textClass ? textClass : 'text-muted'
                                )}
                                title={description}>
                                {title}
                            </h5>{' '}
                        </Col>{' '}
                        <Col sm={3} style={{ display: 'flex', justifyContent: 'end' }}>
                            {functionToExecute && <Navigator />}
                        </Col>
                    </Row>
                    <Col className="col-6">
                        {/* <h5
                            className={classNames(
                                'fw-normal',
                                'mt-0',
                                'text-truncate',
                                textClass ? textClass : 'text-muted'
                            )}
                            title={description}>
                            {title}
                        </h5> */}
                        <h3 className="my-2 py-1">{stats ? stats : Number(stats) === 0 ? 0 : '-'}</h3>

                        {trend && (
                            <p className={classNames('mb-0', textClass ? textClass : 'text-muted')}>
                                <span className={classNames(trend.textClass, 'me-2')}>
                                    {/* <i className={trend.icon}></i> {1} */}
                                </span>
                            </p>
                        )}
                    </Col>
                    <Col className="col-6">
                        <div className="text-end">
                            {/* <Chart
                                className="apex-charts"
                                options={options}
                                series={series}
                                type={type || 'bar'}
                                height={60}
                            /> */}
                        </div>{' '}
                        <Row>
                            {stats2 ? (
                                <p style={{ color: '#088F8F', fontSize: '13px', marginTop: '0px', padding: '0px' }}>
                                    {' '}
                                    {`You've saved ${stats2}% in energy costs since installation.`}
                                </p>
                            ) : (
                                <p style={{ fontSize: '10px', marginTop: '5px' }}>Updated on {lastUpdated}</p>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default StatisticsChartWidget;
