import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';
import { useRedux } from 'hooks';

type GateWayModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const transformArray = (array: any) => {
    const transformedArray = array?.map((item: any) => {
        return { value: item?.id, label: item?.name };
    });

    return transformedArray;
};
const GateWayModal: React.FC<GateWayModalProps> = (props) => {
    const { appSelector } = useRedux();
    const { customers, buildings, floors, zones } = appSelector((state) => ({
        customers: transformArray(state.Customer.customers),
        buildings: transformArray(state.Building.buildings),
        floors: transformArray(state.Floor.floors),
        zones: transformArray(state.Zone.zones),
    }));

    const validationSchema = yup.object().shape({
        building: yup.string().required('Building selection is required'),
        floorNumber: yup.string().required('Floor selection is required'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const { handleSubmit } = methods;

    const onSubmit = (data: any) => {
        props.onSubmit(data);
        props.onClose();
    };

    const handleSaveForm = handleSubmit(onSubmit);

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header className="text-white" style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title id="contained-modal-title-vcenter">Add GateWay</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSaveForm}>
                    <Form.Group className="mb-1">
                        <Form.Label>Gateway Name</Form.Label>
                        <FormInput
                            placeholder="Enter name"
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
                            options={customers}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            name="buildingId"
                            placeholder="select Building"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={buildings}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Floor</Form.Label>
                        <Select
                            name="floorId"
                            placeholder="Select Floor"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={floors}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Zone</Form.Label>
                        <Select
                            name="zoneId"
                            placeholder="Select Zone"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={zones}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>SSID</Form.Label>
                        <FormInput
                            placeholder="Enter SSID"
                            type="text"
                            name="ssid"
                            containerClass={'mb-1'}
                            key="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Password</Form.Label>
                        <FormInput
                            placeholder="Enter Password"
                            type="text"
                            name="password"
                            containerClass={'mb-1'}
                            key="text"
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

export default GateWayModal;
