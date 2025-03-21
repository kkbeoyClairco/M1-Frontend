import React from 'react';
import StatisticsChartWidget from 'components/StatisticsChartWidget';
import { Col } from 'react-bootstrap';
type AlertProps = {
    chartData: any;
};
export const TotalAlerts = ({ chartData = null}: AlertProps) => {
    return (
        <>
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
        </>
    );
};
