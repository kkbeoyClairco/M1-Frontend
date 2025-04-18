import { FormInput } from 'components/form';
import React, { Fragment } from 'react';
import { Col, Form } from 'react-bootstrap';

export const OccupancyModule = () => {
    return (
        <Fragment key={Date.now()}>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
                <FormInput placeholder={'Enter Name '} type="text" name={'name'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'DeviceModal ID'}</Form.Label>
                <FormInput
                    placeholder={'Enter DeviceModal ID '}
                    type="text"
                    name={'modelId'}
                    containerClass={'mb-1'}
                    key="text"
                />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Parent Indoor Device'}</Form.Label>
                <FormInput
                    placeholder={'Enter Parent Indoor Device '}
                    type="text"
                    name={'parentDeviceId'}
                    containerClass={'mb-1'}
                    key="text"
                />
            </Col>{' '}
        </Fragment>
    );
};
