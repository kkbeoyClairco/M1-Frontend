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
import HorizontalButtonGroup1 from 'components/ClaircoButtons/HorizontalButtonGroup1';

const graphOptions = {
    Trends: 'Trends',
    Levels: 'Levels',
};
const AnalyticsCharts = ({ sensorName }: any) => {
    const [graphState, setGraphState] = useState<string>(graphOptions.Trends);
    const changeGraphState = (newGraphState?: string | number) => {
        if (newGraphState) setGraphState(String(newGraphState));
    };

    return (
        <Card style={{ color: 'black' }}>
            <Card.Body>
                <Row>
                    {' '}
                    <div className="ChartHeading" style={{ width: '200px' }}>
                        <h4 className="header-title">Analytics </h4>
                    </div>
                </Row>
                <Row style={{ justifyContent: 'end' }}>
                    <Col lg={3} xs={12} style={{ justifyContent: 'end' }}>
                        <HorizontalButtonGroup1
                            choices={Object.keys(graphOptions)}
                            currentState={graphState}
                            onSelectFn={changeGraphState}
                        />
                        {/* <ButtonGroup className="w-100 mb-2">
                            {(Object.keys(graphOptions) as Array<keyof typeof graphOptions>).map((option) => {
                                const isActive = graphState === graphOptions[option];

                                return (
                                    <Button
                                        active={isActive}
                                        key={option}
                                        //  active={graphState === option}
                                        onClick={() => changeGraphState(option)}
                                        style={{
                                            background: isActive ? '#00695C' : '#008675',
                                            color: '#fff',

                                            // borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: isActive ? '2px solid #008675' : '1px solid #eee', // colored border
                                            fontWeight: isActive ? 'bold' : 500,
                                            boxShadow: isActive ? '0 2px 8px rgba(0,105,92,0.08)' : 'none',
                                            outline: 'none',
                                            marginRight: 0,
                                            transition: 'background 0.2s, border 0.2s',
                                        }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background = isActive
                                                ? '#00564d'
                                                : '#009688';
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background = isActive
                                                ? '#00695C'
                                                : '#008675';
                                        }}>
                                        {graphOptions[option]}
                                    </Button>
                                );
                            })}
                        </ButtonGroup>{' '} */}
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
