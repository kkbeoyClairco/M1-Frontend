import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from 'components';
import { useForm } from 'react-hook-form';

type SeatTypeModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const  SeatTypeModal= (props: SeatTypeModalProps) => {
    const validationSchema = yup.object().shape({
        seatType: yup.string().required('Seat Name is required'),
        area: yup.string().required('Area in Sqft is required'),
        discription: yup.string().required('Description is required'),
    });

    const methods = useForm({
        resolver: yupResolver(validationSchema),
    });

    const {
       handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    const onSubmit = (data: any) => {
        props.onSubmit(data);
        props.onClose();
    };

    const handleSaveForm = handleSubmit(onSubmit);
    const handleBackButtonClick = () => {
        props.onClose(); 
    };

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header className='bg-primary text-white' closeButton >
                <Modal.Title id="contained-modal-title-vcenter">Add New Seat Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSaveForm}>
                    <FormInput
                        label="Seat Type"
                        type="text"
                        name="seatType"
                        placeholder="Enter Seat Type Name"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                    <FormInput
                        label="Area"
                        type="text"
                        name="area"
                        placeholder="Enter Area In Sqft"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                     <FormInput
                        label="Discription"
                        type="text"
                        name="discription"
                        placeholder="Enter Discription "
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                     
                    <Row className="float-end">
                        <Col>
                        <Button type="button" className='bg-grey' onClick={handleBackButtonClick}>
                                Back
                            </Button>
                            <Button type="submit" className='ms-2'>
                                Add Seat Type
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default SeatTypeModal;