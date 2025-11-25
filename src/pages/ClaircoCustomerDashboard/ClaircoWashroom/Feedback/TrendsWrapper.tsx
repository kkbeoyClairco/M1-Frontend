import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { HyperDatepicker } from 'components';
import StackedBarChart from './Stacked BarChart';
// import { getFeedbackWithDate } from 'helpers/api/services/Clairco/customerSide/feedback';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertDateToEpoch } from 'utils/timeFunctions';
import { testRes } from './test';
import { feedbackInsightsData } from 'appConstants/feedbackData';
// import { start } from 'repl';
const trendsTypes = ['Date Picker', 'Aggregated'];
const timeFrameOptions = [1, 6, 12, 24];
interface TrendsWrapperPropType {
    zoneId: string;
}
function TrendsWrapper({ zoneId }: TrendsWrapperPropType): JSX.Element {
    const [trendsData, setTrendsData] = useState<number[][]>([
        // [100, 302, 301, 334, 390, 330, 320],
        // [320, 132, 101, 134, 90, 230, 210],
        // [220, 182, 191, 234, 290, 330, 310],
        // [150, 212, 201, 154, 190, 330, 410],
        // [820, 832, 901, 934, 1290, 1330, 1320],
    ]);
    const [xAxis, setXAxis] = useState<string[]>([]);
    const [selectedTrendsType, setSelectedTrendsType] = useState<string>(trendsTypes[0]);
    // const [selectedTimeFrame, setSelectedTimeFrame] = useState<number | string>(timeFrameOptions[0]);
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const colorsTrends = function (params: { name: 'Poor' | 'Very Poor' | 'Satisfactory' | 'Good' | 'Excellent' }) {
    //     const colors: { [key in typeof params.name]: string } = {
    //         'Very Poor': '#e74c3c ',
    //         Poor: '#f39c12',
    //         Satisfactory: '#E7E75F',
    //         Good: '#129F17',
    //         Excellent: '#59e759',
    //     };
    //     return colors[params.name];
    // };
    // const fetchAggregateData = useCallback(async () => {
    //     try {
    //         // const res=
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, []);
    function transformFeedbackData(data: any, feedbackMap: any) {
        // Initialize the output array with one row per feedback type, filled with zeros
        const feedbackData = Array(feedbackMap.length)
            .fill(0)
            .map(() => Array(data.length).fill(0));

        for (let i = 0; i < data.length; i++) {
            const dayData = data[i]; // Get data for the day

            for (const feedback of dayData.feedbacks) {
                const feedbackIndex = feedbackMap.indexOf(feedback._id); // Find the index of the feedback type
                if (feedbackIndex !== -1) {
                    feedbackData[feedbackIndex][i] = feedback.count; // Place count in the corresponding row and column
                }
            }
        }

        return feedbackData;
    }

    const handleDatePickSubmission = useCallback(async () => {
        try {
            // if (!zoneId) return;
            setIsLoading(true);
            const start = startDate.toISOString().split('T')[0];
            const end = endDate.toISOString().split('T')[0];

            const res = { data: feedbackInsightsData };
            // await getFeedbackWithDate(start.toString(), end.toString(), zoneId);
            const feedbackArray = res?.data;
            // const data = testRes;
            const feedbackMap = ['Excellent', 'Good', 'Satisfactory', 'Poor', 'Very Poor'];
            const feebackDates = feedbackArray.map((item: any) => item._id);
            const feedbackData = transformFeedbackData(feedbackArray, feedbackMap);
            setXAxis(feebackDates ?? []);
            setTrendsData(feedbackData ?? []);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [endDate, startDate, zoneId]);
    // const handleTrendsTypeSelection = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //     try {
    //         const selectedType = (e.currentTarget as HTMLButtonElement).getAttribute('data-value');
    //         // console.log(();
    //         if (selectedType) setSelectedTrendsType(selectedType);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleTimeFrameSelection = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //     try {
    //         const selectedTimeFrame = (e.currentTarget as HTMLButtonElement).getAttribute('data-value');
    //         if (selectedTimeFrame) setSelectedTimeFrame(Number(selectedTimeFrame));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(
        function initialAPICall() {
            handleDatePickSubmission();
        },
        [handleDatePickSubmission, zoneId]
    );

    return (
        <Card>
            <Card.Header>
                <span className="text-center">
                    <h5>Feedback Insights: Response Counts </h5>
                </span>
            </Card.Header>
            <Card.Body>
                {' '}
                {/* Trends Type Selection */}
                {/* <Row className="d-flex justify-content-end">
                    <Col xs={6} className="d-flex justify-content-end">
                        {trendsTypes.map((item: any) => {
                            return (
                                <button
                                    type="button"
                                    className="btn mx-0  "
                                    style={{
                                        background: selectedTrendsType === item ? '#00695C' : '#008675',
                                        borderRadius: '0px',
                                        color: selectedTrendsType === item ? '#FFFFFF' : '#000000',
                                    }}
                                    data-value={item}
                                    onClick={handleTrendsTypeSelection}>
                                    {item}
                                </button>
                            );
                        })}
                    </Col>
                </Row> */}
                <Row className="d-flex justify-content-end mt-2">
                    {' '}
                    {selectedTrendsType === trendsTypes[0] && (
                        <Col xs={12} className="d-flex flex-row flex-lg-row align-items-center p-2">
                            <label style={{ padding: '10px' }} htmlFor="">
                                From
                            </label>
                            <HyperDatepicker
                                value={startDate}
                                inputClass="form-control-light"
                                onChange={(date: any) => {
                                    setStartDate(date);
                                }}
                            />
                            <label htmlFor="" style={{ padding: '10px', marginLeft: '50px' }}>
                                To
                            </label>
                            <HyperDatepicker
                                value={endDate}
                                inputClass="form-control-light"
                                onChange={(date: any) => {
                                    setEndDate(date);
                                }}
                            />{' '}
                            <Button
                                className="ms-md-3 mt-2 mt-md-0"
                                style={{
                                    // margin: '20px',
                                    // marginTop: '10px',
                                    background: '#008675',
                                    // borderWidth: '0px',
                                }}
                                onClick={handleDatePickSubmission}>
                                Submit
                            </Button>
                        </Col>
                    )}
                    {/* Aggregate Time Frame selection */}
                    {/* {selectedTrendsType === trendsTypes[1] && (
                        <Col xs={6} className="d-flex justify-content-end mt-2 mb-2">
                            {timeFrameOptions.map((item: any) => {
                                return (
                                    <button
                                        type="button"
                                        className="btn mx-0  "
                                        style={{
                                            background: selectedTimeFrame === item ? '#00695C' : '#008675',
                                            borderRadius: '0px',
                                            color: selectedTimeFrame === item ? '#FFFFFF' : '#000000',
                                        }}
                                        data-value={item}
                                        onClick={handleTimeFrameSelection}>
                                        {item}
                                    </button>
                                );
                            })}
                        </Col>
                    )} */}
                </Row>
                <Row className="mt-2">
                    {!isLoading ? (
                        <StackedBarChart
                            parameters={['Excellent', 'Good', 'Satisfactory', 'Poor', 'Very Poor']}
                            xAxisData={xAxis ?? []}
                            data={trendsData}
                            colors={['#59e759', '#129F17', '#E7E75F', '#f39c12', '#e74c3c']}
                        />
                    ) : (
                        <>
                            <TableSkelton />
                            <TableSkelton />
                            <TableSkelton />
                            <TableSkelton />
                        </>
                    )}
                    {/* <BarChart colors={colorsTrends} data={trendsData} /> */}
                </Row>
            </Card.Body>
        </Card>
    );
}

export default TrendsWrapper;
