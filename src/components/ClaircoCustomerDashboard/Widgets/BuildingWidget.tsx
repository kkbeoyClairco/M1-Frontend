import React from 'react';
import { Card, Row } from 'react-bootstrap';

interface BuildingWidgetInterface {
    title?: string;
    value?: string | number;
    icon?: string;
    onClickFn?: () => void;
}
export const BuildingWidget: React.FC<BuildingWidgetInterface> = ({ title, value, icon }) => {
    return (
        <Card className="shadow-lg rounded-lg" style={{ height: '8em' }}>
            <Card.Body>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    {' '}
                    <Row>
                        <p className="fw-bold fs-5 text-capitalize" style={{ color: '#333333' }}>
                            {title}
                        </p>
                    </Row>
                    {/* {true&& } */}
                    <img src={icon} alt="" height={'40em'} />
                </div>

            </Card.Body>
        </Card>
    );
};
