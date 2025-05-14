import { FormInput } from 'components/form';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const ParameterAdditionAHU = () => {
    return (
        <div>
            <Row>
                <Col xs={3} style={{ marginTop: '20px' }}>
                    <Form.Label>{'Parameters'}</Form.Label>
                    <FormInput
                        placeholder={'Enter Parameter name '}
                        type="text"
                        name={'Parameter'}
                        containerClass={'mb-1'}
                        key="text"
                    />
                </Col>{' '}
                <Col xs={3} style={{ marginTop: '20px' }}>
                    <Form.Label>{'Register'}</Form.Label>
                    <FormInput
                        placeholder={'Enter registers '}
                        type="text"
                        name={'Register'}
                        containerClass={'mb-1'}
                        key="text"
                    />
                </Col>{' '}
                <Col xs={3} style={{ marginTop: '20px' }}>
                    {' '}
                    <Form.Label>{'Limits'}</Form.Label>
                    <FormInput
                        placeholder={'Enter Limits  in this proper format'}
                        type="text"
                        name={'limits'}
                        containerClass={'mb-1'}
                        key="text"
                    />
                    {/* <Form.Control
                        as="textarea"
                        placeholder={'Enter Limits  in this proper format'}
                        name={'limits'}
                        style={{ width: '100%', height: '8em' }}
                    /> */}
                </Col>{' '}
                <Col xs={3} style={{ marginTop: '20px' }}>
                    {' '}
                    <Form.Label>{'Calibration Values'}</Form.Label>
                    <FormInput
                        placeholder={'Enter CalibrationValues  in this proper format'}
                        name={'calibrationValues'}
                        type="text"
                        containerClass={'mb-1'}
                        key="text"
                    />
                    {/* <Form.Control
                        as="textarea"
                        placeholder={'Enter CalibrationValues  in this proper format'}
                        name={'calibrationValues'}
                        style={{ width: '100%', height: '8em' }}
                    /> */}
                </Col>{' '}
            </Row>
        </div>
    );
};

export default ParameterAdditionAHU;
