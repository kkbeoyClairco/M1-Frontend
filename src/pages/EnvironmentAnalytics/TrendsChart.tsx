import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Breadcrumb, Card, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LineAnnotationChart = ({ Building = '', Floor = '', Parameter = '', Sensor = '' }) => {
    // state variables for chart data and breadcrumb
    // const [chartData, setChartData] = React.useState([0]);

    // useEffect(() => {
    //     // fetch from API
    //     setChartData([10,30,40,20,40,30,10,30,30,60,50,70]);
    // }, []);

    // default options
    const apexLineChartWithAnnotationOpts: ApexOptions = {
        chart: {
            height: 300,
            type: 'line',
            id: 'areachart-2',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#5470C6'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [3],
            curve: 'straight',
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };

    // chart data
    const apexLineChartWithAnnotationData = [
        {
            name: 'VOC Trends',
            data: [10, 30, 40, 20, 40, 30, 10, 30, 30, 60, 50, 70],
        },
    ];

    const getWeekData = () => {
        return [
            {
                name: 'VOC Weekly Trends',
                data: [10, 30, 40, 20, 40, 30, 10, 30, 30, 60, 50, 70],
            },
        ];
    };
    const getMonthData = () => {
        return [
            {
                name: 'VOC Monthly Trends',
                data: [10, 30, 40, 20, 40, 30, 10, 30, 30, 60, 50, 70],
            },
        ];
    };
    const getQuarterData = () => {
        return [
            {
                name: 'VOC Quarterly Trends',
                data: [10, 30, 40, 20, 40, 30, 10, 30, 30, 60, 50, 70],
            },
        ];
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <Tab.Container defaultActiveKey="week">
                        <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                            <div className="ChartHeading">
                            <h4 className="header-title">VOC Trends</h4>
                            <Breadcrumb listProps={{ className: 'mb-0 p-0' }}>
                                <Breadcrumb.Item href="#">Bosch</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">Hong Kong</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">{Building || 'Building'}</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">{Floor || 'Floor'}</Breadcrumb.Item>
                                <Breadcrumb.Item href="#">{Parameter || 'Parameter'}</Breadcrumb.Item>
                                <Breadcrumb.Item active>{Sensor || 'Sensor'}</Breadcrumb.Item>
                            </Breadcrumb>
                            </div>
                            <Nav as="ul" variant="pills" className="bg-nav-pills p-1 rounded">
                                <Nav.Item as="li">
                                    <Nav.Link as={Link} className="py-1" to="#" eventKey="week">
                                        Week
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={Link} className="py-1" to="#" eventKey="month">
                                        Month
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={Link} className="py-1" to="#" eventKey="quarter">
                                        Quarter
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        <Tab.Content>
                            <Tab.Pane eventKey="week">
                                <Chart
                                    options={apexLineChartWithAnnotationOpts}
                                    series={getWeekData()}
                                    type="line"
                                    className="apex-charts"
                                    height={350}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="month">
                                <Chart
                                    options={apexLineChartWithAnnotationOpts}
                                    series={getMonthData()}
                                    type="line"
                                    className="apex-charts"
                                    height={350}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="quarter">
                                <Chart
                                    options={apexLineChartWithAnnotationOpts}
                                    series={getQuarterData()}
                                    type="line"
                                    className="apex-charts"
                                    height={350}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Card.Body>
            </Card>
        </>
    );
};

export default LineAnnotationChart;
