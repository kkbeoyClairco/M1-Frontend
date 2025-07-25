import { HyperDatepicker } from 'components';
import { FormInput } from 'components/form';
import React, { ChangeEventHandler, Fragment, useRef, useState } from 'react';
import { Button, Col, Collapse, Form, Row } from 'react-bootstrap';
import { useSSR } from 'react-i18next';
import Select, { ActionMeta, SingleValue } from 'react-select';
import Creatable from 'react-select/creatable';
import { selectTagType } from 'types/selectTagType';
import { param } from './deviceCreationConstants';
import { device } from 'helpers/api/services/Clairco/device';
import { deviceTypesConstant, deviceTypesReverseConstant } from 'appConstants/DeviceMappingConstants';
import { getDevices } from 'helpers/api/services/Clairco/adminSide/devices';
import { toast } from 'sonner';
import { active } from 'sortablejs';
import { parametersDefaultValues } from 'appConstants/iaqConstants';
// const param = {
//     parameter: '',
//     register: '',
//     limits: '',
//     calibrationValue: '',
// };
const activeParameters = ['PM1', 'PM25', 'PM4', 'PM10', 'CO2', 'HUM', 'TEMP'];

const parameterTypes = [
    {
        label: 'Temperature',
        value: 'TEMP',
    },
    {
        label: 'Humidity',
        value: 'HUM',
    },
    {
        label: 'CO2',
        value: 'CO2',
    },
    {
        label: 'VOC',
        value: 'VOC',
    },

    {
        label: 'PM1',
        value: 'PM1',
    },
    {
        label: 'PM2.5',
        value: 'PM2.5',
    },
    {
        label: 'PM10',
        value: 'PM10',
    },
    {
        label: 'PM4',
        value: 'PM4',
    },
    {
        label: 'AQI',
        value: 'AQI',
    },
    {
        label: 'OPM10',
        value: 'OPM10',
    },
    {
        label: 'OPM25',
        value: 'OPM25',
    },
];
const outdoorDeviceTypes = [
    {
        label: 'Outdoor Device',
        value: 'outdoorDevice',
    },
    {
        label: 'Station',
        value: 'station',
    },
];

