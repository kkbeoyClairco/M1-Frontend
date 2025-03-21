import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Card, Col, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Uploadlayoutimage from 'assets/images/sensiable/Uploadlayoutimage.svg'

type IconModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const IconModal = (props: IconModalProps) => {
    const validationSchema = yup.object().shape({

    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const {
        handleSubmit,
    } = methods;

    const onSubmit = (data: any) => {
        props.onSubmit(data);
        console.log('data', data);
        props.onClose();
    };

    const handleSaveForm = handleSubmit(onSubmit);
    const handleRemoveImageButtonClick = () => {
        props.onClose();
    };
    const handleSelectImageButtonClick = () => {

    };
    const handleSaveImageButtonClick = () => {

    };
    const handleBackButtonClick = () => {
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
            <Modal.Header className="bg-primary text-white" closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Upload Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSaveForm}>
                    <Card>
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Row>
                                    <Col xs={3}>
                                        <div className="d-flex flex-column">
                                            <Button
                                                type="button"
                                                className="bg-grey mb-2"
                                                style={{ width: '90px' }}
                                                onClick={handleSelectImageButtonClick}

                                            >
                                                Select Image
                                            </Button>
                                            <Button
                                                type="button"
                                                className="bg-grey mb-2"
                                                style={{ width: '90px' }}
                                                onClick={handleSaveImageButtonClick}
                                            >
                                                Save Image
                                            </Button>
                                            <Button
                                                type="button"
                                                className="mb-2"
                                                style={{ width: '90px', background: 'red' }}
                                                onClick={handleRemoveImageButtonClick}
                                                
                                            >
                                                Remove Image
                                            </Button>
                                            <Button
                                        type="button"
                                        className="mb-2"
                                        style={{ width: '92px', height: '50px', backgroundColor: '#6C757D' }}
                                        onClick={handleBackButtonClick}
                                    >
                                        Back
                                    </Button>
                                        </div>
                                    </Col>
                                    <Col xs={9}>
                                        <div className='text-center'>
                                            <img src={Uploadlayoutimage}
                                             alt=''
                                             />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default IconModal;
