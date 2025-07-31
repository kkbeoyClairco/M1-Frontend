import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import Select, { MultiValue } from 'react-select';
import { FormInput } from 'components';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { building, customer } from 'helpers/api/services/Clairco/customer';
import { selectTagType } from 'types/selectTagType';
import { user } from 'helpers/api/services/Clairco/user';
import { userValidationSchema, CustomerTypevalidationSchema, BuildingTypevalidationSchema } from 'pages/CalircoAdminSettings/utils/validations';
import { toast } from 'sonner';

type ErrorState = {
    type: string | null;
    name: string | null;
    email: string | null;
    password: string | null;
    customerId: string | null;
    buildingId: string | null;
    deviceType: string | null;
    access: any
};

type UserModalProps = {
    show: boolean;
    onClose: () => void;
    setUserTableData: React.Dispatch<React.SetStateAction<any[]>>;
    data: [];
};

const UserModal: React.FC<UserModalProps> = (props) => {
    const [buildingsList, setBuildingsList] = useState([]);
    const [userTypeSelected, setUserTypeSelected] = useState<string>();
    const [customersList, setCustomersList] = useState([]);
    const [customerSelected, setCustomerSelected] = useState<{ name: string; customerId: string }>({ name: '', customerId: '' });
    const [deviceTypeIdsSelected, setDeviceTypeIdsSelected] = useState<{ type: string, id: string }[]>([]);
    const [buildingsSelected, setBuildingsSelected] = useState<{ name: string, buildingId: string } | null>({ name: '', buildingId: '' });
    const [userName, setUserName] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<ErrorState>({
        type: null,
        name: null,
        email: null,
        password: null,
        customerId: null,
        buildingId: null,
        deviceType: null,
        access: null
    });
    const deviceType = Object.keys(deviceTypeId).map((deviceNames) => ({
        label: deviceNames,
        value: deviceTypeId[deviceNames],
    }));
    const userType = [
        // { label: 'Admin', value: 'Admin' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Building Manager', value: 'Building Manager' },
    ];

    const getAllCustomers = async () => {
        try {
            const response = await customer.all();
            const formattedData = response?.data?.records.map((customerData: { name: string; id: string }) => ({
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

    async function validateForm(validationSchema: any, newUserDetails: any, event: any) {
        await validationSchema
            .validate(newUserDetails, { abortEarly: false })
            .then((res: any) => {
                Object.keys(res).forEach((field: string) => setError((prev) => ({ ...prev, [field]: null })));
                props.onClose();
            })
            .catch((err: any) => {
                err.inner?.forEach((validationError: yup.ValidationError) => {
                    setError((prev) => ({
                        ...prev,
                        [validationError.path as keyof ErrorState]: validationError.message,
                    }));
                });
            });
    }

    const onSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            // console.log('Event', event);
            const newUserDetails: any = {
                type: userTypeSelected?.trim() ?? '',
                name: userName?.trim() ?? '',
                email: email?.trim() ?? '',
                password: password?.trim() ?? '',
                customerId: customerSelected?.customerId ?? '',
                access: [{
                    customerId: customerSelected?.customerId ?? '',
                    name: customerSelected?.name ?? '',
                }]
            };
            switch (newUserDetails.type) {
                case 'Customer':
                    newUserDetails.access[0].buildings = [];
                    newUserDetails.access[0].deviceType = [...deviceTypeIdsSelected];
                    // validateForm(CustomerTypevalidationSchema,newUserDetails,event);
                    break;
                case 'Building Manager':
                    newUserDetails.buildingId = buildingsSelected?.buildingId ?? '';
                    newUserDetails.access[0].buildings = [{
                        buildingId: buildingsSelected?.buildingId ?? '',
                        name: buildingsSelected?.name ?? '',
                        deviceType: [...deviceTypeIdsSelected]
                    }];
                    // validateForm(BuildingTypevalidationSchema,newUserDetails,event);
                    break;
                default:
                    break;
            }
            const newUserData = await user.create(newUserDetails);
            if (newUserData) {
                toast.success(newUserData?.data.message ?? 'User created successfully');
                props.setUserTableData((prevData: any) => [{ ...newUserData.data.user }, ...prevData]);
                props.onClose();
            }
        } catch (error: any) {
            toast.error(error);
        }
    };

    // Customer Selection
    const handleCustomerSelection = async (e: any) => {
        try {
            await userValidationSchema
                .validateAt('customerId', { customerId: e.value ?? '' })
                .then((res) => {

                    setError((prev) => ({ ...prev, customerId: null }));
                })
                .catch((error) => console.log(error));
            setCustomerSelected({ "name": e?.label, "customerId": e?.value });
            if (userTypeSelected === 'Building Manager') {
                getBuildingsWithCustomerId(e.value);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // Building Selection
    const handleBuildingSelection = async (e: any) => {
        try {

            await userValidationSchema
                .validateAt('buildingId', { buildingId: e?.value ?? '' })
                .then((res) => {
                    setError((prev) => ({ ...prev, buildingId: null }));
                })
                .catch((error) => {
                    setError((prev) => ({ ...prev, buildingId: error.message }));

                    console.log(error);
                });
            setBuildingsSelected({ "name": e?.label, "buildingId": e?.value });
        } catch (error) {
            console.log(error);
        }
    };

    // Device Types selection
    const handleDeviceTypeSelection = async (e: MultiValue<selectTagType>) => {
        try {
            // const deviceIDs = e?.map((device) => device.value);
            const deviceTypes: { type: string; id: string }[] = e?.map((doc: any) => {
                return { type: doc.label, id: doc.value };
            });
            await userValidationSchema
                .validateAt('deviceType', { deviceType: deviceTypes })
                .then((res) => {
                    setError((prev) => ({ ...prev, deviceType: null }));
                })
                .catch((error) => setError((prev) => ({ ...prev, deviceType: error.message })));

            setDeviceTypeIdsSelected([...deviceTypes]);
        } catch (error) {
            console.log(error);
        }
    };

    // User Type Selection
    const handleUserTypeSelection = async (e: any) => {
        try {
            // console.log('Entered e', e);
            await userValidationSchema
                .validateAt('type', { type: e?.value })
                .then((res) => {
                    setError((prev) => ({ ...prev, type: null }));
                })
                .catch((error) => setError((prev) => ({ ...prev, type: error.message })));

            setUserTypeSelected(e?.value);
        } catch (error) {
            console.log(error);
        }
    };
    // Name Input``
    const handleNameInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const sanitizedInput = e?.target?.value;

            await userValidationSchema
                .validateAt('name', { name: sanitizedInput ?? '' })
                .then(() => {
                    setError((prev) => ({ ...prev, name: null }));
                })
                .catch((error) => setError((prev) => ({ ...prev, name: error.message })));

            setUserName(sanitizedInput);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePasswordInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const sanitizedInput = e?.target?.value;
            await userValidationSchema
                .validateAt('password', { password: sanitizedInput ?? '' })
                .then((res) => {
                    setError((prev) => ({ ...prev, password: null }));
                })
                .catch((error) => {
                    setError((prev) => ({ ...prev, password: error.message }));
                });

            setPassword(e?.target?.value);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setBuildingsSelected(null);
    }, [customerSelected]);
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
                    {userTypeSelected === 'Building Manager' && (<Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            name="buildingId"
                            placeholder="Select Building"
                            options={buildingsList}
                            onChange={handleBuildingSelection}
                        />{' '}
                        {error?.buildingId && <p className="text-danger">{error.buildingId}</p>}
                    </Form.Group>)}

                    <Form.Group className="mb-1">
                        <Form.Label>Device types</Form.Label>
                        <Select
                            isMulti
                            name="deviceTypeIds"
                            className="basic-multi-select"
                            placeholder="Select DeviceType"
                            options={deviceType}
                            onChange={handleDeviceTypeSelection}
                        />{' '}
                        {error?.deviceType && <p className="text-danger">{error.deviceType}</p>}
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
                        <Form.Label>Email ID</Form.Label>
                        <FormInput
                            name="email"
                            placeholder="Enter email id"
                            className="react-select"
                            // classNamePrefix="react-select"
                            onChange={(e: any) => setEmail(e.target.value)}
                        />{' '}
                        {error?.email && <p className="text-danger">{error.email}</p>}
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
                            onChange={handlePasswordInput}
                        />
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
