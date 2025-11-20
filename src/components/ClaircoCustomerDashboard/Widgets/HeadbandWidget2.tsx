import React from 'react';
import Navigator from '../NavigatorComponent/Navigator';
import LastUpdated from '../General/LastUpdated/LastUpdated';
import GearIcon from '../Icons/GearIcon';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type HeadbandWidgetType = {
    title?: string;
    value?: string;
    lastUpdated?: string;
    functionToExecute?: () => void;
    isIconActive?: boolean;
    iconFunction?: any;
    time: string;
    description?: string;
};
const HeadbandWidget2 = ({
    title,
    value,
    lastUpdated,
    functionToExecute,
    iconFunction,
    time,
    isIconActive,
    description,
}: HeadbandWidgetType) => {
    return (
        <OverlayTrigger
            placement="top"
            overlay={description ? <Tooltip id="headband-tooltip">{description || ''}</Tooltip> : <></>}>
            <div
                className="widget-flat-dummy"
                style={{
                    padding: '0px',
                    // paddingLeft: '15px',
                    margin: '5px',
                    // height: '150px',
                    // width: '100%',
                    // display: 'inline-block',
                    // // color: 'black',
                    // // background: 'white',
                    // // borderWidth: '2px',
                    // boxShadow: 'inset 2px 2px 4px rgba(222, 224, 223, 0.2), inset -2px -2px 4px rgba(222, 224, 223, 0.5)',
                    // // textAlign: 'left',
                    // // lineHeight: '40px',
                    borderRadius: '4px',
                    background: 'white',
                    color: '#6C757D',
                    // padding: '0px',
                    // backgroundImage: 'white',
                }}>
                {' '}
                <div
                    style={{
                        display: 'flex',
                        background: '#008675',
                        paddingLeft: '10px',
                        color: 'white',
                        height: '33%',
                        justifyContent: 'start',
                        alignItems: 'center',
                    }}>
                    <h5 style={{ marginBottom: '3px' }}> {title || '-'}</h5>
                </div>
                {/* <h6 style={{ marginTop: '0px' }}>BTU Unit 4</h6> */}
                <div style={{ paddingLeft: '10px', width: '100%' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <h5 style={{ padding: '0px', width: '80%', marginTop: '20px', marginBottom: '20px' }}>
                            {value !== undefined && value !== null && value !== '' ? value : '-'}
                        </h5>{' '}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                            {' '}
                            {isIconActive && <GearIcon clickeHandlerFunction={iconFunction} />}
                        </div>{' '}
                    </div>
                    <div> {time ? <h5 style={{ paddingTop: '0px' }}> {time}</h5> : null} </div>
                </div>
            </div>
        </OverlayTrigger>
    );
};

export default HeadbandWidget2;