interface IAQModuleInterface {
    data: any;
    handlerFn: any;
    error?: any;
}
export const IAQModule: React.FC<IAQModuleInterface> = ({ data, handlerFn, error }) => {
    // const [parameters, setParameters] = useState([param]);
    // const [parentTypeSelected, setParentTypeSelected] = useState<string | null>(null);
    // const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
    const [outdoorDevices, setOutdoorDevices] = useState([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleAddNewParamsRow = async () => {
        try {
            // setParameters((prev) => [...prev, param]);
            const parameters = data?.parameters ?? [];
            handlerFn('parameters', [...parameters, param.parameter]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveParamsRow = async (index: number) => {
        try {
            if (index === null || index === undefined) return;
            const newParams = data?.parameters.filter((param: any, i: number) => i !== index);
            handlerFn('parameters', newParams);

            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 0);
        } catch (error) {
            console.log(error);
        }
    };

    const handleParentSelection = async (value: SingleValue<selectTagType>, actions: ActionMeta<selectTagType>) => {
        try {
            if (value) handlerFn('outdoorDeviceType', value.value);
            if (actions?.name === 'outdoorDeviceType' && data?.customer?.value) {
                const res = await getDevices(deviceTypesConstant.VRV_VRF_OUTDOOR, '', data?.customer?.value ?? '');
                const { records = {} } = res?.data ?? {};

                const dataToPass = records.map((record: any) => ({ label: record?.name, value: record?.value }));
                setOutdoorDevices(dataToPass);
            }
            // setParentTypeSelected(value.value);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubscriptionSelection = async (value: any) => {
        try {
            if (value) handlerFn('expiringAt', new Date(value).toISOString());
        } catch (error) {
            console.log(error);
        }
    };

    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const name = e?.target?.value ?? '';
            handlerFn('name', name);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEmailChange = async (value: any, filed: string) => {
        try {
            // const
            if (!value) return;
            const email = value?.map((selectObj: any) => selectObj.value ?? '');
            // console.log('Email additions', value, filed, email);
            handlerFn(filed, email);
        } catch (error) {
            console.log(error);
        }
    };
    const handleParameterFieldChange = async (value: any, index: number, field: string) => {
        try {
            const parameters = [...data.parameters];
            parameters[index] = {
                ...parameters[index],
                [field]: value,
            };
            if (field === 'name') {
                const paramName = value as keyof typeof parametersDefaultValues;
                if (parametersDefaultValues[paramName]) {
                    parameters[index] = { ...parameters[index], ...parametersDefaultValues[paramName] };
                }
            }
            // console.log('Parameter selected', value, index, field);
            handlerFn('parameters', parameters);
        } catch (error) {
            toast.error('Error adding parameter');
            console.log(error);
        }
    };
    return (
        <Fragment>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name *'}</Form.Label>
                <FormInput
                    placeholder={'Enter Name '}
                    type="text"
                    name={'name'}
                    containerClass={'mb-1'}
                    key="text"
                    onChange={handleNameChange}
                />
                {error?.name && <div className="text-danger">{error?.name ?? ''}</div>}
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Outdoor Device Type (optional)'}</Form.Label>
                <Select
                    name="outdoorDeviceType"
                    placeholder="Select outdoor Device Type"
                    className="react-select mb-2"
                    classNamePrefix="react-select"
                    options={outdoorDeviceTypes}
                    onChange={handleParentSelection}
                    // value={selected.floor ? selected.floor : null}
                    // isDisabled={true}
                />
                {error?.outdoorDeviceType && <div className="text-danger">{error?.outdoorDeviceType ?? ''}</div>}
            </Col>{' '}
            <Collapse in={data?.outdoorDeviceType === 'outdoorDevice'}>
                <Col style={{ marginTop: '20px' }}>
                    <Form.Label>{'Outdoor Device '}</Form.Label>
                    <Select
                        name="outdoorDevice"
                        placeholder="Select Outdoor Device"
                        className="react-select mb-2"
                        classNamePrefix="react-select"
                        // options={floorsList}
                        // onChange={handleFloorSelection}
                        // value={selected.floor ? selected.floor : null}
                        // isDisabled={true}
                    />
                </Col>
            </Collapse>
            <Collapse in={data?.outdoorDeviceType === 'station'}>
                <Col style={{ marginTop: '20px' }}>
                    <Form.Label>{'Station Id '}</Form.Label>
                    <FormInput
                        placeholder={'Enter Parameter '}
                        type="text"
                        name={'parameter'}
                        containerClass={'mb-1'}
                        key="text"
                    />
                </Col>
            </Collapse>
            {/*  */}
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Client Email '}</Form.Label>
                <Creatable
                    // menuIsOpen={false}
                    isMulti
                    name="Client Email"
                    placeholder="Enter Client Emails "
                    // options={[]} // You can leave options empty for free input
                    // value={alertEmails.map((email) => ({ label: email, value: email }))}
                    // onChange={(selected) => setAlertEmails(selected.map((item: any) => item.value))}
                    onChange={(inputValue) => {
                        handleEmailChange(inputValue, 'clientEmail');
                    }}
                    isClearable
                />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Alert Email '}</Form.Label>

                <Creatable
                    isMulti
                    name="alertEmails"
                    placeholder="Enter alert emails"
                    // options={[]} // You can leave options empty for free input
                    // value={alertEmails.map((email) => ({ label: email, value: email }))}
                    // onChange={(selected) => setAlertEmails(selected.map((item: any) => item.value))}
                    onChange={(inputValue) => {
                        handleEmailChange(inputValue, 'alertEmail');
                    }}
                    isClearable
                />
            </Col>{' '}
            <Row style={{ marginTop: '20px' }}>
                <Col xs={12} lg={6}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="weeklyReport"
                        id={`param-weeklyReport`}
                        disabled
                        checked={false}
                        // onClick={() => onSelectFn(parameter)}
                        // checked={selectedParameter === parameter}
                        readOnly
                    />{' '}
                    <label
                        style={{
                            cursor: 'pointer',
                        }}
                        className="form-check-label mx-2"
                        htmlFor={`param-weeklyReport`}>
                        Weekly Reports
                    </label>
                </Col>

                <Col xs={12} lg={6}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="alert"
                        id={`param-alerts`}
                        disabled
                        checked={false}
                        // onClick={() => onSelectFn(parameter)}
                        // checked={selectedParameter === parameter}
                        readOnly
                    />{' '}
                    <label
                        style={{
                            cursor: 'pointer',
                        }}
                        className="form-check-label mx-2"
                        htmlFor={`param-alerts`}>
                        Alerts
                    </label>
                </Col>
            </Row>
            {/*  */}
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Subscription ends on *'}</Form.Label>
                <HyperDatepicker
                    showTimeSelect={false}
                    // value={dateDone}
                    // dateFormat={'MM/dd/yyyy'}
                    value={new Date()}
                    onChange={handleSubscriptionSelection} // onChange={handleDateSelection}
                />
            </Col>{' '}
            {error?.expiringAt && <div className="text-danger">{error?.expiringAt ?? ''}</div>}
            <div className="overflow-scroll mt-3" ref={scrollRef} style={{ height: '300px', overflowX: 'hidden' }}>
                {data?.parameters?.map((params: any, i: number) => {
                    return (
                        <Row>
                            <Col xs={12} lg={3}>
                                {i + 1}. <Form.Label>{'Parameters'}</Form.Label>
                                <Select
                                    name="Parameter"
                                    placeholder="Select Parameter"
                                    className="react-select mb-2"
                                    classNamePrefix="react-select"
                                    options={parameterTypes}
                                    onChange={(value) => handleParameterFieldChange(value?.value, i, 'name')}
                                    // value={params.name ? params.name : null}
                                    // isDisabled={true}
                                />
                            </Col>
                            <Col xs={12} lg={2}>
                                <Form.Label>{'Lower Limits'}</Form.Label>
                                <FormInput
                                    placeholder={'Enter Lower Limits '}
                                    type="number"
                                    name={'lowerLimits'}
                                    containerClass={'mb-1'}
                                    key="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleParameterFieldChange(e?.target?.value, i, 'low')
                                    }
                                    value={params.low ? params.low : null}
                                />
                            </Col>
                            <Col xs={12} lg={2}>
                                <Form.Label>{'Upper Limit'}</Form.Label>
                                <FormInput
                                    placeholder={'Enter Upper Limit '}
                                    type="number"
                                    name={'upperLimit'}
                                    containerClass={'mb-1'}
                                    key="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleParameterFieldChange(e?.target?.value, i, 'high')
                                    }
                                    value={params.high ? params.high : null}
                                />
                            </Col>
                            <Col xs={12} lg={2}>
                                <Form.Label>{'CalibrationValues'}</Form.Label>
                                <FormInput
                                    placeholder={'Enter Calibration Values '}
                                    type="number"
                                    name={'calibrationValues'}
                                    containerClass={'mb-1'}
                                    key="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleParameterFieldChange(e?.target?.value, i, 'calib')
                                    }
                                    value={params.calib ? params.calib : null}
                                />
                            </Col>
                            <Col
                                xs={12}
                                lg={1}
                                // className="d-flex justify-content-center align-items-center"
                            >
                                {/* <Form.Label>{'Active'}</Form.Label> */}
                                <label
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    className="form-check-label mx-2"
                                    htmlFor={`param-isActive`}>
                                    Alerts
                                </label>
                                <input
                                    className="form-check-input my-2 mx-3"
                                    type="checkbox"
                                    name="isActive"
                                    id={`param-isActive`}
                                    style={{
                                        transform: 'scale(1.5)', // increases size by 1.5x
                                        marginRight: '8px',
                                    }}
                                    onChange={(e) => {
                                        const value = (e.target as HTMLInputElement).checked;
                                        handleParameterFieldChange(value, i, 'isActive');
                                    }}
                                    checked={params.isActive ?? false}
                                    readOnly
                                />{' '}
                            </Col>
                            {
                                <Col xs={12} md={1} className="d-flex justify-content-end align-items-center">
                                    <Button className="mt-3" onClick={() => handleRemoveParamsRow(i)}>
                                        Remove
                                    </Button>
                                </Col>
                            }
                        </Row>
                    );
                })}
            </div>
            <Row className="d-flex justify-content-end">
                <Col className="d-flex justify-content-end" xs={3}>
                    <Button onClick={handleAddNewParamsRow}> Add new Parameter</Button>
                </Col>
            </Row>{' '}
            <Row>
                {error &&
                    Object.entries(error).map(([key, value]) =>
                        activeParameters.includes(key) && value ? (
                            <Row key={key}>
                                <div className="text-danger">
                                    {key}-{'Please check the inputs'}
                                </div>
                            </Row>
                        ) : null
                    )}
            </Row>
        </Fragment>
    );
};
