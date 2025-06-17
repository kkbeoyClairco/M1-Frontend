import { InformationIcon } from 'components/ClaricoIcons/InformationIcon';
import { info } from 'console';
import React, { ImgHTMLAttributes } from 'react';
import { Card, Row } from 'react-bootstrap';
import LastUpdated from '../General/LastUpdated/LastUpdated';

interface InteractiveBackgroundWidgetProps {
    name: string;
    value?: number | string;
    unit: string;
    lastUpdated: string;
    icon?: string;
    infoClickName?: string;
    infoClickFn?: (e: React.MouseEvent<HTMLDivElement>, state: string) => void;
}

const InteractiveBackgroundWidgetB: React.FC<InteractiveBackgroundWidgetProps> = ({
    name,
    value,
    unit,
    lastUpdated,
    icon,
    infoClickFn,
    infoClickName,
}) => {
    return (
        <Card
            style={{
                width: '100%',
                height: '100%',
                maxHeight: '23.5em',
                margin: '0px',
                minHeight: '10em',
                flexGrow: '1',
            }}>
            {/* style={{ height: '417px' }} */}
            <Card.Body style={{ padding: '0' }}>
                <div
                    className="h-25"
                    style={{ display: 'flex', padding: '0px', justifyContent: 'center', alignItems: 'start' }}>
                    <h5 style={{ padding: '10px', paddingLeft: '15px' }}>{name}</h5>{' '}
                    {infoClickFn && (
                        <div
                            // className="mt-2"
                            style={{ display: 'flex', alignItems: 'center', marginTop: '18px' }}
                            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                                infoClickFn && infoClickFn(e, infoClickName ? infoClickName : '')
                            }>
                            {' '}
                            <InformationIcon />
                        </div>
                    )}
                </div>
                <div
                    className="h-50"
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '20px',
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                        }}>
                        <h3>
                            {value && typeof value !== 'string' && !isNaN(Number(value)) ? value + ' ' + unit : 'Na'}
                        </h3>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '80%',
                            width: '100%',
                            paddingBottom: '30px',
                        }}>
                        <img src={icon} alt="" height={'80%'} />
                    </div>
                </div>{' '}
                <div
                    className="h-25 flex justify-content-center align-items-end"
                    style={{
                        display: 'flex',
                    }}>
                    <LastUpdated lastUpdated={lastUpdated} />

                    {/* <h6 style={{ fontSize: '10px', fontWeight: '600' }}>Updated on {lastUpdated} </h6> */}
                </div>
            </Card.Body>
        </Card>
    );
};

export default InteractiveBackgroundWidgetB;
