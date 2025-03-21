import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from 'assets/images/Clairco_Logo.png';
import { useAccountLayout } from './hooks';

type AccountLayoutProps = {
    bottomLinks?: React.ReactNode;
    children?: React.ReactNode;
};

const AccountLayout = ({ bottomLinks, children }: AccountLayoutProps) => {
    const { t } = useTranslation();

    // useAccountLayout();

    return (
        <>
            <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} xxl={4}>
                            <Card>
                                {/* logo */}
                                <Card.Body className="p-4 pb-0">{children}</Card.Body>

                                <Card.Header className="pt-0 pb-4 text-center bg-white">
                                    <Link to="/">
                                        <span>
                                            <img src={Logo} alt="" height="150" />
                                        </span>
                                    </Link>
                                </Card.Header>
                                {/* <Card.Body className="p-4">{children}</Card.Body> */}
                            </Card>

                            {/* bottom links */}
                            {bottomLinks}
                        </Col>
                    </Row>
                </Container>
            </div>
            <footer className="footer footer-alt">{t(` © Clairco `)}</footer>
        </>
    );
};

export default AccountLayout;
