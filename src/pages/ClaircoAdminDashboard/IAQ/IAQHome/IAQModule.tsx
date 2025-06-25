import { HyperDatepicker } from 'components';
import { FormInput } from 'components/form';
import React, { ChangeEventHandler, Fragment, useRef, useState } from 'react';
import { Button, Col, Collapse, Form, Row } from 'react-bootstrap';
import { useSSR } from 'react-i18next';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';
import { param } from './deviceCreationConstants';
import { device } from 'helpers/api/services/Clairco/device';
import { deviceTypesConstant, deviceTypesReverseConstant } from 'appConstants/DeviceMappingConstants';
import { getDevices } from 'helpers/api/services/Clairco/adminSide/devices';
// const param = {
//     parameter: '',
//     register: '',
//     limits: '',
//     calibrationValue: '',
// };

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
    const [parameters, setParameters] = useState([param]);
    const [parentTypeSelected, setParentTypeSelected] = useState<string | null>(null);
    const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
    const [outdoorDevices, setOutdoorDevices] = useState([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleParametersEditing = async (
        value: SingleValue<selectTagType> | string,
        index?: number,
        key?: string
    ) => {
        try {
            console.log('New slecion', value);
        } catch (error) {}
    };
    const handleAddNewParamsRow = async () => {
        try {
            // setParameters((prev) => [...prev, param]);
            const parameters = data.parameters;
            handlerFn('parameters', [...parameters, param]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveParamsRow = async (index: number) => {
        try {
            if (!index) return;
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
            console.log('Selected Type', value, actions, data);
            if (value) handlerFn('outdoorDeviceType', value.value);
            if (actions?.name === 'outdoorDeviceType' && data?.customer?.value) {
                const res = await getDevices(deviceTypesConstant.VRV_VRF_OUTDOOR, '', data?.customer?.value ?? '');
                const { records = {} } = res?.data ?? {};

                const dataToPass = records.map((record: any) => ({ label: record?.name, value: record?.value }));
                setOutdoorDevices(dataToPass);
                // console.log('Revice List response', res);
            }
            // setParentTypeSelected(value.value);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubscriptionSelection = async (value: any) => {
        try {
            console.log('Subscription selected', value);
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
    return (
        <Fragment>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
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
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Subscription ends on'}</Form.Label>
                <HyperDatepicker
                    showTimeSelect={false}
                    // value={dateDone}
                    // dateFormat={'MM/dd/yyyy'}
                    value={new Date()}
                    onChange={handleSubscriptionSelection} // onChange={handleDateSelection}
                />
            </Col>{' '}
            <div className="overflow-scroll mt-3" ref={scrollRef} style={{ height: '300px', overflowX: 'hidden' }}>
                {data?.parameters?.map((params: any, i: number) => {
                    return (
                        <Row>
                            <Col xs={12} lg={3}>
                                {i + 1}. <Form.Label>{'Parameters'}</Form.Label>
                                {/* <FormInput
                                    placeholder={'Enter Parameter '}
                                    type="text"
                                    name={'parameter'}
                                    containerClass={'mb-1'}
                                    key="text"
                                /> */}
                                <Select
                                    name="Parameter"
                                    placeholder="Select Parameter"
                                    className="react-select mb-2"
                                    classNamePrefix="react-select"
                                    options={parameterTypes}
                                    onChange={(value) => handleParametersEditing(value, i, 'parameters')}
                                    // value={selected.floor ? selected.floor : null}
                                    // isDisabled={true}
                                />
                            </Col>
                            <Col xs={12} lg={2}>
                                <Form.Label>{'Lower Limits'}</Form.Label>
                                <FormInput
                                    placeholder={'Enter Lower Limits '}
                                    type="text"
                                    name={'lowerLimits'}
                                    containerClass={'mb-1'}
                                    key="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleParametersEditing(e?.target?.value, i, 'lowerLimit')
                                    }
                                />
                            </Col>
                            <Col xs={12} lg={3}>
                                <Form.Label>{'Upper Limit'}</Form.Label>
                                <FormInput
                                    placeholder={'Enter Upper Limit '}
                                    type="text"
                                    name={'upperLimit'}
                                    containerClass={'mb-1'}
                                    key="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleParametersEditing(e?.target?.value, i, 'upperLimit')
                                    }
                                />
                            </Col>
                            <Col xs={12} lg={2}>
                                <Form.Label>{'CalibrationValues'}</Form.Label>
                                <FormInput
                                    placeholder={'Enter Calibration Values '}
                                    type="text"
                                    name={'calibrationValues'}
                                    containerClass={'mb-1'}
                                    key="text"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleParametersEditing(e?.target?.value, i, 'calibrationValue')
                                    }
                                />
                            </Col>
                            {i !== 0 && (
                                <Col xs={12} md={1} className="d-flex justify-content-end align-items-center">
                                    <Button className="mt-3" onClick={() => handleRemoveParamsRow(i)}>
                                        Remove
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    );
                })}
            </div>
            <Row className="d-flex justify-content-end">
                <Col className="d-flex justify-content-end" xs={3}>
                    <Button onClick={handleAddNewParamsRow}> Add new</Button>
                </Col>
            </Row>
        </Fragment>
    );
};
