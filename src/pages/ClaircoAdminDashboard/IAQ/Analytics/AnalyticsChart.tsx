import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
// import StackedBarChart from './Stacked BarChart';
// import StepLineChart from './StepLineChart';
// import { createDataForStacked, createDataForStacked2, extractDates, extractParameters } from './utils';
// import { dataLevels, percentages } from './fakeData';
// import { times } from 'lodash';
// import { convertUnixToIST } from 'utils/timeFunctions';
import LevelChartsWrapper from './LevelChartsWrapper';
import PercentageTrendsWrapper from './PercentageTrendsWrapper';

const graphOptions = {
    Trends: 'Trends',
    Levels: 'Levels',
};
const AnalyticsCharts = ({ sensorName }: any) => {
    const [graphState, setGraphState] = useState<string>(graphOptions.Trends);
    const changeGraphState = (newGraphState: string) => {
        setGraphState(newGraphState);
    };

    return (
        <Card>
            <Card.Body>
                <Row>
                    {' '}
                    <div className="ChartHeading" style={{ width: '200px' }}>
                        <h4 className="header-title">Analytics </h4>
                    </div>
                </Row>
                <Row style={{ justifyContent: 'end' }}>
                    <Col lg={3} xs={12} style={{ justifyContent: 'end' }}>
                        <ButtonGroup className="w-100 mb-2">
                            {(Object.keys(graphOptions) as Array<keyof typeof graphOptions>).map((option) => {
                                return (
                                    <Button // disabled={key !== 'a'}
                                        // variant="primary"
                                        // className="btn btn-outline-info"
                                        key={option}
                                        //  active={graphState === option}
                                        onClick={() => changeGraphState(option)}
                                        style={{
                                            background: graphState === graphOptions[option] ? '#00695C' : '#008675',
                                            border: '0px',
                                        }}>
                                        {graphOptions[option]}
                                    </Button>
                                );
                            })}
                        </ButtonGroup>{' '}
                    </Col>
                </Row>
                <Row className=" d-flex justify-content-end">
                    <div className="ChartHeading d-flex justify-content-end" style={{}}>
                        {graphState === graphOptions.Trends && (
                            <h6> * Daywise Distribution of Air Quality & Comfort Levels (%)</h6>
                        )}{' '}
                        {graphState === graphOptions.Levels && <h6> * Severity Level Transitions Over Time</h6>}
                    </div>
                </Row>
                {graphState === graphOptions.Trends && <PercentageTrendsWrapper sensorName={sensorName} />}{' '}
                {graphState === graphOptions.Levels && <LevelChartsWrapper sensorName={sensorName} />}
            </Card.Body>
        </Card>
    );
};

export default AnalyticsCharts;
