import React from 'react';
import { Button, Modal } from 'react-bootstrap';
interface WarningModalProps {
    modalState: boolean;
    WarningMessage: string;
    modalControlFn: () => void;
}
const WarningModal: React.FC<WarningModalProps> = ({
    modalState,
    modalControlFn,
    WarningMessage = 'Oops! Something went wrong',
}) => {
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="sm">
            <Modal.Header style={{ background: '#cc3300' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Warning </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>{WarningMessage}</h6>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={modalControlFn}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WarningModal;
