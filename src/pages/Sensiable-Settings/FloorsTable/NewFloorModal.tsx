import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from 'components';
import { useForm } from 'react-hook-form';

type NewFloorModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const  NewFloorModal= (props: NewFloorModalProps) => {
    const validationSchema = yup.object().shape({
        floorName: yup.string().required('Floor Name is required'),
        Cost: yup.string().required('Cost per Sqft is required'),
        Area: yup.string().required('Area is required'),
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
        console.log('data', data);
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
                <Modal.Title id="contained-modal-title-vcenter">Add New Floor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSaveForm}>
                    <FormInput
                        label="Floor Name"
                        type="text"
                        name="floorName"
                        placeholder="Enter Floor Name"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                       <FormInput
                        label="Cost per Sqft"
                        type="text"
                        name="Cost"
                        placeholder="Enter Cost per Sqft"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />    <FormInput
                    label="Area"
                    type="text"
                    name="Area"
                    placeholder="Enter Area in Sqft"
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

                            Add  Floor                        
                               </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default NewFloorModal;