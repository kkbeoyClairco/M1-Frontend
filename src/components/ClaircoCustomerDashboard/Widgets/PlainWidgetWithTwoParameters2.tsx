import React from 'react';
import LastUpdated from '../General/LastUpdated/LastUpdated';
import { last } from 'lodash';
import { Card, Col, Row } from 'react-bootstrap';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';
import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';

type PlainWidgetType = {
    name?: string;

    title1?: string;
    title2?: string;

    value1?: string | number;
    value2?: string | number;
    unit1?: string;
    unit2?: string;
    infoClickFn?: (e: React.MouseEvent<HTMLDivElement>, state: string) => void;

    lastUpdated?: string;
    func1?: () => void;
    func2?: () => void;
};
const PlainWidgetWithTwoParameters2 = ({
    name,
    title1,
    value1,
    title2,
    value2,
    unit1,
    unit2,
    lastUpdated,
    func1,
    func2,
    infoClickFn,
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
        <Card className="h-100" style={{ maxHeight: '23.5em' }}>
            <Card.Body className="pb-2">
                <Row className="h-25">
                    <div
                        className="h-25"
                        style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
                        {' '}
                        <h5 style={{ padding: '10px', paddingLeft: '15px' }}>{name}</h5>{' '}
                        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => infoClickFn && infoClickFn(e, 'PM')}>
                            <InformationIcon />
                        </div>
                    </div>{' '}
                </Row>

                <Row className="h-50 pt-1">
                    {' '}
                    <Col xs={6} className="">
                        <div className="pt-3 d-flex">
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
                        <div className="d-flex justify-content-start align-items-center ">
                            <h3>
                                {!value1 || value1 === undefined || value1 === null || Number.isNaN(value1)
                                    ? 'Na'
                                    : value1}
                            </h3>
                            {unit1 && value1 && !isNaN(Number(value1)) ? <h4> &nbsp;{unit1}</h4> : ''}{' '}
                        </div>
                    </Col>{' '}
                    <Col xs={6} className="">
                        {' '}
                        <div className="d-flex pt-3" style={{ display: 'flex', width: 'fit' }}>
                            <h6
                                style={{
                                    marginBottom: '3px',
                                    textOverflow: 'clip',
                                }}>
                                {' '}
                                {title2}
                            </h6>{' '}
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
                        <div className="d-flex justify-content-start align-items-center ">
                            {' '}
                            <h3
                                style={{
                                    // padding: '0px',
                                    // marginTop: '2em',
                                    // marginBottom: '20px',
                                    textOverflow: 'clip',
                                }}>
                                {!value2 || value2 === undefined || value2 === null || Number.isNaN(value2)
                                    ? 'Na'
                                    : value2}
                            </h3>
                            {unit2 && value2 && !isNaN(Number(value2)) ? <h4 style={{}}> &nbsp;{unit2}</h4> : null}
                        </div>
                    </Col>{' '}
                </Row>
                <div
                    className="h-25 align-items-end"
                    style={{ display: 'flex', alignItems: 'baseline', marginTop: '1em', justifyContent: 'center' }}>
                    <LastUpdated lastUpdated={lastUpdated} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlainWidgetWithTwoParameters2;
