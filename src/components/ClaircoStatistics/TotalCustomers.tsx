import React from "react";
import StatisticsChartWidget from 'components/StatisticsChartWidget';
import { Col } from 'react-bootstrap';

type CustomerProps = {
   chartData:any;
}

export const TotalCustomers  =({chartData=null}:CustomerProps)=>{
    return (
        <>
           <Col md={3}>
                <StatisticsChartWidget
                    description="Battery Change Required"
                    title={
                        <span>
                            Total Customers<br />
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
    )
}