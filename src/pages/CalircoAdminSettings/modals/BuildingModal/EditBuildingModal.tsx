import react,{useEffect, useState,useContext} from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { FormInput } from 'components';
import { useRedux } from 'hooks';
import { useLocation ,useNavigate} from 'react-router-dom';
import {building} from "../../../../helpers/api/services/Clairco/customer";
import { ToastContext } from 'context/ToastContext';


const EditBuildingModal = () => {
    const navigate = useNavigate();
    const localtion = useLocation();
    const data:any = localtion.state;
    const toast = useContext(ToastContext);
    const defaultValue:any = { value: data.customerId, label: data.customerName };
    const { dispatch, appSelector } = useRedux();
    const { customers} = appSelector((state) => ({
        customers: state.Customer.customers || [],
    }));
    const [customerList, setCustomers] = useState([]);
    useEffect(()=>{
        const formatCustomers = () => {
            const latestCustomers = customers.map((customer:any)=>{
                return {value:customer.id , label:customer.name}
            });
            console.log(latestCustomers)
            return latestCustomers;
        }
        setCustomers(formatCustomers());
    },[])
    
    const onSubmit = async(event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const formData = new FormData(event.target);
        const buildingData:any = {buildingId:data.id};
        formData.forEach((value,key)=>{
            if(value == null || value == undefined || value === ""){
                return;
            }
            buildingData[key] = value;
        });
        try {
            const res =await building.update(buildingData);
            toast?.showToast('floor updated successfully' , 'success');
        } catch (error) {
            toast?.showToast('some error occure while updating building', 'error');
        }
        navigate('/admin/pages/claircosettings');
    };
    const handleDelete = async()=>{
        try {
            const res = await building.delete({buildingId:data.id});
            toast?.showToast('building deleted successfully' , 'success');
            navigate('/admin/pages/claircosettings');
        } catch (error) {
            toast?.showToast('some error occure while deleting building', 'error');
        }
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <Form.Group className="mb-1">
                    <Form.Label>Building Name</Form.Label>
                    <FormInput
                        placeholder="Enter Building Name"
                        type="text"
                        name="name"
                        containerClass={'mb-1'}
                        key="text"
                        defaultValue = {data?.name}
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Customer</Form.Label>
                    <Select
                        name="customerId"
                        placeholder="Select Customer"
                        className="react-select"
                        classNamePrefix="react-select"
                        defaultValue={defaultValue}
                        options={customerList}
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Cost of Energy</Form.Label>
                    <FormInput
                        placeholder="Enter Cost of Energy"
                        type="text"
                        name="costOfEnergy"
                        containerClass={'mb-1'}
                        key="text"
                        defaultValue={data?.costOfEnergy}
                        errors={Error}
                    />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label>Cost Per Sq.Ft.</Form.Label>
                    <FormInput
                        placeholder="Enter Cost Per Sq.Ft."
                        type="text"
                        name="costPerSqFt"
                        containerClass={'mb-1'}
                        key="text"
                        defaultValue={data?.costPerSqFt}
                        errors={Error}
                    />
                </Form.Group>
                <Row className="float-end">
                    <Col>
                        <Button
                            type="submit"
                            className="ms-2"
                            style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                            UPDATE BUILDING
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
        </div>
    );
};

export default EditBuildingModal;
