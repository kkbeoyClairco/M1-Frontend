import React from 'react';
import { Card, Row } from 'react-bootstrap';

interface TitleWidgetInterface {
    title?: string;
    value?: string | number;
    icon?: string;
    onClickFn?: () => void;
}
export const TitleWidget: React.FC<TitleWidgetInterface> = ({ title, value, icon }) => {
    return (
        <Card className="shadow-lg rounded-lg" style={{ height: '8em' }}>
            <Card.Body>
                <Row>
                    <p className="font-weight-normal text-capitalize">{title}</p>
                </Row>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    {' '}
                    <Row>
                        <h2>{value ? value : '-'}</h2>
                    </Row>
                    {/* {true&& } */}
                    <img src={icon} alt="" height={'40em'} />
                </div>
            </Card.Body>
        </Card>
    );
};
