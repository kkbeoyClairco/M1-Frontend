import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logosensiable from '../../assets/images/Logo-sensiable.svg';
import Clairco_Logo from '../../assets/images/Clairco_Logo_rezised.png';
import loginRight from '../../assets/images/loginrightpic1.jpg';
import { useAccountLayout } from './hooks';

type AccountLayoutProps = {
    bottomLinks?: React.ReactNode;
    children?: React.ReactNode;
};

const AccountLayout2 = ({ bottomLinks, children }: AccountLayoutProps) => {
    useAccountLayout();
    const { t } = useTranslation();

    return (
        <div className="auth-fluid">
            {/* Auth fluid left content */}
            <div className="auth-fluid-form-box">
                <div className="align-items-center d-flex h-100">
                    <Card.Body>
                        {/* logo */}
                        <div className="auth-brand text-center  text-lg-start mx-5 mb-5">
                            {/* <Link to="/" className="logo-sensiable"> */}
                            <span>
                                <img src={Clairco_Logo} alt="logo" height="120" />
                            </span>
                            {/* </Link> */}
                        </div>

                        {children}

                        {/* footer links */}
                        {bottomLinks}
                    </Card.Body>
                </div>
            </div>
            {/* Auth fluid Right content */}
            <div className="auth-fluid-right">
                <img src={loginRight} alt="" loading="lazy" />
            </div>
        </div>
    );
};

export default AccountLayout2;
