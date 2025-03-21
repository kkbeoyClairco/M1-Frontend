import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { AQIToolTip, Co2ToolTip, PMToolTip, VoCToolTip } from './subComponents/ToolTipComponenets';
export const IAQToolTip = ({ show, positionValues, toolTipData, currentState }: any) => {
    const [toolTipPosition, setToolTipPosition] = useState({});

    const getUnits = (state: string) => {
        try {
            if (state === 'AQI') return 'AQI';
            else if (state === 'CO2') return 'ppm';
            else if (state === 'PM') return 'µg/m³';
            else if (state === 'VOC') return 'ppm';
            else console.log('No state found');
            return '';
        } catch (error) {
            console.log(error);
        }
    };
    const getToolTipComponenet = (state: string) => {
        try {
            if (state === 'AQI') return <AQIToolTip />;
            else if (state === 'CO2') return <Co2ToolTip />;
            else if (state === 'PM') return <PMToolTip />;
            else if (state === 'VOC') return <VoCToolTip />;
            else console.log('No state found');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        // console.log('Tool tip data Changed:', toolTipData, positionValues);
        setToolTipPosition({
            left: `${positionValues?.xValue}px`,
            top: `${positionValues?.yValue}px`,
        });
    }, [positionValues]);
    useEffect(() => {
        // console.log('Tool tip data Changed:', show, positionValues);
    }, [show]);
    if (!positionValues) return console.log('No position values'), null;
    return (
        <div
            style={{
                width: 'max-content',
                height: 'max-content',
                minWidth: '300px',
                position: 'absolute',
                transitionDelay: '0s',
                color: '#333333',
                transitionProperty: 'all',
                transition: 'left 0s ease, top 0s ease',
                transitionDuration: '0s',
                backgroundColor: '#FDEFEF',

                // 'rgba(64, 64, 64, 0.85)',
                // opacity: 1,
                zIndex: 1,
                padding: '10px 20px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                display: `${show ? 'block' : 'none'}`,
                ...toolTipPosition,
            }}>
            {currentState && (
                <h5 style={{ textAlign: 'center' }}>
                    {currentState ?? ''} ({getUnits(currentState)})
                </h5>
            )}
            {currentState ? getToolTipComponenet(currentState) : null}
            <Row
                style={{
                    marginTop: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.8em',
                }}>
                <p>*As per IGBC standard</p>
            </Row>
        </div>
    );
};
