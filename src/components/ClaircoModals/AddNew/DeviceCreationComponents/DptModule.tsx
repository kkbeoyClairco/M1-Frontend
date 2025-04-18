import { FormInput } from 'components/form';
import React, { Fragment } from 'react';
import { Col, Form } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';

export const DptModule = () => {
    return (
        <Fragment key={Date.now()}>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
                <FormInput placeholder={'Enter Name '} type="text" name={'name'} containerClass={'mb-1'} key="text" />
            </Col>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Parent Indoor Device'}</Form.Label>
                <Select
                    name={'parentDeviceId'}
                    placeholder={'Select Parent Indoor Device '}
                    className="react-select mb-2"
                    classNamePrefix="react-select"
                    options={[]}
                />
            </Col>{' '}
        </Fragment>
    );
};
