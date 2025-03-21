import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';
import { useRedux } from 'hooks';

type BuildingModalProps = {
    customerlist:any;
    show: boolean;
    onClose: () => void;
    onSubmit: (event: any,type:string) => void;
};

const BuildingModal: React.FC<BuildingModalProps> = (props) => {
    
    const customerList = props.customerlist.map((customer:any)=>{
        return {value:customer.customerId, label:customer.name}
    });
    const onSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit(event,'building');
        props.onClose();
    };

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title className="text-white"> Add Building</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <Form.Label>Building Name</Form.Label>
                        <FormInput
                            placeholder="Enter Building Name"
                            type="text"
                            name="name"
                            containerClass={'mb-1'}
                            key="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Customer</Form.Label>
                        <Select
                            name="customerId"
                            placeholder="Select Customer"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={customerList}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Building Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            
                        />
                    </Form.Group>
                   
                   
                    <Form.Group className="mb-1">
                        <Form.Label>Cost of Energy</Form.Label>
                        <FormInput
                            placeholder="Enter Cost of Energy"
                            type="text"
                            name="costOfEnergy"
                            containerClass={'mb-1'}
                            key="text"
                            errors={Error}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Cost Per Sq.Ft.</Form.Label>
                        <FormInput
                            placeholder="Enter Cost Per Sq.Ft."
                            type="text"
                            name="costPerSqFt"
                            containerClass={'mb-1'}
                            key="text"
                            errors={Error}
                        />
                    </Form.Group>
                    <Row className="float-end">
                        <Col>
                            <Button
                                type="submit"
                                className="ms-2"
                                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                SUBMIT
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default BuildingModal;
