import React from 'react';
import LastUpdated from '../General/LastUpdated/LastUpdated';
import { last } from 'lodash';
import { Col, Row } from 'react-bootstrap';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';

type PlainWidgetType = {
    title1?: string;
    title2?: string;

    value1?: string;
    value2?: string;
    unit1?: string;
    unit2?: string;

    lastUpdated?: string;
    func1?: () => void;
    func2?: () => void;
};
const PlainWidgetWithTwoParameters = ({
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
        <div
            className="widget-flat"
            style={{
                padding: '10px',
                paddingLeft: '15px',
                margin: '5px',
                height: '150px',
                width: '100%',
                display: 'inline-block',
                // color: 'black',
                // background: 'white',
                // borderWidth: '2px',
                boxShadow: 'inset 2px 2px 4px rgba(222, 224, 223, 0.2), inset -2px -2px 4px rgba(222, 224, 223, 0.5)',
                // textAlign: 'left',
                // lineHeight: '40px',
                borderRadius: '4px',
                background: 'white',
                color: '#6C757D',
                // backgroundImage: 'white',
            }}>
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
                            {value1 === undefined || value1 === null || Number.isNaN(value1) ? 'N/A' : value1}
                        </h4>
                        <h4 style={{ padding: '0px', marginTop: '25px', marginBottom: '20px' }}>
                            {value2 === undefined || value2 === null || value2 !== null || !isNaN(value2) ? '' : unit2}
                        </h4>
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
                        <h4 style={{ padding: '0px', marginTop: '25px', marginBottom: '20px', textOverflow: 'clip' }}>
                            {value2 === undefined || value2 === null || Number.isNaN(value2) ? 'N/A' : value2}
                        </h4>
                        <h4 style={{ padding: '0px', marginTop: '25px', marginBottom: '20px' }}>
                            {value2 === undefined || value2 === null || value2 !== null || !isNaN(value2) ? '' : unit2}
                        </h4>
                    </div>
                </Col>{' '}
            </Row>
            <div style={{ alignItems: 'baseline', marginTop: '20px' }}>
                <LastUpdated lastUpdated={lastUpdated} />
            </div>
        </div>
    );
};

export default PlainWidgetWithTwoParameters;
