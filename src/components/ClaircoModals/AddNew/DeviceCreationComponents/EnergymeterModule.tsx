import { FormInput } from 'components/form';
import React, { Fragment } from 'react';
import { Col, Form } from 'react-bootstrap';

export const EnergymeterModule = () => {
    return (
        <Fragment key={Date.now()}>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
                <FormInput placeholder={'Enter Name '} type="text" name={'name'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Limits'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Limits  in this proper format'}
                    name={'limits'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'CalibrationValues'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter CalibrationValues  in this proper format'}
                    name={'calibrationValues'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'DeviceModal'}</Form.Label>
                <FormInput
                    placeholder={'Enter DeviceModal '}
                    type="text"
                    name={'modelId'}
                    containerClass={'mb-1'}
                    key="text"
                />
            </Col>{' '}
        </Fragment>
    );
};
