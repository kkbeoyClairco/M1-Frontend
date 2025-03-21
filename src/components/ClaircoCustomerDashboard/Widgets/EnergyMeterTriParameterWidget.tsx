import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

type EnergyMeterTriParameterWidgetType = {
    title: string;
    value?: string;
    multiParamsArray?: Array<{
        value: number | string;
        name: string;
    }>;
    unit: string;
    updatedTime: string;
};
export const EnergyMeterTriParameterWidget: React.FC<EnergyMeterTriParameterWidgetType> = ({}) => {
    return (
        <Card style={{ width: '100%', height: '12em' }}>
            {/* //Set min width */}
            <Card.Body style={{ padding: '0' }}>
                <Row>
                    <Col xs={8}>
                        <h3>
                            {
                                'valueaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                            }{' '}
                            {'unit'}
                        </h3>
                    </Col>
                    <Col xs={2}>{'hello'}</Col>
                </Row>
            </Card.Body>
        </Card>
    );
};
