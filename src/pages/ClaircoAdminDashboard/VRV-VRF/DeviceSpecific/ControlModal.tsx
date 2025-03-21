import { controlVrfVrcStateAPI } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface controlModalProps {
    state: boolean;
    modalControlFunction: Dispatch<SetStateAction<boolean>>;
    currentDeviceDetails: any;
}

enum DeviceModes {
    Auto = 0,
    Heat = 1,
    Dry = 2,
    Fan = 3,
    Cool = 4,
    AutoHeat = 5,
    AutoCool = 6,
}
const fanSpeedMap = ['Auto', 'Low', 'Low+', 'Med', 'Med+', 'High'];
const modeMap = ['Auto', 'Heat', 'Dry', 'Fan', 'Cool', 'AutoHeat', 'AutoCool'];
enum FanSpeeds {
    Auto = 0,
    Low = 1,
    'Low+' = 2,
    Medium = 3,
    'Medium+' = 4,
    High = 5,
}

const fanSpeeds: { [key in keyof typeof FanSpeeds]: FanSpeeds } = {
    Auto: FanSpeeds.Auto,
    Low: FanSpeeds.Low,
    'Low+': FanSpeeds['Low+'],
    Medium: FanSpeeds.Medium,
    'Medium+': FanSpeeds['Medium+'],
    High: FanSpeeds.High,
};
const deviceModes: { [key in keyof typeof DeviceModes]: DeviceModes } = {
    Auto: DeviceModes.Auto,
    Heat: DeviceModes.Heat,
    Dry: DeviceModes.Dry,
    Fan: DeviceModes.Fan,
    Cool: DeviceModes.Cool,
    AutoHeat: DeviceModes.AutoHeat,
    AutoCool: DeviceModes.AutoCool,
};
const ControlModal: React.FC<controlModalProps> = ({ state, modalControlFunction, currentDeviceDetails }) => {
    const [deviceName, setDeviceName] = useState(currentDeviceDetails.name || '');
    const [setTemperature, setSetTemperature] = useState(currentDeviceDetails['Set Temp'] || 24);
    const [deviceOn, setDeviceOn] = useState(currentDeviceDetails['Status'] == 'ON');
    const [operationMode, setOperationMode] = useState(deviceModes[currentDeviceDetails?.Mode || 'Dry']);
    const [fanSpeed, setFanSpeed] = useState(fanSpeeds[currentDeviceDetails['Fan Speed']] || 5);
    const [deviceId, setDeviceId] = useState(currentDeviceDetails.id || '');
    const [aiMode, setAiMode] = useState(currentDeviceDetails.controlMode == 'ai');
    const [controlMode, setControlMode] = useState(currentDeviceDetails.controlMode || 'manual');
    const [isSuccess, setIsSuccess] = useState(false);
    const [userId, setUserId] = useState(JSON.parse(sessionStorage.getItem('USER_DATA') || '').user.id);
    // const [isChanged, setIsChanged] = useState(false);
    // console.log('COntrol settings:', currentDeviceDetails, currentDeviceDetails?.Mode, operationMode);
    const handleClose = () => {
        modalControlFunction(false);
    };
    // const userId = JSON.parse(sessionStorage.getItem('USER_DATA') || '').user.id;
    // console.log('userId', userId);
    // console.log('Data to Modal:', aiMode);

    const changeTemperature = async (e: any) => {
        e.preventDefault();
        try {
            // console.log('Change the temp:', e.target);
        } catch (error) {}
    };

    //Device ON/OFF function
    const setDeviceOnOff = async () => {
        try {
            // console.log('Device On/Off', deviceOn);
            setDeviceOn((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };
    // Operation Mode Controls
    const operationControl = async (value: any) => {
        try {
            // console.log('Operation control Params:', value);
            setOperationMode(value);
        } catch (error) {
            console.log(error);
        }
    };
    // Fan Speed Control
    const controlFanSpeed = async (speed: any) => {
        try {
            // console.log('Fan speed changed:', speed);
            setFanSpeed(speed);
        } catch (error) {
            console.log(error);
        }
    };
    // Control AI Mode
    const setAiModeOnOff = async () => {
        try {
            setAiMode((currentState) => !currentState);
            setControlMode((currentMode: string) => (currentMode == 'ai' ? 'manual' : 'ai'));
        } catch (error) {
            console.log(error);
        }
    };
    const handleSumbmitChanges = async () => {
        try {
            interface Parameter {
                Status?: number;
                Mode?: string;
                SetTemp?: number;
                'Fan Speed'?: string;
            }
            type newStateType = {
                DeviceID: string;
                userId: string;
                Mode?: string;
                Parameters: Parameter[];
            };
            let newState: newStateType = {
                DeviceID: deviceId,
                userId,
                Parameters: [],
            };
            // if (currentDeviceDetails['Status'] !== (deviceOn ? 'ON' : 'OFF')) {
            //     newState.Parameters.push({ Status: deviceOn ? 1 : 0 });
            // }
            let isChanged = false;
            if (fanSpeeds[currentDeviceDetails['Fan Speed']] !== fanSpeed) {
                newState.Parameters.push({ 'Fan Speed': fanSpeedMap[fanSpeed] });
            }
            if (currentDeviceDetails.Mode !== modeMap[operationMode]) {
                newState.Parameters.push({ Mode: modeMap[operationMode] });
            }
            if (currentDeviceDetails['Set Temp'] !== setTemperature) {
                newState.Parameters.push({ SetTemp: setTemperature * 10 });
            }
            if (currentDeviceDetails.controlMode !== (aiMode ? 'ai' : 'manual')) {
                newState.Mode = aiMode ? 'ai' : 'manual';
                if (newState.Mode === 'ai') newState.Parameters = [];
            }
            if (currentDeviceDetails['Status'] !== (deviceOn ? 'ON' : 'OFF')) {
                let newS: newStateType = {
                    DeviceID: deviceId,
                    userId,
                    Parameters: [],
                };
                newS.Parameters.push({ Status: deviceOn ? 1 : 0 });
                if (deviceOn) newState.Parameters.push({ Status: deviceOn ? 1 : 0 });
                else newState = newS;
            }
            let exists = false;
            newState.Parameters.forEach((obj) => {
                if (obj.Status === 0) exists = true;
                // console.log('Control Check', obj.Status, exists);
                // if (Object.keys(obj).includes('Status')) exists = true;
            });

            // fix the bug here
            // console.log(
            //     'Log:',
            //     currentDeviceDetails['Status'],
            //     deviceOn,
            //     currentDeviceDetails['Status'] === (deviceOn ? 'ON' : 'OFF')
            // );
            if (currentDeviceDetails['Status'] === (deviceOn ? 'ON' : 'OFF') && exists) {
                newState.Parameters = [];
                delete newState.Mode;
                console.log('new one', newState);
            }
            if (currentDeviceDetails['Status'] === 'OFF' && !deviceOn) {
                newState.Parameters = [];
                delete newState.Mode;
            }
            if (newState.Mode || newState.Parameters.length > 0) isChanged = true;

            const newSettings = {
                DeviceID: deviceId,
                userId,
                Mode: aiMode ? 'ai' : 'manual',
                Parameters: [
                    { Status: deviceOn ? 1 : 0 },
                    { Mode: modeMap[operationMode] },
                    {
                        SetTemp: setTemperature * 10,
                    },
                    { 'Fan Speed': fanSpeedMap[fanSpeed] },
                ],
            };

            // console.log('Controls: New', newState, 'Ref:', newSettings);
            if (!isChanged) return;
            const res: any = await controlVrfVrcStateAPI(newState);
            if (res?.data?.Response === 'Updated') setIsSuccess(true);
            console.log('Res from control:', res);
            // modalControlFunction((currentState) => !currentState);
            closeModalWithTimer();
        } catch (error) {
            setIsSuccess(false);
            console.log(error);
            modalControlFunction((currentState) => !currentState);
        }
    };

    const closeModalWithTimer = async () => {
        try {
            const timeoutId = setTimeout(() => {
                modalControlFunction((currentState) => !currentState);
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
        const controller = new AbortController();
        const signal = controller.signal;

        if (deviceOn !== (currentDeviceDetails['Status'] === 'ON')) {
            setDeviceOn(currentDeviceDetails['Status'] === 'ON');
        }
        if (deviceName !== currentDeviceDetails.name) {
            setDeviceName(currentDeviceDetails.name);
        }
        if (setTemperature !== currentDeviceDetails['Set Temp']) {
            setSetTemperature(currentDeviceDetails['Set Temp']);
        }
        if (operationMode !== deviceModes[currentDeviceDetails['Mode']]) {
            setOperationMode(deviceModes[currentDeviceDetails['Mode']]);
        }
        if (fanSpeed !== fanSpeeds[currentDeviceDetails['Fan Speed']]) {
            setFanSpeed(fanSpeeds[currentDeviceDetails['Fan Speed']]);
        }
        if (aiMode !== (currentDeviceDetails.controlMode == 'ai')) setAiMode((currentState) => !currentState);
        if (controlMode !== currentDeviceDetails.controlMode) setControlMode(currentDeviceDetails.controlMode);
        if (deviceId !== currentDeviceDetails.id) setDeviceId(currentDeviceDetails.id);
        return () => {
            controller.abort();
        };
    }, [currentDeviceDetails]);
    return (
        <>
            <Modal show={state} onHide={handleClose} animation={true}>
                <Modal.Header>
                    <Modal.Title style={{ marginInline: 'auto' }}>{deviceName}</Modal.Title>
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
                                {/* <Col
                                        md={6}
                                        style={{ display: 'flex', justifyContent: 'space-evenly', gap: '40px' }}>
                                        <Button variant="primary" onClick={changeSetTemperature}>
                                            On
                                        </Button>{' '}
                                        <Button variant="primary" onClick={changeSetTemperature}>
                                            Off
                                        </Button>
                                    </Col> */}{' '}
                                <Col md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                            onChange={setDeviceOnOff}
                                            checked={deviceOn}
                                        />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                            {deviceOn}
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
                                {/* <Col
                                        md={6}
                                        style={{ display: 'flex', justifyContent: 'space-evenly', gap: '40px' }}>
                                        <Button variant="primary" onClick={changeSetTemperature}>
                                            On
                                        </Button>{' '}
                                        <Button variant="primary" onClick={changeSetTemperature}>
                                            Off
                                        </Button>
                                    </Col> */}{' '}
                                <Col md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="aiModeinput"
                                            disabled={!deviceOn}
                                            onChange={setAiModeOnOff}
                                            checked={aiMode}
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
                                    <label htmlFor="device-control">Operation Mode :</label>
                                </Col>
                                <Col md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {' '}
                                    <select
                                        id="device-control"
                                        onChange={(e) => operationControl(e.target.value)}
                                        disabled={aiMode || !deviceOn}>
                                        {Object.keys(deviceModes).map((mode: any) => {
                                            return (
                                                <option
                                                    key={mode}
                                                    selected={operationMode === deviceModes[mode]}
                                                    value={deviceModes[mode]}>
                                                    {mode}
                                                </option>
                                            );
                                        })}{' '}
                                    </select>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                    {/* Fan Speeds */}
                    <Row style={{ padding: '10px' }}>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <Row style={{ width: '100%' }}>
                                {' '}
                                <Col sm={6}>
                                    <label htmlFor="device-control">Fan Speed :</label>
                                </Col>
                                <Col sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <select
                                        id="device-control"
                                        disabled={aiMode || !deviceOn}
                                        onChange={(e) => controlFanSpeed(e.target.value)}>
                                        {
                                            Object.keys(fanSpeeds).map((speed: any) => {
                                                // console.log('Fan speed', fanSpeed, speed, fanSpeeds[speed]);
                                                return (
                                                    <option
                                                        key={speed}
                                                        selected={fanSpeed == fanSpeeds[speed]}
                                                        value={fanSpeeds[speed]}>
                                                        {speed}
                                                    </option>
                                                );
                                            })
                                            // <option value="1">Low</option>
                                            // <option value="2">Low+</option>
                                            // <option value="3">Medium</option>
                                            // <option value="4">Medium+ </option>
                                            // <option value="5">High</option>
                                        }{' '}
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
                                        disabled={aiMode || !deviceOn}
                                        style={{ width: '100%' }}
                                        type="number"
                                        className="form-control"
                                        id="set-temp"
                                        placeholder={`Temp:${setTemperature}`}
                                        onChange={(e) => setSetTemperature(parseFloat(e.target.value))}
                                        value={setTemperature}
                                    />
                                </Col>
                                <Col md={4}></Col>
                            </Row>
                        </div>
                    </Row>
                    <Row style={{ padding: '10px' }}>
                        {!aiMode && !isSuccess && (
                            <div style={{ color: 'black', fontSize: 'smaller', borderRadius: '3px' }}>
                                <h6>Note:</h6>
                                <p style={{}}>
                                    Pilot mode is active. Changes will be reflected on the device within approximately 2
                                    minutes.
                                </p>
                            </div>
                        )}
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
                    <Button variant="primary" onClick={handleSumbmitChanges} style={{ background: '#008675' }}>
                        Update
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ControlModal;
