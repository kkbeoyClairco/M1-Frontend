import { on } from 'events';
import CustomerModal from './CustomerModal';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from 'components';
import { useLocation , useNavigate } from 'react-router-dom';
const EditCustomerModal = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const data:any = location.state;

    const onSubmit = (event: any) => {
        event.preventDefault();
        navigate('/admin/pages/claircosettings')
    };
    const handleDelete = () => {
        
    }
    return (
        <form onSubmit={onSubmit}>
            <Form.Group className="mb-1">
                <Form.Label>Customer Name</Form.Label>
                <FormInput
                    placeholder="Enter Customer name"
                    type="text"
                    name="name"
                    containerClass={'mb-1'}
                    key="text"
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Upload Logo Customer</Form.Label>
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
                        UPDATE CUSTOMER
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

export default EditCustomerModal;
