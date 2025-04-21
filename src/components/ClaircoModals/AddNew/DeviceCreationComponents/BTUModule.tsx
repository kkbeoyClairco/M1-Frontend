import { FormInput } from 'components/form';
import React, { Fragment } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';
interface BTUModuleInterface {
    data?: {
        name?: string;
        alias?: string;
        gatewayId?: string;
        parameters?: any;
        limits?: any;
        calibrationValues?: any;
    };
    onChange?: (value: any) => void;
}
export const BTUModule: React.FC<BTUModuleInterface> = ({ data, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const newValue = e.target.value;
        const { name, value } = e.target;
        if (onChange) onChange({ ...data, [name]: value });
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
                    onChange={handleInputChange}
                    value={data?.name ?? ''}
                />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Alias'}</Form.Label>
                <FormInput placeholder={'Enter Alias '} type="text" name={'alias'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'GateWay Id'}</Form.Label>
                <FormInput
                    placeholder={'Enter GateWay Id '}
                    type="text"
                    name={'gatewayId'}
                    containerClass={'mb-1'}
                    key="text"
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
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Limits'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Limits  in this proper format'}
                    name={'limits'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'CalibrationValues'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter CalibrationValues  in this proper format'}
                    name={'calibrationValues'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>
        </Fragment>
    );
};
