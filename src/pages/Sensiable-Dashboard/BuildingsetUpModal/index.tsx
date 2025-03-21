
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Row } from 'react-bootstrap';
import { useToggle } from 'hooks';
import { useState } from 'react';
import SplitupChart from './Chart';
import SplitupTable from './Table';
type BuildingSplitUpModal = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const BuildingSplitUp: React.FC<BuildingSplitUpModal> = (props) => {
    const [isOpen, toggleModal] = useToggle();
    

   
    return (
        
        <Modal size='xl' 
   {...props}
   aria-labelledby="contained-modal-title-vcenter"
   className="modal-center"
   centered
   onHide={props.onClose}
        >
            <Modal.Header className='bg-primary text-white' closeButton>
                <Modal.Title id="contained-modal-title-vcenter">ENVIRONMENTAL BUILDING SPLITUP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row> 
                <Col sm={4}>
                <SplitupChart props={props}/>
        </Col>

        <Col sm={8}>
        <SplitupTable/>
        </Col>
      </Row>
            </Modal.Body>
            <Modal.Footer>
                        {/* <Button className='primary' onClick={toggleModal}>
                            Close
                        </Button> */}
                    </Modal.Footer>
        </Modal>
      
    );
};

export default BuildingSplitUp;
