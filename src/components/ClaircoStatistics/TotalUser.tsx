import React from 'react';
import StatisticsChartWidget from 'components/StatisticsChartWidget';
import { Col } from 'react-bootstrap';

type UserProps = {
    chartData: any;
};
export const TotalUsers = ({ chartData = null }: UserProps) => {
    return (
        <>
            <Col md={3}>
                <StatisticsChartWidget
                    description="Battery Change Required"
                    title={
                        <span>
                            Total Users
                            <br />
                            {/* Required */}
                        </span>
                    }
                    stats={chartData.totalFaultySensors.stats}
                    trend={chartData.totalFaultySensors.trend}
                    colors={['#008675']}
                    data={chartData.totalFaultySensors.data}
                />
            </Col>
        </>
    );
};
