import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface OccupancyWidgetType {
    title: string;
    lastUpdated?: string;
    icon?: IconProp;
    occupantsCount?: string | number;
}
const OccupancyWidget: React.FC<OccupancyWidgetType> = ({ title, lastUpdated, icon, occupantsCount }) => {
    return (
        <Card className={'shadow-lg rounded-lg mt-1 widget-flat'} style={{ height: '28em' }}>
            <Card.Body className="text-wrap">
                <h5 className={classNames('fw-normal', 'mt-0', 'text-truncate', 'text-muted')}>{title}</h5>
                <Row className="align-items-center">
                    <Row style={{ height: '16em', display: 'flex', alignContent: 'center', paddingTop: '20px' }}>
                        <h2 style={{ paddingTop: '0' }} className="my-2 py-1 text-wrap">
                            {occupantsCount ?? 'Na'}
                        </h2>
                        <p style={{ paddingTop: '0' }} className="my-2 py-1 text-wrap">
                            Data based on <br />
                            <p style={{ marginLeft: '20px' }}>{lastUpdated ? lastUpdated : 'Na'}</p>
                        </p>
                    </Row>

                    <Row className="d-flex justify-content-end h-40 mt-4">
                        <Col xs={3}>{icon ? <FontAwesomeIcon icon={icon} size="2x" /> : null}</Col>{' '}
                    </Row>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default OccupancyWidget;
