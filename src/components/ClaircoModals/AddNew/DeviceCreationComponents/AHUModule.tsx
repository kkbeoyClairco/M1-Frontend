import { FormInput } from 'components/form';
import React, { Fragment } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import ParameterAdditionAHU from './ParameterAdditionAHU';

export const AHUModule = () => {
    return (
        <Fragment key={Date.now()}>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
                <FormInput placeholder={'Enter Name '} type="text" name={'name'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Alias'}</Form.Label>
                <FormInput placeholder={'Enter Alias '} type="text" name={'alias'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'GateWay Id'}</Form.Label>
                <FormInput
                    placeholder={'Enter GateWay Id '}
                    type="text"
                    disabled
                    name={'gatewayId'}
                    containerClass={'mb-1'}
                    key="text"
                />
            </Col>{' '}
            {<ParameterAdditionAHU />}
        </Fragment>
    );
};
