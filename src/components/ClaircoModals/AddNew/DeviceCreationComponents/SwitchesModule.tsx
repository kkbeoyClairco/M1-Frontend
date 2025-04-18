import { FormInput } from 'components/form';
import React, { Fragment } from 'react';
import { Col, Form } from 'react-bootstrap';

export const SwitchesModule = () => {
    return (
        <Fragment key={Date.now()}>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
                <FormInput placeholder={'Enter Name '} type="text" name={'name'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Topic'}</Form.Label>
                <FormInput placeholder={'Enter topic '} type="text" name={'topic'} containerClass={'mb-1'} key="text" />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Fan mode Dict'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Fan mode Dict'}
                    name={'fanmodeDict'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Mode Dict'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter mode Dict'}
                    name={'modeDict'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Key lock Dict'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Key lock Dict'}
                    name={'keylockDict'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Relay One Dict'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Relay One Dict'}
                    name={'relayOneDict'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Relay Two Dict'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Relay Two Dict'}
                    name={'relayTwoDict'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
            <Col style={{ marginTop: '20px' }}>
                {' '}
                <Form.Label>{'Thermostat Dict'}</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder={'Enter Thermostat Dict'}
                    name={'THSTAT'}
                    style={{ width: '100%', height: '8em' }}
                />
            </Col>{' '}
        </Fragment>
    );
};
