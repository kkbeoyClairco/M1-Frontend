import { Row, Col } from 'react-bootstrap';
import StatisticsWidget from './StatisticsWidget';
import { useState } from 'react';
import { StatisticsChartWidget } from 'components';

const Statistics = () => {
    const initialChartData = {
        totalFaultySensors: {
            stats: '84',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '3.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
        batteryChangeRequired: {
            stats: '84',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '4.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
        seatsUnmonitored: {
            stats: '35',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '1.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
        lowBattery: {
            stats: '108',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '3.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
    };

    const [chartData, setChartData] = useState(initialChartData);

    return (
        <>
            <Row>
                <Col md={3}>
                    <StatisticsChartWidget
                        description="Battery Change Required"
                        title={
                            <span>
                                Total Customers
                                <br />
                                {/* Required */}
                            </span>
                        }
                        stats={chartData.batteryChangeRequired.stats}
                        trend={chartData.batteryChangeRequired.trend}
                        colors={['#008675']}
                        data={chartData.batteryChangeRequired.data}
                    />
                </Col>

                <Col md={3}>
                    <StatisticsChartWidget
                        description="Battery Change Required"
                        title={
                            <span>
                                Total Devices <br />
                                {/* Required */}
                            </span>
                        }
                        stats={chartData.batteryChangeRequired.stats}
                        trend={chartData.batteryChangeRequired.trend}
                        colors={['#008675']}
                        data={chartData.batteryChangeRequired.data}
                    />
                </Col>

                <Col md={3}>
                    <StatisticsChartWidget
                        description="Battery Change Required"
                        title={
                            <span>
                                Total Alerts <br />
                                {/* Required */}
                            </span>
                        }
                        stats={chartData.batteryChangeRequired.stats}
                        trend={chartData.batteryChangeRequired.trend}
                        colors={['#008675']}
                        data={chartData.batteryChangeRequired.data}
                    />
                </Col>
                <Col md={3}>
                    <StatisticsChartWidget
                        description="Battery Change Required"
                        title={
                            <span>
                                Total Users <br />
                                {/* Required */}
                            </span>
                        }
                        stats={chartData.batteryChangeRequired.stats}
                        trend={chartData.batteryChangeRequired.trend}
                        colors={['#008675']}
                        data={chartData.batteryChangeRequired.data}
                    />
                </Col>
            </Row>
        </>
    );
};

export default Statistics;
