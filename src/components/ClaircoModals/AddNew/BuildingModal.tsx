import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { FormInput } from 'components';
import { toast } from 'sonner';

type BuildingModalProps = {
    data?: {
        name: string;
        id: string;
    };
    customerlist?: Array<{
        label: string;
        value: string;
    }>;
    // selectedCustomer?: string;
    show: boolean;
    onClose: () => void;
    onSubmit: (event: any, type: string) => void;
};

const BuildingModal: React.FC<BuildingModalProps> = (props) => {
    const [buildingImage, setBuildingImage] = useState<File | null>(null);
    // const customerList = props.customerlist?.map((customer: any) => {
    //     return { value: customer?.customerId ?? '', label: customer?.name ?? '' };
    // });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBuildingImage(e.target.files[0]);
        }
    };
    const onSubmit = (event: any) => {
        try {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            if (props?.data) formData.append('customerId', props.data?.id);
            // console.log('Building IMage', event.target, formData);
            if (buildingImage) {
                formData.append('file', buildingImage);
            }
            props.onSubmit(formData, 'Building');
            props.onClose();
        } catch (error) {
            toast.error('Building not added. Something went wrong.');
        }
    };

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center text-dark"
            centered
            onHide={props.onClose}>
            <Modal.Header
                className="justify-content-center"
                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title className="text-white text-center"> Add Building </Modal.Title>
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

                    <Form.Group className="mb-1 mt-2">
                        {' '}
                        <Form.Label>Customer</Form.Label>
                        {/* {props?.selectedCustomer ? ( */}
                        <Select
                            name="customerId"
                            placeholder="Select Customer"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={props?.customerlist ?? undefined}
                            value={props.data ? { label: props.data?.name, value: props.data?.id } : undefined}
                            isDisabled={props.data ? true : false}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Upload Building Image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
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
