import React, { useEffect, useState ,useContext} from 'react';
import { FormInput } from 'components';
import Select from 'react-select';
import { useRedux } from 'hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import {floor} from "../../../../helpers/api/services/Clairco/customer";
import { ToastContext } from 'context/ToastContext';
const EditFloorModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [customerList, setCustomers] = useState([]);
    const [buildingList, setBuildings] = useState([]);
    const data: any = location.state;
    const defaultCustomer: any = { value: data.customerId, label: data.customer };
    const defaultBuilding: any = { value: data.buildingId, label: data.building };
    const toast = useContext(ToastContext);
    const {appSelector } = useRedux();

    const { customers, buildings } = appSelector((state) => ({
        customers: state.Customer.customers || [],
        buildings: state.Building.buildings || [],
    }));

    const onSubmit = async(event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const floorData:any = {floorId:data.id};
        formData.forEach((value,key)=>{
            if(value == null || value == undefined || value === ""){
                return;
            }
            floorData[key] = value;
        });
        try {
            const res = await floor.update(floorData);
            toast?.showToast('floor updated successfully' , 'success');
        } catch (error) {
            toast?.showToast('some error occure while updating floor', 'error');
        }
        navigate('/admin/pages/claircosettings');
    };
    
    const handleDelete = async () => {
        try {
            const res = await floor.delete({floorId:data.id});
            toast?.showToast('floor deleted successfully' , 'success');
            navigate('/admin/pages/claircosettings');
        } catch (error) {
            toast?.showToast('some error occure while deleting floor', 'error');
        }
    };
    

    useEffect(() => {
        const formatCustomers = () => {
            const latestCustomers = customers.map((customer: any) => {
                return { value: customer.customerId, label: customer.name };
            });
            return latestCustomers;
        };
        const formatBuildings = () => {
            const latestBuildings = buildings.map((building: any) => {
                return { value: building.buildingId, label: building.name };
            });
            return latestBuildings;
        };

        setCustomers(formatCustomers());
        setBuildings(formatBuildings());
    }, []);
    return (
        <form onSubmit={onSubmit}>
            <Form.Group className="mb-1">
                <Form.Label>Floor Name</Form.Label>
                <FormInput
                    placeholder="Enter Floor Name"
                    type="text"
                    name="name"
                    containerClass={'mb-1'}
                    defaultValue={data.name}
                    key="text"
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
            <Form.Group className="mb-3">
                <Form.Label>Upload Layout Image</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    //   onChange={handleFileChange}
                />
            </Form.Group>
            <Row className="float-end">
                <Col>
                    <Button
                        type="submit"
                        className="ms-2"
                        style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                        UPDATE FLOOR
                    </Button>
                </Col>
            </Row>
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
        </form>
    );
};
export default EditFloorModal;
