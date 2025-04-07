import { ahuContolsApi } from 'helpers/api/services/Clairco/customerSide/ahu';
import { controlVrfVrcStateAPI } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import {
    controlsInputValidation,
    setTemperatureValidation,
} from 'components/ClaircoControls/AHUControls/controlFormValidation';
import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';
import { toast } from 'sonner';
import { selectTagType } from 'types/selectTagType';
import { sanitizeParameters, sanitizeTemperature, sanitizeThermostatMode } from 'utils/controls/AHUControlsSanitize';
import { isAdmin } from 'utils/storageFunctions';

type AHUControlModalProps = {
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
const thermostatOptions: Array<{ label: string; value: string }> = [
    {
        label: 'Cool',
        value: 'Cool',
    },
    { label: 'Heat', value: 'Heat' },
    {
        label: 'Ventilation',
        value: 'Ventilation',
    },
];
interface ValidationErrors {
    [key: string]: string | null;
}
interface DeviceState {
    Mode: string;
    DeviceID: string;
    Parameters: Record<string, string | number>;
}
const AHUControlsModal: React.FC<AHUControlModalProps> = ({ state, stateControlFn, currentDeviceState }) => {
    const [deviceStatus, setDeviceStatus] = useState<boolean>(false);
    const [thermostatMode, setThermostatMode] = useState<selectTagType[]>();
    const [setTemperature, setSetTemperature] = useState<number | string>();
    // const [deviceId, setDeviceId] = useState<string>();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<ValidationErrors>({});
    const [isAPILoading, setIsAPILoading] = useState(false);
    const handleThermostatChanges = async (e: any) => {
        try {
            const sanitizedMode = sanitizeThermostatMode(e.value);
            if (!sanitizedMode) {
                setError((curr) => ({ ...curr, thermostat: 'Invalid thermostat mode selected.' }));
                return;
            }
            setError((curr) => ({ ...curr, thermostat: null }));
            setThermostatMode([{ label: sanitizedMode, value: sanitizedMode }]);
        } catch (error) {
            console.error('Error sanitizing thermostat mode:', error);
        }
    };
    const handleDeviceStatus = async () => {
        try {
            setDeviceStatus((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetTempChanges = async (e: any) => {
        try {
            const enteredValue = e.target.value?.trim();
            const sanitizedValue = sanitizeTemperature(enteredValue);
            // console.log('Sanitized values', sanitizedValue, enteredValue);
            if (sanitizedValue === null) {
                setError((curr) => ({ ...curr, setTemp: 'Invalid temperature. Must be between 16 and 40.' }));
                return;
            }
            // Validation
            setTemperatureValidation
                .validate({ setTemp: sanitizedValue })
                .then((res) => {
                    setSetTemperature(sanitizedValue);
                    setError((curr) => ({ ...curr, setTemp: null }));
                })
                .catch((res) => {
                    setError((curr) => ({ ...curr, setTemp: res.message }));
                });
        } catch (error) {
            console.error('Error sanitizing temperature:', error);
        }
    };
    const handleSumbit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            if (!currentDeviceState?.deviceId) {
                toast.error('Action Required: Please close the popup and try again to proceed.');
                return;
            }
            if (!e.nativeEvent.isTrusted) {
                toast.error(
                    'Alert: Potential malicious controls detected in the submitted form. To protect the system integrity, submission has been blocked. Please verify the source or contact support for further assistance.'
                );
                return;
            }
            // Permission Check
            const userPermission = isAdmin();
            if (!userPermission) {
                toast.error('Access Denied: You do not have the necessary permissions to perform this operation.');
                return;
            }
            setIsAPILoading(true);
            let newState: DeviceState = {
                Mode: 'Manual',
                DeviceID: currentDeviceState?.deviceId ?? '',
                Parameters: {},
            };
            if (setTemperature && setTemperature !== currentDeviceState.setTemp) {
                const sanitizedTemp = sanitizeTemperature(setTemperature);
                if (sanitizedTemp !== null) {
                    newState.Parameters['STEMP'] = sanitizedTemp;
                }
            }
            if (deviceStatus !== currentDeviceState.status) {
                newState.Parameters['RELAY1_SET'] = deviceStatus ? 'ON' : 'OFF';
                newState.Parameters['THSTAT'] = deviceStatus ? 'ON' : 'OFF';
            }
            if (thermostatMode?.[0]?.value !== currentDeviceState.thermoStatMode) {
                const sanitizedMode = sanitizeThermostatMode(thermostatMode?.[0]?.value ?? '');
                if (sanitizedMode !== null) {
                    newState.Parameters['MODE'] = sanitizedMode;
                }
            }
            if (newState.Parameters['RELAY1_SET'] === 'OFF') {
                newState.Parameters = {
                    RELAY1_SET: 'OFF',
                    THSTAT: deviceStatus ? 'ON' : 'OFF',
                };
            }
            // Validation
            controlsInputValidation
                .validate(newState)
                .then((res) => console.log('Validation Success', res))
                .catch((error) => console.log('Validation error', error));
            //Sanitization
            newState.Parameters = sanitizeParameters(newState.Parameters);

            if (!Object.keys(newState.Parameters).length) {
                toast.info('No change detected.');
                return;
            }
            const response = await ahuContolsApi(newState);
            if (response?.data?.Response === 'Updated') {
                setIsSuccess(true);
                toast.success('Device state updated successfully.');
                closeModalWithTimer();
            } else {
                toast.error('Failed to update device state. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting device controls:', error);
            toast.error('An unexpected error occurred. Please try again later.');
        } finally {
            setIsAPILoading(false);
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
        setDeviceStatus(currentDeviceState?.status);
        setThermostatMode([
            { label: currentDeviceState?.thermoStatMode ?? '', value: currentDeviceState?.thermoStatMode ?? '' },
        ]);
        setSetTemperature(currentDeviceState?.setTemp);
    }, [currentDeviceState]);
    return (
        <Modal show={state} onHide={handleModalClose} animation={true} className="text-dark">
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

                            <Col md={4} style={{ display: 'flex', justifyContent: 'start' }}>
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

                            <Col md={4} style={{ display: 'flex', justifyContent: 'start' }}>
                                {' '}
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="aiModeinput"
                                        disabled={true}
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
                    <div className="form-group">
                        <Row className="w-100">
                            <Col md={6}>
                                {' '}
                                <label htmlFor="device-control">Thermostat Mode :</label>
                            </Col>
                            <Col md={6}>
                                <Select
                                    name={'ThermostatMode'}
                                    placeholder="Select Thermostat mode"
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={thermostatOptions as any}
                                    onChange={handleThermostatChanges}
                                    value={Object.keys(thermostatMode ?? {}).length < 1 ? null : thermostatMode}
                                />
                                {error.thermostat && <div className="text-danger">{error.thermostat}</div>}
                            </Col>
                        </Row>
                    </div>
                </Row>
                {/* Set Temperature */}
                <Row style={{ padding: '10px' }}>
                    <div className="form-group">
                        <Row className="w-100">
                            <Col md={6}>
                                <label htmlFor="exampleFormControlInput1">Set Temperature:</label>
                            </Col>
                            <Col md={6} className="mx-0 px-2">
                                <input
                                    // disabled={aiMode || !deviceOn}
                                    style={{ width: '100%' }}
                                    type="number"
                                    className="form-control"
                                    id="set-temp"
                                    placeholder={`${setTemperature ? setTemperature : ''}°C`}
                                    onChange={(e) => handleSetTempChanges(e)}
                                    // value={setTemperature}
                                />{' '}
                                {error.setTemp && <div className="text-danger">{error.setTemp}</div>}
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
                {isAPILoading && (
                    <Row className="d-flex justify-content-center text-center">
                        <p>Processing your command...</p>{' '}
                    </Row>
                )}
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
    );
};

export default AHUControlsModal;
