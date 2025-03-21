import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HyperDatepicker } from 'components';
import { useDatePicker } from 'hooks';
import SensorStatistics from './SensorStatistics';
import SensorChart from './SensorChart';
import SiteTable from './SiteTable';

const SensorAnalytics = () => {
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <div className="page-title-right"></div>
                        <h4 className="page-title">Sensor Analytics</h4>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={5} lg={6}>
                    <SensorStatistics />
                </Col>

                <Col xl={7} lg={6}>
                    {/* <SensorChart /> */}
                    <SensorChart />
                </Col>
            </Row>

            <Row>
                <SiteTable />
            </Row>
        </>
    );
};

export { SensorAnalytics };
