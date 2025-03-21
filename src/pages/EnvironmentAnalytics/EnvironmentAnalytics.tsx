import { Card, Col, Container, Row } from 'react-bootstrap';
import Statistics from './Statistics';
import NavigationMenu from './NavigationMenu';
import TrendsChart from './TrendsChart';
import Monitoring from './Monitoring';
import Alerts from './Alerts';

const EnvironmentAnalytics = () => {
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <div className="page-title-box">
                            <div className="page-title-right"></div>
                            <h4 className="page-title">Environment Analytics</h4>
                        </div>
                    </Col>
                </Row>
                <Statistics />
                <Row>
                    <Col lg={8}>
                        <Row>
                            <Card>
                                <Card.Body>
                                    <h4 className="header-title"> Environment Monitoring NAVIGATION</h4>
                                    <NavigationMenu />
                                </Card.Body>
                            </Card>
                        </Row>

                        <Row>
                            <TrendsChart />
                        </Row>

                        <Row>
                            <Monitoring />
                        </Row>
                    </Col>
                    <Col>
                        <Alerts />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export { EnvironmentAnalytics };
