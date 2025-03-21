import React from 'react';
import LastUpdated from '../General/LastUpdated/LastUpdated';
import { last } from 'lodash';
import { Card, Col, Row } from 'react-bootstrap';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';

type PlainWidgetType = {
    title1?: string;
    title2?: string;

    value1?: string | number;
    value2?: string | number;
    unit1?: string;
    unit2?: string;

    lastUpdated?: string;
    func1?: () => void;
    func2?: () => void;
};
const PlainWidgetWithTwoParameters1 = ({
    title1,
    value1,
    title2,
    value2,
    unit1,
    unit2,
    lastUpdated,
    func1,
    func2,
}: PlainWidgetType) => {
    const handleNavOneClick = async () => {
        try {
            if (func1) func1();
        } catch (error) {
            console.log(error);
        }
    };
    const handleNavTwoClick = async () => {
        try {
            if (func2) func2();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Card style={{ height: '12em' }}>
            <Card.Body>
                <Row>
                    {' '}
                    <Col xs={6}>
                        <div style={{ display: 'flex' }}>
                            <h6 style={{ marginBottom: '3px' }}> {title1}</h6>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: '5px',
                                }}>
                                {' '}
                                <div onClick={handleNavOneClick}>{func1 && <Navigator />}</div>
                            </div>
                        </div>
                        {/* <h6 style={{ marginTop: '0px' }}>BTU Unit 4</h6> */}
                        <div style={{ display: 'flex' }}>
                            {' '}
                            <h4 style={{ padding: '0px', marginTop: '25px', marginBottom: '20px' }}>
                                {value1 === undefined || value1 === null || isNaN(Number(value1)) ? 'Na' : value1}{' '}
                                &nbsp;
                            </h4>
                            <h4 style={{ padding: '0px', marginTop: '25px', marginBottom: '20px' }}>{unit1}</h4>
                        </div>
                    </Col>{' '}
                    <Col xs={6}>
                        {' '}
                        <div style={{ display: 'flex', width: 'fit' }}>
                            <h6 style={{ marginBottom: '3px', textOverflow: 'clip' }}> {title2}</h6>{' '}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: '5px',
                                }}>
                                {' '}
                                <div onClick={handleNavTwoClick}>{func2 && <Navigator />} </div>
                            </div>
                        </div>
                        {/* <h6 style={{ marginTop: '0px' }}>BTU Unit 4</h6> */}
                        <div style={{ display: 'flex' }}>
                            {' '}
                            <h4
                                style={{
                                    padding: '0px',
                                    marginTop: '25px',
                                    marginBottom: '20px',
                                    textOverflow: 'clip',
                                }}>
                                {value2 === undefined || value2 === null || isNaN(Number(value2)) ? 'Na' : value2}{' '}
                                &nbsp;
                            </h4>
                            <h4 style={{ padding: '0px', marginTop: '25px', marginBottom: '20px' }}>{unit2}</h4>
                        </div>
                    </Col>{' '}
                </Row>
                <div style={{ alignItems: 'baseline', marginTop: '20px' }}>
                    <LastUpdated lastUpdated={lastUpdated} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlainWidgetWithTwoParameters1;
