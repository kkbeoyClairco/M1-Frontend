import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';

type FloorModalProps = {
    customerlist:any;
    buildinglist:any;
    show: boolean;
    onClose: () => void;
    onSubmit: (event:any,type:string) => void;
};

const FloorModal: React.FC<FloorModalProps> = (props) => {
    
    const customerList = props.customerlist.map((customer: any) => {
        return {
            value: customer.customerId,
            label: customer.name,
        };
    });

    const buildingList = props.buildinglist.map((building: any) => {
        return {
            value: building.buildingId,
            label: building.name,
        };
    });

    const onSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit(event,'floor');
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
            <Modal.Header className='text-white' style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title id="contained-modal-title-vcenter">Add Floor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <Form.Label>Floor Name</Form.Label>
                        <FormInput
                            placeholder='Enter Floor Name'
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
                            options={customerList}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            name="buildingId"
                            placeholder="Select Building"
                            options={buildingList}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
            <Form.Label>Upload Layout Image</Form.Label>
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

export default FloorModal;
