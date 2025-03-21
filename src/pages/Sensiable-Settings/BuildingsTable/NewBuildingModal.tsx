import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from 'components';
import { useForm } from 'react-hook-form';

type NewBuildingModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const  NewBuildingModal= (props: NewBuildingModalProps) => {
    const validationSchema = yup.object().shape({
        buildingName: yup.string().required('Building Name is required'),
        city: yup.string().required('City is required'),
        costPerSqft: yup.string().required('costPerSqft is required'),
        numberOfFloors: yup.string().required('numberOfFloors required'),


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
                <Modal.Title id="contained-modal-title-vcenter">Add Building</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSaveForm}>
                    <FormInput
                        label="Building Name"
                        type="text"
                        name="buildingName"
                        placeholder="Enter Building Name"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                    <FormInput
                        label="City"
                        type="text"
                        name="city"
                        placeholder="Enter City"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                     <FormInput
                        label="Cost per Sqft"
                        type="text"
                        name="costPerSqft"
                        placeholder="Enter Cost per Sqft"
                        containerClass={'mb-3'}
                        register={register}
                        errors={errors}
                        control={control}
                    />
                       <FormInput
                        label="Number of Floors"
                        type="text"
                        name="numberOfFloors"
                        placeholder="Enter Number of Floors"
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
Add Building                            

</Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default NewBuildingModal;