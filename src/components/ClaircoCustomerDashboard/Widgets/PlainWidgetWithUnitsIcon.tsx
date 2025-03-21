import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type PlainWidgetWithUnitsIconProps = {
    textClass?: string;
    bgClass?: string;
    icon?: string;
    title?: React.ReactNode;
    value?: any;
    lastUpdated?: string;
    unit?: string;
    description?: string;
    stats?: string;
    extraParameters?: React.ReactNode;
};

const PlainWidgetWithUnitsIcon = ({
    textClass,
    bgClass,
    icon,
    title,
    stats,
    description,
    unit,
    lastUpdated,
    value,
    extraParameters,
}: PlainWidgetWithUnitsIconProps) => {
    return (
        <Card className={classNames('widget-flat', bgClass)} style={{ height: '160px' }}>
            <Card.Body className="dashboard-widget">
                <div className="float-end"></div>
                <Row>
                    <Col xs={10} sm={10} style={{ paddingLeft: '0pxs' }}>
                        {' '}
                        <h5
                            className={classNames('mt-0', 'header-title', textClass ? textClass : 'text-muted')}
                            title={description}
                            style={{ height: '20px', alignItems: 'baseline' }}>
                            {title}
                        </h5>{' '}
                    </Col>{' '}
                    <Col
                        xs={2}
                        sm={2}
                        className="ml-auto"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            background: ' #a0faee',
                            height: '35px',
                            width: '35px',
                            color: '#008675',
                            borderRadius: '5px',
                        }}>
                        <h6>{unit}</h6>
                    </Col>{' '}
                </Row>
                <h3 className={classNames('mt-2', 'mb-1', textClass ? textClass : null)}>
                    {' '}
                    {/* {value?.length > 1 ? ( */}{' '}
                    {/* <span className="page-title" style={{ display: 'flex', fontSize: '20px' }}>
                        // <p style={{ fontWeight: 'normal' }}>R: </p> //{' '}
                        <p> &nbsp;{value[0] === 0 ? 0 : value[0] ? value[0] : '-'}</p> &nbsp; &nbsp; //{' '}
                        <p style={{ fontWeight: 'normal' }}> Y: </p>
                        // &nbsp;{value[1] ? value[1] : '-'} &nbsp; &nbsp; //{' '}
                        <p style={{ fontWeight: 'normal' }}> B:</p>
                        // &nbsp; // {value[2] ? value[2] : '-'}
                        //{' '}
                    </span> */}
                    {/* ) : ( */}
                    <span className="page-title">
                        <p>{value[0] === 0 ? 0 : value[0] ? value[0] : 'N/A'}</p>
                    </span>
                    {/* )} */}
                </h3>{' '}
                {extraParameters && <p style={{ fontSize: '13px' }}> {extraParameters}</p>}
                {!extraParameters && <p style={{ fontSize: '11px' }}> Updated on {lastUpdated ?? 'N/A'}</p>}{' '}
            </Card.Body>
        </Card>
    );
};

export default PlainWidgetWithUnitsIcon;
