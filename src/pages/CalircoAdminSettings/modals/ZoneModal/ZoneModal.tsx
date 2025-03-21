import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';

type ZoneModalProps = {
    customerlist:any;
    buildinglist: any;
    floorlist: any;
    show: boolean;
    onClose: () => void;
    onSubmit: (event: any, type: string) => void;
};

const ZoneModal: React.FC<ZoneModalProps> = (props) => {
    const floorList = props.floorlist.map((floor: any) => {
        return {
            value: floor.id,
            label: floor.name,
        };
    });
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
    const validationSchema = yup.object().shape({
        building: yup.string().required('Building selection is required'),
        floorNumber: yup.string().required('Floor selection is required'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const { handleSubmit } = methods;

    const onSubmit = (event: any) => {
        event.preventDefault();
        props.onSubmit(event, 'zone');
        props.onClose();
    };

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header className="text-white" style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title id="contained-modal-title-vcenter">Add Zone</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <Form.Label>Zone Name</Form.Label>
                        <FormInput
                            placeholder="Enter Zone"
                            type="text"
                            name="name"
                            containerClass={'mb-1'}
                            key="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Customer</Form.Label>
                        <Select name="customerId" placeholder="Select Customer" options={customerList} />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Building Name</Form.Label>
                        <Select name="buildingId" placeholder="Select Building " options={buildingList} />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Floor Name</Form.Label>
                        <Select name="floorId" placeholder="Select Floor " options={floorList} />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Friendly Name</Form.Label>
                        <FormInput
                            placeholder="Enter Friendly name"
                            type="text"
                            name="alias"
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

export default ZoneModal;
