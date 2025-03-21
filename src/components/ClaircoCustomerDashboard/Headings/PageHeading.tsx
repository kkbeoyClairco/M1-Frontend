import React from 'react';
import { Col, Row } from 'react-bootstrap';

type PageHeadingProps = {
    title?: string;
};
const PageHeading = ({ title }: PageHeadingProps) => {
    return (
        <Row style={{ marginLeft: '1em' }}>
            <Col xs={12}>
                <div className="page-title-box">
                    <div className="page-title-right"></div>
                    <h4 className="page-title">{title}</h4>
                </div>
            </Col>
        </Row>
    );
};

export default PageHeading;
