import { FormInput } from 'components/form';
import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';
import { selectTagType } from 'types/selectTagType';
interface BTUModuleInterface {
    data?: {
        name?: string;
        alias?: string;
        limits?: number | string;
        calibrationValues?: number | string;
    };
    // gateWayList: selectTagType[];
    onChange?: (value: any) => void;
    error?: {
        limits?: number;
        calibrationValues?: number;
        name?: string;
        alias?: string;
    };
}
export const BTUModule: React.FC<BTUModuleInterface> = ({ data, onChange, error }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const newValue = e.target.value;
        const { name, value } = e.target;
        if (onChange) onChange({ ...data, [name]: value });
    };
    // const getGatewayList = async () => {
    //     try {
    //         // const res=await getGatewayListAPI()
    //         // return res?.data
    //         // const gatewayFormattedData = gatewayList.map((data: any) => ({
    //         //     label: data?.name ?? '',
    //         //     value: data?.id ?? '',
    //         // }));
    //         // setGateWayList(gatewayFormattedData);
    //         if (1) return [];
    //     } catch (error) {
    //         return [];
    //     }
    // };
    // useEffect(function getGatewayListData() {
    //     getGatewayList();
    // }, []);
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
                    onChange={handleInputChange}
                    value={data?.name ?? ''}
                />
                {error?.name && <p className="text-danger">{error.name}</p>}
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Alias'}</Form.Label>
                <FormInput
                    placeholder={'Enter Alias '}
                    type="text"
                    name={'alias'}
                    containerClass={'mb-1'}
                    key="text"
                    value={data?.alias ?? ''}
                    onChange={handleInputChange}
                />{' '}
                {error?.alias && <p className="text-danger">{error.alias}</p>}
            </Col>
            {/* <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'GateWay'}</Form.Label>

                <Select
                    name={'gatewayId'}
                    placeholder={'Select gateway'}
                    className="react-select mb-2"
                    classNamePrefix="react-select"
                    options={gateWayList}
                />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Parameters'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Parameters  in this proper format'}
                    name={'parameters'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col> */}
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Limits'}</Form.Label>
                <FormInput
                    placeholder={'Enter Limits '}
                    type="number"
                    name={'limits'}
                    containerClass={'mb-1'}
                    key="limits"
                    value={data?.limits ?? ''}
                    onChange={handleInputChange}
                />
                {error?.limits && <p className="text-danger">{error.limits}</p>}
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Calibration Values'}</Form.Label>
                <FormInput
                    placeholder={'Enter Calibration Values '}
                    type="number"
                    name={'calibrationValues'}
                    containerClass={'mb-1'}
                    key="calibrationValue"
                    value={data?.calibrationValues ?? ''}
                    onChange={handleInputChange}
                />

                {error?.calibrationValues && <p className="text-danger">{error.calibrationValues}</p>}
            </Col>
        </Fragment>
    );
};
