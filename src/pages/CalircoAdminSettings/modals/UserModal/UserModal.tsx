import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select, { MultiValue } from 'react-select';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';
import { useRedux } from '../../../../hooks';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { device } from 'helpers/api/services/Clairco/device';
import { convertToObject, forEachChild, isMethodSignature } from 'typescript';
import { controlVrfVrcStateAPI } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import { building, customer } from 'helpers/api/services/Clairco/customer';
import { convertUnixToISTForTable } from 'utils/claircoFunctions';
import { selectTagType } from 'types/selectTagType';
import { userValidationSchema } from 'pages/CalircoAdminSettings/utils/validations';
import { toast } from 'sonner';
type ErrorState = {
    type: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    password: string | null;
    customerId: string | null;
    buildingIds: string | null;
    assignedDeviceTypes: string | null;
};

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
    const [buildingsList, setBuildingsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userTypeSelected, setUserTypeSelected] = useState<string>();
    const [customersList, setCustomersList] = useState([]);
    const [customerIdSelected, setCustomerIdSelected] = useState<string>();
    const [deviceTypeIdsSelected, setDeviceTypeIdsSelected] = useState<string[]>([]);
    // const [buildingIdsSelected, setBuildingIdsSelected] = useState<string[]>([]);
    // const [selectedBuildingName, setSelectedBuildingName] = useState<string[]>([]);
    const [buildingsSelected, setBuildingsSelected] = useState<selectTagType[] | null>();
    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [error, setError] = useState<ErrorState>({
        type: null,
        name: null,
        phone: null,
        email: null,
        password: null,
        customerId: null,
        buildingIds: null,
        assignedDeviceTypes: null,
    });
    // const { appSelector } = useRedux();
    const deviceTypes = Object.keys(deviceTypeId).map((deviceNames) => ({
        label: deviceNames,
        value: deviceTypeId[deviceNames],
    }));
    // const { customerMap, buildingMap, buildings } = appSelector((state) => ({
    //     customerMap: state.Customer.customers,
    //     buildingMap: state.Building.buildingMap,
    //     buildings: state.Building.buildings ?? [],
    // }));
    // const customerlist = Array.from(customerMap, (doc: any) => ({ value: doc?.customerId, label: doc?.name }));
    // const buildinglist = Array.from(buildingMap, ([key, value]) => ({ value: key, label: value }));
    // console.log('Custoemr list', customerlist);
    const userType = [
        // { label: 'Admin', value: 'Admin' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Building Manager', value: 'BuildingManager' },
    ];

    // const validationSchema = yup.object().shape({
    //     building: yup.string().required('Building selection is required'),
    //     // floorNumber: yup.string().required('Floor selection is required'),
    // });

    // const methods = useForm({
    //     resolver: yupResolver(validationSchema),
    // });
    // console.log('User methods', methods);
    // const { handleSubmit } = methods;

    const getAllCustomers = async () => {
        try {
            const response = await customer.all();
            const formattedData = response?.data?.map((customerData: { name: string; id: string }) => ({
                label: customerData?.name ?? '',
                value: customerData?.id ?? '',
            }));
            // console.log('Get alll customers', formattedData);
            setCustomersList(formattedData ?? []);
        } catch (error: any) {
            console.log(error);
            toast.error('Oops! We couldn’t retrieve the customer list. Please close the pop-up and try again');
        }
    };
    const getBuildingsWithCustomerId = async (customerId: string) => {
        try {
            const response = await building.byCustomerId({ customerId });
            const formattedData = response?.data?.map((buildingData: { name: string; id: string }) => ({
                label: buildingData.name,
                value: buildingData.id,
            }));
            setBuildingsList(formattedData ?? []);
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        // console.log('Event', event);
        const buildingsArray = buildingsSelected?.map((building) => building.value);
        const newUserDetails = {
            type: userTypeSelected ?? '',
            name: userName ?? '',
            phone: phoneNumber ?? '',
            email: email ?? '',
            password: password ?? '',
            customerId: customerIdSelected ?? '',
            buildingIds: buildingsArray ?? [],
            assignedDeviceTypes: deviceTypeIdsSelected ?? '',
        };
        userValidationSchema
            .validate(newUserDetails, { abortEarly: false })
            .then((res: any) => {
                console.log('Validation helper', res);
                Object.keys(res).forEach((field: string) => setError((prev) => ({ ...prev, [field]: null })));
            })
            .catch((err) => {
                console.log(err.inner);
                err.inner?.forEach((validationError: yup.ValidationError) => {
                    setError((prev) => ({
                        ...prev,
                        [validationError.path as keyof ErrorState]: validationError.message,
                    }));
                });
            });
        console.log('Submit', newUserDetails);
        // props.onSubmit(event, newUserDetails);
        // props.onClose();
    };
    const handleCustomerSelection = async (e: any) => {
        try {
            await userValidationSchema
                .validateAt('customerId', { customerId: e.value ?? '' })
                .then((res) => {
                    console.log('Customer Id', res);
                    setError((prev) => ({ ...prev, customerId: null }));
                })
                .catch((error) => console.log(error));
            // console.log('Validation Response', validateRes);
            setCustomerIdSelected(e?.value);
            getBuildingsWithCustomerId(e.value);
            // setError;
        } catch (error) {
            console.log(error);
        }
    };
    const handleBuildingSelection = async (e: any) => {
        try {
            await userValidationSchema
                .validateAt('customerId', { buildingIds: e.value ?? '' })
                .then((res) => {
                    console.log('Customer Id', res);
                    setError((prev) => ({ ...prev, buildingIds: null }));
                })
                .catch((error) => console.log(error));
            setBuildingsSelected(e);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeviceTypeSelection = async (e: MultiValue<selectTagType>) => {
        try {
            // const deviceIDs = e?.map((device) => device.value);
            const deviceTypes = e?.map((doc: any) => doc?.value);
            console.log('Device type selection', deviceTypes);
            await userValidationSchema
                .validateAt('assignedDeviceTypes', { assignedDeviceTypes: deviceTypes })
                .then((res) => {
                    console.log('assignedDeviceTypes Id', res);
                    setError((prev) => ({ ...prev, assignedDeviceTypes: null }));
                })
                .catch((error) => setError((prev) => ({ ...prev, assignedDeviceTypes: error.message })));

            setDeviceTypeIdsSelected([...deviceTypes]);
        } catch (error) {
            console.log(error);
        }
    };
    const handleUserTypeSelection = async (e: any) => {
        try {
            // console.log('Entered e', e);
            await userValidationSchema
                .validateAt('type', { type: e?.value })
                .then((res) => {
                    console.log('type Id', res);
                    setError((prev) => ({ ...prev, type: null }));
                })
                .catch((error) => setError((prev) => ({ ...prev, type: error.message })));

            setUserTypeSelected(e?.value);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNameInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            console.log('Name', e?.target?.value);
            await userValidationSchema
                .validateAt('name', { name: e?.target?.value ?? '' })
                .then((res) => {
                    setError((prev) => ({ ...prev, name: null }));
                })
                .catch((error) => setError((prev) => ({ ...prev, name: error.message })));

            setUserName(e.target.value);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setBuildingsSelected(null);
    }, [customerIdSelected]);
    useEffect(
        function testFn() {
            console.log('Building Seelcted', buildingsSelected);
        },
        [buildingsSelected]
    );
    useEffect(function intialPageLoadApiCalls() {
        getAllCustomers();
    }, []);
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
                            isClearable={true}
                        />
                        {error?.type && <p className="text-danger">{error.type}</p>}
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Customer</Form.Label>
                        <Select
                            name="customerId"
                            placeholder="Select Customer"
                            options={customersList}
                            onChange={handleCustomerSelection}
                        />{' '}
                        {error?.customerId && <p className="text-danger">{error.customerId}</p>}
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            isMulti
                            name="buildingId"
                            className="basic-multi-select"
                            placeholder="Select Building"
                            options={buildingsList}
                            value={buildingsSelected}
                            onChange={handleBuildingSelection}
                        />{' '}
                        {error?.buildingIds && <p className="text-danger">{error.buildingIds}</p>}
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
                        />{' '}
                        {error?.assignedDeviceTypes && <p className="text-danger">{error.assignedDeviceTypes}</p>}
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
                            onChange={handleNameInput}
                            // autocomplete={'off'}
                            // errors={errors}
                            // control={control}
                        />{' '}
                        {error?.name && <p className="text-danger">{error.name}</p>}
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
                        />{' '}
                        {error?.password && <p className="text-danger">{error.password}</p>}
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
