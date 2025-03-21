import { Row, Col } from 'react-bootstrap';
import { StatisticsChartWidget } from 'components';
import { useEffect, useState } from 'react';

const SensorStatistics = () => {
    const initialChartData = {
        totalFaultySensors: {
            stats: '861',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '4.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
        batteryChangeRequired: {
            stats: '861',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '4.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
        seatsUnmonitored: {
            stats: '861',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '4.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
        lowBattery: {
            stats: '861',
            trend: {
                textClass: 'text-success',
                icon: 'mdi mdi-arrow-up-bold',
                value: '4.87%',
            },
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
        },
    };

    const [chartData, setChartData] = useState(initialChartData);

    useEffect(() => {}, []);

    return (
        <>
            <Row>
                <Col sm={6}>
                    <StatisticsChartWidget
                        description="Total Faulty Sensors"
                        title={
                            <span>
                                Total Inactive
                                <br />
                                Sensors
                            </span>
                        }
                        stats={chartData.totalFaultySensors.stats}
                        trend={chartData.totalFaultySensors.trend}
                        colors={['#00C5DC']}
                        data={chartData.totalFaultySensors.data}
                    />
                </Col>

                <Col sm={6}>
                    <StatisticsChartWidget
                        description="Battery Change Required"
                        title={
                            <span>
                                Battery Change
                                <br />
                                Required
                            </span>
                        }
                        stats={chartData.batteryChangeRequired.stats}
                        trend={chartData.batteryChangeRequired.trend}
                        colors={['#00C5DC']}
                        data={chartData.batteryChangeRequired.data}
                    />
                </Col>
            </Row>

            <Row>
                <Col sm={6}>
                    <StatisticsChartWidget
                        description="Seats Unmonitored"
                        title="Seats Unmonitor"
                        stats={chartData.seatsUnmonitored.stats}
                        trend={chartData.seatsUnmonitored.trend}
                        colors={['#00C5DC']}
                        data={chartData.seatsUnmonitored.data}
                    />
                </Col>

                <Col sm={6}>
                    <StatisticsChartWidget
                        description="Low Battery"
                        title="Low Battery"
                        stats={chartData.lowBattery.stats}
                        trend={chartData.lowBattery.trend}
                        colors={['#00C5DC']}
                        data={chartData.lowBattery.data}
                    />
                </Col>
            </Row>
        </>
    );
};

export default SensorStatistics;
