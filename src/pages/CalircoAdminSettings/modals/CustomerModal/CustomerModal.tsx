import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';

type CustomerModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any ,type:string) => void;
};

const CustomerModal: React.FC<CustomerModalProps> = (props) => {
   
    const validationSchema = yup.object().shape({
        building: yup.string().required('Building selection is required'),
        floorNumber: yup.string().required('Floor selection is required'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const {
        handleSubmit,
    } = methods;

    const onSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit(event,'customer');
        props.onClose();
    };

   

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}
        >
            <Modal.Header className='text-white'style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title id="contained-modal-title-vcenter">Add Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <Form.Label>Customer Name</Form.Label>
                        <FormInput
                            placeholder='Enter Customer name'
                            type="text"
                            name="name"
                            containerClass={'mb-1'}
                            key="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
            <Form.Label>Upload Logo Customer</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
            //   onChange={handleFileChange}
            />
          </Form.Group>
                    <Row className="float-end">
                        <Col>
                            <Button type="submit" className='ms-2' style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                SUBMIT
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default CustomerModal;
