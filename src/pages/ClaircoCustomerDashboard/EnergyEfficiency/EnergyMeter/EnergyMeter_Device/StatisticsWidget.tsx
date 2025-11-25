import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type StatisticsWidgetProps = {
    textClass?: string;
    bgClass?: string;
    icon?: string;
    title?: React.ReactNode;
    value: number[];
    lastUpdated?: string;
    unit?: string;
    description?: string;
    stats?: string;
    trend: {
        textClass?: string;
        icon?: string;
        value?: string;
        time?: string;
    };
};

const StatisticsWidget = ({
    textClass,
    bgClass,
    icon,
    title,
    stats,
    trend,
    description,
    unit,
    lastUpdated,
    value,
}: StatisticsWidgetProps) => {
    return (
        <Card className={classNames('widget-flat', bgClass)} style={{ height: '168px' }}>
            <Card.Body className="dashboard-widget">
                <div className="float-end"></div>
                <Row
                    style={
                        {
                            //  display: 'flex', justifyContent: ' space-around'
                        }
                    }>
                    <Col xs={10}>
                        {' '}
                        <h5
                            className={classNames('mt-0', 'header-title', textClass ? textClass : 'text-muted')}
                            title={description}
                            style={{ height: '33px' }}>
                            {title}
                        </h5>{' '}
                    </Col>{' '}
                    <Col
                        xs={2}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            background: ' #a0faee',
                            height: '30px',
                            width: '30px',
                            color: '#008675',
                        }}>
                        <h6>{unit}</h6>
                    </Col>{' '}
                </Row>
                <h3 className={classNames('mt-3', 'mb-1', textClass ? textClass : null)}>
                    {' '}
                    {value?.length > 1 ? (
                        <span className="page-title" style={{ display: 'flex', fontSize: '20px' }}>
                            <p style={{ fontWeight: 'normal' }}>R: </p>{' '}
                            <p> &nbsp;{Math.round(value[0] * 100) / 100 ? Math.round(value[0] * 100) / 100 : '-'}</p>{' '}
                            &nbsp; &nbsp; <p style={{ fontWeight: 'normal' }}> Y: </p>
                            &nbsp;{Math.round(value[1] * 100) / 100 ? Math.round(value[1] * 100) / 100 : '-'} &nbsp;
                            &nbsp;
                            <p style={{ fontWeight: 'normal' }}> B:</p>
                            &nbsp;
                            {Math.round(value[2] * 100) / 100 ? Math.round(value[2] * 100) / 100 : '-'}
                        </span>
                    ) : (
                        <span className="page-title">
                            <p>{Math.round(value[0] * 100) / 100 || '-'}</p>
                        </span>
                    )}
                </h3>{' '}
                {trend && (
                    // <p className={classNames('mb-0', textClass ? textClass : 'text-muted')}>
                    //     <span className={classNames(trend.textClass, 'me-2')}>
                    //         {/* <i className={classNames(trend.icon)}></i> {trend.value} */}

                    //     </span>
                    //     {/* <span className="text-nowrap">{trend.time}</span> */}
                    // </p>
                    <p style={{ fontSize: '11px' }}> Updated on {lastUpdated}</p>
                )}
            </Card.Body>
        </Card>
    );
};

export default StatisticsWidget;
