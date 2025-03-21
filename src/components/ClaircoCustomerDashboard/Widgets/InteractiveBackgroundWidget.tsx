import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
import { info } from 'console';
import React, { ImgHTMLAttributes } from 'react';
import { Card, Row } from 'react-bootstrap';

interface InteractiveBackgroundWidgetProps {
    name: string;
    value: number | string;
    unit: string;
    lastUpdated: string;
    icon?: string;
    infoClickName?: string;
    infoClickFn?: (e: React.MouseEvent<HTMLDivElement>, state: string) => void;
}

const InteractiveBackgroundWidget: React.FC<InteractiveBackgroundWidgetProps> = ({
    name,
    value,
    unit,
    lastUpdated,
    icon,
    infoClickFn,
    infoClickName,
}) => {
    return (
        <Card style={{ width: '100%', height: '12em' }}>
            {/* style={{ height: '417px' }} */}
            <Card.Body style={{ padding: '0' }}>
                <div style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'center' }}>
                    <h5 style={{ padding: '10px', paddingLeft: '15px' }}>{name}</h5>{' '}
                    {infoClickFn && (
                        <div
                            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                                infoClickFn && infoClickFn(e, infoClickName ? infoClickName : '')
                            }>
                            {' '}
                            <InformationIcon />
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', height: '30%', width: '100%' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // background: 'red',
                            height: '100%',
                            width: '100%',
                            // marginBottom: '35px',
                        }}>
                        <h3>
                            {value} {unit}
                        </h3>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // height: '100%',
                            width: '100%',
                            paddingBottom: '30px',
                        }}>
                        <img src={icon} alt="" height={'90%'} />
                    </div>
                </div>{' '}
                <div
                    style={{
                        // width: '180px',
                        // paddingTop: '10px',
                        // fontSize: '12px',
                        // textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <h6 style={{ fontSize: '10px', fontWeight: '600' }}>Updated on {lastUpdated} </h6>
                </div>
            </Card.Body>
        </Card>
    );
};

export default InteractiveBackgroundWidget;
