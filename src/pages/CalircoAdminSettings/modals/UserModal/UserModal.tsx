import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';
import { useRedux } from '../../../../hooks';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { device } from 'helpers/api/services/Clairco/device';

type UserModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (
        event: any,
        data: any
        //  type: string
    ) => void;
    data: [];
};

const UserModal: React.FC<UserModalProps> = (props) => {
    const [listOfBuildings, setListOfBuildings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userTypeSelected, setUserTypeSelected] = useState<string>();
    const [customerIdSelected, setCustomerIdSelected] = useState<string>();
    const [buildingIdsSelected, setBuildingIdsSelected] = useState<string[]>([]);
    const [deviceTypeIdsSelected, setDeviceTypeIdsSelected] = useState<string[]>([]);
    const [selectedBuildingName, setSelectedBuildingName] = useState<string[]>([]);
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const { appSelector } = useRedux();
    const deviceTypes = Object.keys(deviceTypeId).map((deviceNames) => ({
        label: deviceNames,
        value: deviceTypeId[deviceNames],
    }));
    const { customerMap, buildingMap, buildings } = appSelector((state) => ({
        customerMap: state.Customer.customers,
        buildingMap: state.Building.buildingMap,
        buildings: state.Building.buildings ?? [],
    }));
    const customerlist = Array.from(customerMap, (doc: any) => ({ value: doc?.customerId, label: doc?.name }));
    const buildinglist = Array.from(buildingMap, ([key, value]) => ({ value: key, label: value }));
    // console.log('Custoemr list', customerlist);
    const userType = [
        // { label: 'Admin', value: 'Admin' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Building Manager', value: 'BuildingManager' },
    ];

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
        event.stopPropagation();
        const newUserDetails = {
            type: userTypeSelected,
            name: userName,
            phone: phoneNumber,
            email: email,
            password: password,
            customerId: customerIdSelected,
            buildingIds: buildingIdsSelected,
            assignedDeviceTypes: deviceTypeIdsSelected,
        };
        console.log('Submit', newUserDetails);
        props.onSubmit(event, newUserDetails);
        // props.onClose();
    };
    const handleCustomerSelection = (e: any) => {
        try {
            setCustomerIdSelected(e?.value);
        } catch (error) {
            console.log(error);
        }
    };
    const handleBuildingSelection = (e: any) => {
        try {
            const buildingIds = e?.map((doc: any) => doc.value);
            const buildingNames = e?.map((doc: any) => doc.label);

            setBuildingIdsSelected([...buildingIds]);
            setSelectedBuildingName([...e]);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeviceTypeSelection = (e: any) => {
        try {
            const deviceTypes = e?.map((doc: any) => doc.value);
            setDeviceTypeIdsSelected([...deviceTypes]);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUserTypeSelection = (e: any) => {
        try {
            // console.log('Entered e', e);
            setUserTypeSelected(e?.value);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setBuildingIdsSelected(() => []);
        setSelectedBuildingName(() => []);
        const buildingsList = buildings
            .filter((building: any) => building.customerId === customerIdSelected)
            ?.map((building: any) => {
                const formattedBuilding = {
                    label: building?.name,
                    value: building?.id,
                };
                return formattedBuilding;
            });
        setListOfBuildings(buildingsList);
    }, [customerIdSelected]);
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header className="text-white" style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <Form.Label>User Type</Form.Label>
                        <Select
                            name="type"
                            placeholder="Select User Type"
                            options={userType}
                            onChange={handleUserTypeSelection}
                            // isLoading={true}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Customer</Form.Label>
                        <Select
                            name="customerId"
                            placeholder="Select Customer"
                            options={customerlist}
                            onChange={handleCustomerSelection}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            isMulti
                            name="buildingId"
                            className="basic-multi-select"
                            placeholder="Select Building"
                            options={listOfBuildings}
                            value={selectedBuildingName}
                            onChange={handleBuildingSelection}
                        />
                    </Form.Group>{' '}
                    <Form.Group className="mb-1">
                        <Form.Label>Device types</Form.Label>
                        <Select
                            isMulti
                            name="deviceTypeIds"
                            className="basic-multi-select"
                            placeholder="Select DeviceType"
                            options={deviceTypes}
                            onChange={handleDeviceTypeSelection}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Name</Form.Label>
                        <FormInput
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            containerClass={'mb-1'}
                            // register={register}
                            key="text"
                            onChange={(e: any) => setUserName(e.target.value)}
                            // autocomplete={'off'}
                            // errors={errors}
                            // control={control}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Phone Number</Form.Label>
                        <FormInput
                            name="phone"
                            placeholder="Enter Phone Number"
                            className="react-select"
                            onChange={(e: any) => setPhoneNumber(e.target.value)}

                            // classNamePrefix="react-select"
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Email ID</Form.Label>
                        <FormInput
                            name="email"
                            placeholder="Enter email id"
                            className="react-select"
                            // classNamePrefix="react-select"
                            onChange={(e: any) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Password</Form.Label>
                        <FormInput
                            name="password"
                            placeholder="Enter Password"
                            className="react-select"
                            // type="password"
                            // classNamePrefix="react-select"
                            // options={Buildings}
                            onChange={(e: any) => setPassword(e?.target?.value)}
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

export default UserModal;
