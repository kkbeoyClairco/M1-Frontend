import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { TitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/TitleWidget';
import PiChartComponent from './PiChartComponent';
import TrendsWrapper from './TrendsWrapper';
import FeedbackTable from './FeedbackTable';
// import { getFeedbackCount, getFeedbackCumulative } from 'helpers/api/services/Clairco/customerSide/feedback';
import { useLocation } from 'react-router-dom';
import { cumulativeData } from 'appConstants/feedbackData';

const pieColors: { [key: string]: string } = {
    VeryPoor: '#e74c3c ',
    Poor: '#f39c12',
    Satisfactory: '#E7E75F',
    Good: '#129F17',
    Excellent: '#59e759',
};
const Feedback = () => {
    const [zoneId, setZoneId] = useState<string>('');
    const [pieChartData, setPieChartData] = useState<any>();
    const [nps, setNps] = useState<number | string>(0);
    const [locationDetails, setLocationDetails] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation() as any;

    const colorsTrends = function (params: { name: 'Poor' | 'Very Poor' | 'Satisfactory' | 'Good' | 'Excellent' }) {
        const colors: { [key in typeof params.name]: string } = {
            'Very Poor': '  #e74c3c ',
            Poor: '#f39c12',
            Satisfactory: 'rgb(231, 231, 95)',
            Good: 'rgb(18, 159, 23)',
            Excellent: ' #59e759',
        };
        return colors[params.name];
    };

    // { value: 484, name: 'Excellent' },
    // { value: 580, name: 'Good' },
    // { value: 735, name: 'Satisfactory' },
    // { value: 1048, name: 'Poor' },
    // { value: 300, name: 'Very Poor' },
    const getTotalCounts = useCallback(async (zoneId: string) => {
        try {
            // if (!zoneId) return;
            setIsLoading(true);
            const res: any = { data: cumulativeData };
            // await getFeedbackCumulative(zoneId);
            const data = res?.data?.data?.[0];
            // const data = {
            //     id: '67e68efbe0537bd6eadb0ff1',
            //     zoneId: '67dbe8ff528ca894e2612eaf',
            //     Excellent: '5',
            //     Good: '0',
            //     Satisfactory: '0',
            //     Poor: '1',
            //     VeryPoor: '5',
            //     createdAt: '2025-03-28T11:58:50.725Z',
            //     updatedAt: '2025-03-28T12:24:49.868Z',
            //     NPS: '45.45',
            //     Dissatisfaction: '54.55',
            // };
            const nps = data?.['NPS'];

            const feedbackMap: Array<'Excellent' | 'Good' | 'Satisfactory' | 'Poor' | 'VeryPoor'> = [
                'Excellent',
                'Good',
                'Satisfactory',
                'Poor',
                'VeryPoor',
            ];
            const pieData = feedbackMap
                .map((item) => ({
                    name: item,
                    value: data?.[item],
                    itemStyle: { color: pieColors[item] },
                }))
                .filter((data: any) => data?.value && data?.value > 0);

            setPieChartData(pieData);
            setNps(nps ?? 0);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(
        function getLocationData() {
            getTotalCounts('');
            // const path = location?.pathname;
            // const paramsString = path.split('/').pop(); // Extracts the last part of the path
            // const searchParam = new URLSearchParams(paramsString);
            // const name = searchParam.get('name') ?? '';
            // const building = searchParam.get('building') ?? '';
            // const floor = searchParam.get('floor') ?? '';
            // const customer = searchParam.get('customer') ?? '';
            // const { zoneId = '' } = location.state ?? {};
            // setZoneId(zoneId ?? '');
            // setLocationDetails({ name, building, floor, customer, zoneId });
            // // console.log('Location', location.state);
        },
        [location]
    );
    // useEffect(
    //     function intialFunctionCalls() {
    //         if (zoneId) getTotalCounts(zoneId);
    //     },
    //     [zoneId, getTotalCounts]
    // );
    return (
        <>
            <PageHeading title={`Feedback Analytics`} />
            <Row style={{ marginLeft: '10px', marginRight: '5px' }}>
                {/* {' '}
                <Col lg={4}>
                    <TitleWidget
                        title={'Total Feedback'}
                        value={3}
                        icon={'https://res.cloudinary.com/dlulq6hny/image/upload/v1742897777/feedback_1_lvskdj.png'}
                    />
                </Col> */}
            </Row>
            <Row className="mb-1">
                {' '}
                <p className="mb-0 mx-3 fst-italic text-wrap">
                    {
                        'Clairco' +
                            ' ' +
                            '/' +
                            ' ' +
                            'Building' +
                            // locationDetails?.building +
                            '/' +
                            ' ' +
                            'Floor' + // ?locationDetails?.floor +
                            '/' +
                            ' ' +
                            'Feedback'
                        // locationDetails?.name
                    }
                </p>
            </Row>
            <Row className="" style={{ marginLeft: '10px', marginRight: '5px' }}>
                <Col xs={12} lg={4}>
                    <TitleWidget
                        // unit={'%'}
                        title={'Positive Sentiments'}
                        value={nps ?? 0}
                        icon={'https://res.cloudinary.com/dlulq6hny/image/upload/v1743146966/like_1_piks7u.png'}
                    />
                    <PiChartComponent
                        isLoading={isLoading}
                        zoneId={zoneId}
                        title={'Feedback Breakdown by Percentage'}
                        color={colorsTrends}
                        data={pieChartData}
                    />
                </Col>
                <Col xs={12} lg={8} className="chart-container ">
                    <TrendsWrapper zoneId={zoneId} />
                </Col>
            </Row>
            <Row className="mb-5 mx-3">
                <FeedbackTable zoneId={zoneId} />
            </Row>
        </>
    );
};

export default Feedback;
