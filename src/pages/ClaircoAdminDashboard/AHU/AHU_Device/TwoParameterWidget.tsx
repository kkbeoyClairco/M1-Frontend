import classNames from 'classnames';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

export const TwoParameterWidget = ({ deltaT, temp1, temp2, dpt }: any) => {
    return (
        <Card className={classNames('widget-flat')} style={{ height: '160px' }}>
            <Card.Body className="dashboard-widget">
                <div className="float-end"></div>
                <Row>
                    <Col xs={6} sm={6} style={{ paddingLeft: '0pxs' }}>
                        {' '}
                        <h5
                            className={classNames('mt-0', 'header-title', 'text-muted')}
                            title={'description'}
                            style={{ height: '20px', alignItems: 'baseline' }}>
                            {'ΔT'}
                        </h5>{' '}
                    </Col>{' '}
                    <Col
                        xs={6}
                        sm={6}
                        className="ml-auto"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            // background: ' #a0faee',
                            // height: '35px',
                            // width: '35px',
                            // color: '#008675',
                            borderRadius: '5px',
                        }}>
                        <h5
                            className={classNames('mt-0', 'header-title', 'text-muted')}
                            title={'description'}
                            style={{ height: '20px', alignItems: 'baseline' }}>
                            DPT
                        </h5>
                    </Col>{' '}
                </Row>
                <Row>
                    {' '}
                    <Col xs={6}>
                        {' '}
                        <h3 className={classNames('mt-2', 'mb-1')}>
                            <span className="page-title">
                                <p>{deltaT === 0 ? 0 : deltaT ? deltaT + ' °C' : 'N/A'} </p>
                            </span>
                            {/* )} */}
                        </h3>{' '}
                        T1 : {temp1} °C
                        <br />
                        T2 : {temp2} °C
                    </Col>
                    <Col xs={6}>
                        {' '}
                        <h3 className={classNames('mt-2', 'mb-1')}>
                            <span className="page-title">
                                <p>{dpt === 0 ? 0 : dpt ? dpt + 'Pa' : 'N/A'} </p>
                            </span>
                            {/* )} */}
                        </h3>{' '}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};
