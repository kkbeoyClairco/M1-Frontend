import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import classNames from 'classnames';

type StatisticsChartWidget3Props = {
    title?: string;
    stats?: string;
    lastMonthData?: string;
    currentMonthData?: string;
    type?: 'line' | 'bar';
    colors?: Array<string>;
    name?: string;
    strokeWidth?: number;
    borderRadius?: number;
    data?: Array<number>;
};


const StatisticsChartWidget3 = ({
    title,
    stats,
    lastMonthData,
    currentMonthData,
    type,
    colors,
    name,
    strokeWidth,
    borderRadius,
    data,
}: StatisticsChartWidget3Props) => {
    const options: ApexOptions = {
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            width: strokeWidth,
            curve: 'smooth',
        },
        plotOptions: {
            bar: {
                borderRadius: borderRadius,
            },
        },
        colors: colors || ['#008FFB'],
    };

    const series = [{ name: name || 'Data', data: data || [] }];

    return (
        <Card className="widget-flat">
            <Card.Body>
                <div className="float-end">
                    <button type="button" className="btn btn-sm btn-light">
                        View
                    </button>
                </div>
                   <h6
                      className="text-muted text-uppercase mt-0"
                      title="Revenue"
                      style={{ fontSize: '11px' }} 
                        >
                    {title}
                    </h6>

                <h3 className="mb-4 mt-2">{stats}<span style={{ fontSize: "14px", fontWeight: "normal" }}>(RealTime)</span>
</h3>

                <Chart
                    className="apex-charts mb-3"
                    options={options}
                    series={series}
                    type={type || 'bar'}
                    height={100}
                />

                <Row className="text-center">
                    <Col>
                        <h6 className="text-truncate d-block">Last Month</h6>
                        <p
                            className={classNames(
                                'font-18',
                                'mb-0',
                                { 'text-success': lastMonthData?.startsWith('+') },
                                { 'text-danger': lastMonthData?.startsWith('-') }
                            )}
                        >
                            {lastMonthData}
                        </p>
                    </Col>
                    <Col>
                        <h6 className="text-truncate d-block">Current Month</h6>
                        <p
                            className={classNames(
                                'font-18',
                                'mb-0',
                                { 'text-danger': currentMonthData?.startsWith('-') },
                                { 'text-success': currentMonthData?.startsWith('+') }
                            )}
                        >
                            {currentMonthData}
                        </p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default StatisticsChartWidget3;
