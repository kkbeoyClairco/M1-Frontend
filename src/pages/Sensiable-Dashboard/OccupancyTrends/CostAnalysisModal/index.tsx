
import Modal from 'react-bootstrap/Modal';
// import { Button } from 'react-bootstrap';
// import { useToggle } from 'hooks';
// import { useState } from 'react';
import CostAnalysisTable from './Table';


type CostAnalysisModal = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

const CostAnalysis: React.FC<CostAnalysisModal> = (props) => {
  
    return (
        
        <Modal size='xl' 
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}
        >
            <Modal.Header className='bg-primary text-white' closeButton>
                <Modal.Title id="contained-modal-title-vcenter">COST ANALYSIS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CostAnalysisTable/>
            </Modal.Body>
            <Modal.Footer>    
                    </Modal.Footer>
        </Modal>
      
    );
};

export default CostAnalysis;
