import React, { useCallback, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card } from 'react-bootstrap';
import { useSSR } from 'react-i18next';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
// import { getFeedbackCumulative } from 'helpers/api/services/Clairco/customerSide/feedback';
import { features } from 'process';
// const data = [
//     { value: 484, name: 'Excellent' },
//     { value: 580, name: 'Good' },
//     { value: 735, name: 'Satisfactory' },
//     { value: 1048, name: 'Poor' },
//     { value: 300, name: 'Very Poor' },
// ];

const PiChartComponent = ({ zoneId, title, colors, data, isLoading }: any) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [data, setData] = useState(data);
    const option = {
        title: {
            text: '',
            subtext: '',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {d}%  ({c})',
        },
        legend: {
            show: true,
            orient: 'horizontal',
            left: 'left',
        },

        series: [
            {
                name: '',
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    // const getCumulativeData = useCallback(async () => {
    //     try {
    //         if (!zoneId) return;
    //         setIsLoading(true);
    //         const res = await getFeedbackCumulative(zoneId);
    //     } catch (error) {
    //         setIsLoading(false);
    //         console.log(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [zoneId]);
    // useEffect(
    //     function initialAPiCall() {
    //         getCumulativeData();
    //     },
    //     [zoneId, getCumulativeData]
    // );
    return (
        <Card>
            <Card.Header>
                <span className="text-center">
                    <h5>{title ?? ''}</h5>
                </span>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
                {!isLoading ? (
                    <ReactEcharts
                        option={option}
                        style={{ height: '32em', width: '40em' }}
                        className="responsive-echart"
                    />
                ) : (
                    <div className="flex-row w-100">
                        <TableSkelton />
                        <TableSkelton />
                        <TableSkelton />
                        <TableSkelton />
                    </div>
                )}{' '}
            </Card.Body>
        </Card>
    );
};

export default PiChartComponent;
