import React, { useEffect, useState, useContext } from 'react';
import { FormInput } from 'components';
import Select from 'react-select';
import { useRedux } from 'hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { user } from '../../../../helpers/api/services/Clairco/user';
import { ToastContext } from 'context/ToastContext';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';

const EditUserModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data: any = location.state;
    console.log('Data incoming', data);
    const toast = useContext(ToastContext);
    const defaultCustomer: any = { value: data.customerId, label: data.customer };
    const defaultBuilding: any = { value: data.buildingId, label: data.building };
    const defaultType: any = { value: data.type, label: data.type };
    const { appSelector } = useRedux();
    const [customerList, setCustomers] = useState([]);
    const [buildingList, setBuildings] = useState([]);

    const { customers, buildings } = appSelector((state) => ({
        customers: state.Customer.customers || [],
        buildings: state.Building.buildings || [],
    }));

    const onSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const formData = new FormData(event.target);
            const userData: any = { userId: data.id };
            formData.forEach((value, key) => {
                if (value == null || value == undefined || value === '') {
                    return;
                }
                userData[key] = value;
            });

            const res = await user.update(userData);
            toast?.showToast('User updated successfully', 'success');
        } catch (error) {
            toast?.showToast('some error occure while updating user', 'error');
        }
        navigate('/admin/pages/claircosettings');
    };
    const handleDelete = async (event: any) => {
        try {
            const res = await user.delete({ userId: data.id, customerId: data.customerId });
            toast?.showToast('User deleted successfully', 'success');
            navigate('/admin/pages/claircosettings');
        } catch (error) {
            toast?.showToast('some error occure while deleting user', 'error');
        }
    };

    useEffect(() => {
        const formatCustomers = () => {
            const latestCustomers = customers.map((customer: any) => {
                return { value: customer.id, label: customer.name };
            });
            return latestCustomers;
        };
        const formatBuildings = () => {
            const latestBuildings = buildings.map((building: any) => {
                // console.log(building);
                return { value: building.id, label: building.name };
            });
            return latestBuildings;
        };
        setCustomers(formatCustomers());
        setBuildings(formatBuildings());
    }, []);

    const userType = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Customer', value: 'Customer' },
        { label: 'Building Manager', value: 'BuildingManager' },
    ];

    return (
        <>
            <PageHeading title={'Edit Profile'} />
            <Row style={{ marginLeft: '10px', marginRight: '5px' }}>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-1">
                        <Form.Label>User Type</Form.Label>
                        <Select
                            name="type"
                            placeholder="Select User Type"
                            options={userType}
                            defaultValue={defaultType}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Name</Form.Label>
                        <FormInput
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            containerClass={'mb-1'}
                            key="text"
                            defaultValue={data?.name}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Phone Number</Form.Label>
                        <FormInput
                            name="phone"
                            placeholder="Enter Phone Number"
                            className="react-select"
                            defaultValue={data?.phone}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Email ID</Form.Label>
                        <FormInput
                            name="email"
                            placeholder="Enter email id"
                            className="react-select"
                            defaultValue={data?.email}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Password</Form.Label>
                        <FormInput
                            name="password"
                            placeholder="Enter Password"
                            className="react-select"
                            defaultValue={data?.password}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Customer</Form.Label>
                        <Select
                            name="customerId"
                            placeholder="Select Customer"
                            options={customerList}
                            defaultValue={defaultCustomer}
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>Building</Form.Label>
                        <Select
                            name="buildingId"
                            placeholder="Select Building"
                            options={buildingList}
                            defaultValue={defaultBuilding}
                        />
                    </Form.Group>
                    <Row className="float-end">
                        <Col>
                            <Button
                                type="submit"
                                className="ms-2"
                                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                UPDATE USER
                            </Button>
                        </Col>
                    </Row>
                </form>
                <Row className="float-end">
                    <Col>
                        <Button
                            onClick={handleDelete}
                            className="ms-2"
                            style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                            DELETE
                        </Button>
                    </Col>
                </Row>
            </Row>
        </>
    );
};

export default EditUserModal;
