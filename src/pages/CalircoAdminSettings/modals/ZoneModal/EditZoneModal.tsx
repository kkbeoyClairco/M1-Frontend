import React, { useContext, useEffect, useState } from "react";
import { FormInput } from "components";
import Select from 'react-select';
import { useRedux } from "hooks";
import { useLocation , useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Toast } from "react-bootstrap";
import {zone} from "../../../../helpers/api/services/Clairco/customer";
import { ToastContext } from 'context/ToastContext';

const EditZoneModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useContext(ToastContext);
    const data :any = location.state;
    const defaultFloor:any  = {value:data.floorId,label:data.floor};
    const defaultCustomer:any  = {value:data.customerId,label:data.customer};
    const defaultBuilding :any = {value:data.buildingId,label:data.building};
    const { dispatch,appSelector } = useRedux();
    const [customerList, setCustomers] = useState([]);
    const [buildingList, setBuildings] = useState([]);
    const { customers, buildings } = appSelector((state) => ({
        customers: state.Customer.customers || [],
        buildings: state.Building.buildings || [],
    }));

    useEffect(()=>{
        const formatCustomers = () => {
            const latestCustomers = customers.map((customer:any)=>{
                return {value:customer.customerId , label:customer.name}
            });
            return latestCustomers;
        }
        const formatBuildings = ()=>{
            const latestBuildings = buildings.map((building:any)=>{
                return {value:building.buildingId , label:building.name}
            })
            return latestBuildings
        }

        setCustomers(formatCustomers());
        setBuildings(formatBuildings());
    },[]);


    const onSubmit = async(event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const zoneData:any = {zoneId:data.id};
        formData.forEach((value,key)=>{
            if(value == null || value == undefined || value === ""){
                return;
            }
            zoneData[key] = value;
        });
        try {
            const res = await zone.update(zoneData);
            toast?.showToast('floor updated successfully' , 'success');
        } catch (error:any) {
            toast?.showToast(error, 'error');
        }
        navigate('/admin/pages/claircosettings');
    }

    const handleDelete = async(event:any)=>{
       
        try {
            const res = await zone.delete({floorId:data.id});
            toast?.showToast('zone deleted successfully' , 'success');
            navigate('/admin/pages/claircosettings');
        } catch (error) {
            toast?.showToast('some error occure while deleting zone', 'error');
        }
    }
    return (
        <form onSubmit={onSubmit}>
        <Form.Group className="mb-1">
            <Form.Label>Zone Name</Form.Label>
            <FormInput
                placeholder="Enter Zone"
                type="text"
                name="name"
                defaultValue={data?.name}
                containerClass={'mb-1'}
                key="text"
            />
        </Form.Group>
        <Form.Group className="mb-1">
            <Form.Label>Customer</Form.Label>
            <Select name="customerId" placeholder="Select Customer" options={customerList} defaultValue={defaultCustomer}/>
        </Form.Group>
        <Form.Group className="mb-1">
            <Form.Label>Building Name</Form.Label>
            <Select name="buildingId" placeholder="Select Building " options={buildingList} defaultValue={defaultBuilding} />
        </Form.Group>
        <Form.Group className="mb-1">
            <Form.Label>Floor Name</Form.Label>
            <Select name="floorId" placeholder="Select Floor " options={[]} defaultValue={defaultFloor}/>
        </Form.Group>
        <Form.Group className="mb-1">
            <Form.Label>Friendly Name</Form.Label>
            <FormInput
                placeholder="Enter Friendly name"
                type="text"
                name="alias"
                containerClass={'mb-1'}
                key="text"
                defaultValue={data?.alias}
                errors={Error}
            />
        </Form.Group>
        <Row className="float-end">
            <Col>
                <Button
                    type="submit"
                    className="ms-2"
                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                    UPDATE ZONE
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
    )
}

export default EditZoneModal;