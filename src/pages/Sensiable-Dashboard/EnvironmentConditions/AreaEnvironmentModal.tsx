import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Buildings, Floors ,Seats,Unit} from 'pages/EnvironmentAnalytics/data';

type AreaEnvironmentModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const AreaEnvironmenModal: React.FC<AreaEnvironmentModalProps> = (props) => {
    const validationSchema = yup.object().shape({
        // building: yup.string().required('Building selection is required'),
        // floorNumber: yup.string().required('Floor selection is required'),
    });


    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = (data: any) => {
        props.onSubmit(data);
        console.log('data', data);
        props.onClose();
    };

    const handleSaveForm = handleSubmit(onSubmit);

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}
        >
            <Modal.Header className='bg-primary text-white' closeButton>
                <Modal.Title id="contained-modal-title-vcenter">AREA SELECTION</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSaveForm}>
                    <Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            name="building"
                            placeholder="Select Building"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Buildings}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Floor</Form.Label>
                        <Select
                            name="floorNumber"
                            placeholder="Select Floor"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Floors}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Seat Type</Form.Label>
                        <Select
                            name="Seat Type"
                            placeholder="Select Seat Type"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Seats}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Business Unit</Form.Label>
                        <Select
                            name="Business Unit"
                            placeholder="Select Business Unit"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Unit}
                        />
                    </Form.Group>
                    <Row className="float-end">
                        <Col>
                            <Button type="submit" className='ms-2'>
                                SUBMIT
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default AreaEnvironmenModal;
