import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container-fluid">
                <Row>
                    <h6 style={{ display: 'flex', justifyContent: 'center' }}>
                        {currentYear}(c) 2021 ALIFEROUS TECHNOLOGIES PVT LTD | CLAIRCO.IN | ALL RIGHTS RESERVED
                    </h6>
                    <div className="text-md-end footer-links d-none d-md-block">
                        {/* <Link to="#">About</Link>
                        <Link to="#">Support</Link>
                        <Link to="#">Contact Us</Link> */}
                    </div>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
