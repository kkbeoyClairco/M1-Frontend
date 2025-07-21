import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import AccountLayout from './AccountLayout';
import logoutIcon from 'assets/images/logout-icon.svg';
import { useLogout } from './hooks';
import { useEffect } from 'react';

const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to ')}{' '}
                    <Link to={'/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Logout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    useLogout();
    useEffect(() => {
        const timerId = setTimeout(() => {
            navigate('/login');
        }, 4000);
        return () => clearTimeout(timerId);
    }, []);
    return (
        <AccountLayout bottomLinks={<BottomLink />}>
            <div className="text-center w-75 m-auto">
                <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('See you next time!')}</h4>
                <p className="text-muted mb-4">{t('You have successfully signed out.')}</p>

                <div className="logout-icon m-auto">{/* <img src={logoutIcon} alt="" /> */}</div>
            </div>
        </AccountLayout>
    );
};

export default Logout;
