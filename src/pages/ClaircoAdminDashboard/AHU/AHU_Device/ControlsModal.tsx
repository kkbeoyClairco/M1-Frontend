import { ahuContolsApi } from 'helpers/api/services/Clairco/customerSide/ahu';
import { controlVrfVrcStateAPI } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import { parse } from 'path';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';

type ControlModalProps = {
    state?: boolean;
    stateControlFn?: Dispatch<SetStateAction<boolean>>;
    // currentDeviceState?: any;
    currentDeviceState?: any;
};
type ThermoStatModes = {
    Cool: string;
    Heat: string;
    Ventilation: string;
};
const ControlsModal: React.FC<ControlModalProps> = ({ state, stateControlFn, currentDeviceState }) => {
    const [deviceStatus, setDeviceStatus] = useState<boolean>(currentDeviceState?.status);
    const [thermostatMode, setThermostatMode] = useState<string>(currentDeviceState?.thermoStatMode);
    const [setTemperature, setSetTemperature] = useState<any>(currentDeviceState?.setTemp);
    const [isSuccess, setIsSuccess] = useState(false);
    const [deviceId, setDeviceId] = useState(currentDeviceState.deviceId);
    // console.log('Modal State', currentDeviceState);
    const thermoStatModes: ThermoStatModes = {
        Cool: 'Cool',
        Heat: 'Heat',
        Ventilation: 'Ventilation',
    };
    const handleThermostatChanges = async (e: any) => {
        try {
            // console.log('Thermostat changed', e);
            setThermostatMode(e);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeviceStatus = async () => {
        try {
            // console.log('status changed');
            setDeviceStatus((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetTempChanges = async (e: any) => {
        try {
            // console.log('Tem changes:', Math.round(parseFloat(e.target.value) * 2) / 2);

            setSetTemperature(Math.round(parseFloat(e.target.value) * 2) / 2);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSumbit = async () => {
        try {
            let newState: any = {
                Mode: 'Manual',
                DeviceID: deviceId,
                Parameters: {},
            };
            if (setTemperature !== currentDeviceState.setTemp) newState.Parameters['STEMP'] = setTemperature;
            if (deviceStatus !== currentDeviceState.status) {
                newState.Parameters['RELAY1_SET'] = deviceStatus ? 'ON' : 'OFF';
                newState.Parameters['THSTAT'] = deviceStatus ? 'ON' : 'OFF';
            }
            if (thermostatMode !== currentDeviceState.thermoStatMode) newState.Parameters['MODE'] = thermostatMode;
            if (newState.Parameters['RELAY1_SET'] === 'OFF') {
                newState = { Mode: 'Manual', DeviceID: deviceId, Parameters: { RELAY1_SET: 'OFF' } };
                newState.Parameters['THSTAT'] = deviceStatus ? 'ON' : 'OFF';
            }
            if (!Object.keys(newState.Parameters).length) return;
            const res = await ahuContolsApi(newState);
            // console.log('New State:', res);
            if (res?.data?.Response === 'Updated') setIsSuccess(true);
            closeModalWithTimer();
        } catch (error) {
            console.log(error);
        }
    };
    const handleModalClose = async () => {
        try {
            if (stateControlFn) stateControlFn((currentState) => !currentState);
        } catch (error) {}
    };
    const closeModalWithTimer = async () => {
        try {
            const timeoutId = setTimeout(() => {
                if (stateControlFn) stateControlFn((currentState) => !currentState);
                setIsSuccess(false);
            }, 800);
            return () => {
                clearTimeout(timeoutId);
            };
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (currentDeviceState?.status !== deviceStatus) setDeviceStatus(currentDeviceState?.status);
        if (currentDeviceState?.thermoStatMode !== thermostatMode) {
            setThermostatMode(currentDeviceState?.thermoStatMode);
        }
        if (currentDeviceState?.setTemp !== setTemperature) setSetTemperature(currentDeviceState?.setTemp);
        if (currentDeviceState?.deviceid !== deviceId) setDeviceId(currentDeviceState?.deviceId);
    }, []);
    return (
        <div>
            {' '}
            <Modal show={state} onHide={handleModalClose} animation={true}>
                <Modal.Header>
                    <Modal.Title style={{ marginInline: 'auto' }}>{currentDeviceState.deviceName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* On/Off Section */}
                    <Row style={{ padding: '10px' }}>
                        {' '}
                        <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
                            <Row style={{ width: '100%' }}>
                                <Col md={6}>
                                    <label htmlFor="register-device-control">Device On/Off:</label>
                                </Col>

                                <Col md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                            onChange={handleDeviceStatus}
                                            checked={deviceStatus}
                                        />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                            {deviceStatus ? 'ON' : 'OFF'}
                                        </label>
                                    </div>
                                </Col>
                            </Row>{' '}
                        </div>
                    </Row>
                    {/* AI Mode Selection */}
                    <Row style={{ padding: '10px' }}>
                        {' '}
                        <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
                            <Row style={{ width: '100%' }}>
                                <Col md={6}>
                                    <label htmlFor="aiModeinput">AI Mode:</label>
                                </Col>

                                <Col md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="aiModeinput"
                                            disabled={true}
                                            // onChange={setAiModeOnOff}
                                            checked={false}
                                        />
                                        <label className="form-check-label" htmlFor="aiModeinput"></label>
                                    </div>
                                </Col>
                            </Row>{' '}
                        </div>
                    </Row>
                    {/* Operation Modes */}
                    <Row style={{ padding: '10px' }}>
                        <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
                            <Row style={{ width: '100%' }}>
                                <Col md={6}>
                                    {' '}
                                    <label htmlFor="device-control">Thermostat Mode :</label>
                                </Col>
                                <Col md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <select
                                        id="thermostat-control"
                                        placeholder={thermostatMode}
                                        onChange={(e) => handleThermostatChanges(e.target.value)}>
                                        {Object.keys(thermoStatModes).map((mode: string) => {
                                            const key = mode as keyof ThermoStatModes;
                                            return (
                                                <option
                                                    key={key}
                                                    selected={thermostatMode === thermoStatModes[key]}
                                                    // value={deviceModes[mode]}
                                                >
                                                    {mode}
                                                </option>
                                            );
                                        })}{' '}
                                    </select>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                    {/* Set Temperature */}
                    <Row style={{ padding: '10px' }}>
                        {' '}
                        <div className="form-group">
                            <Row>
                                <Col md={6}>
                                    <label htmlFor="exampleFormControlInput1">Set Temperature:</label>
                                </Col>
                                <Col md={6}>
                                    {' '}
                                    <input
                                        // disabled={aiMode || !deviceOn}
                                        style={{ width: '100%' }}
                                        type="number"
                                        className="form-control"
                                        id="set-temp"
                                        // placeholder={`Temp:${setTemperature}`}
                                        onChange={(e) => handleSetTempChanges(e)}
                                        value={setTemperature}
                                    />
                                </Col>
                                <Col md={4}></Col>
                            </Row>
                        </div>
                    </Row>
                    <Row>
                        {' '}
                        {isSuccess && (
                            <div
                                style={{
                                    background: '#8AFF8A',
                                    color: 'black',
                                    fontSize: 'smaller',
                                    borderRadius: '3px',
                                }}>
                                {' '}
                                <p>
                                    Instructions have been registered. Changes will be reflected within approximately 2
                                    minutes.
                                </p>
                            </div>
                        )}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {' '}
                    <Button variant="primary" onClick={handleSumbit} style={{ background: '#008675' }}>
                        Update
                    </Button>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
        </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ControlsModal;
