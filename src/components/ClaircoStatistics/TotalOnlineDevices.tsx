import React from 'react';
import StatisticsChartWidget from 'components/StatisticsChartWidget';
import { Col } from 'react-bootstrap';

type OnlineProps = {
    chartData: any;
};

export const TotalOnline = ({ chartData = null}: OnlineProps) => {
    return (
        <>
            <Col md={3}>
                <StatisticsChartWidget
                    description="Battery Change Required"
                    title={
                        <span>
                            Total Online
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
