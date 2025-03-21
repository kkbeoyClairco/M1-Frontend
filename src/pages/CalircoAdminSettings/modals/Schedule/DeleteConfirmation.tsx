import React from 'react';
import { Button, Modal } from 'react-bootstrap';

type DeleteConfirmationModalType = {
    state: boolean;
    handleModalState: () => void;
    deleteFn: (scheduleId: string) => void;
};
const DeleteConfirmation: React.FC<DeleteConfirmationModalType> = ({ state, handleModalState, deleteFn }) => {
    return (
        <Modal
            show={state}
            onHide={handleModalState}
            animation={true}
            size={'sm'}
            // {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center center"
            // onHide={props.onClose}
        >
            <Modal.Header
                className="text-white"
                style={{
                    backgroundColor: '#008675',
                    borderColor: '#008675',
                    display: 'flex',
                    justifyContent: 'center',
                }}
                closeButton>
                {/* <Modal.Title id="contained-modal-title-vcenter">{props.selectedschedule?.name}</Modal.Title> */}
                Delete
            </Modal.Header>
            <Modal.Body>Are you sure? You want to delete this schedule template..?</Modal.Body>
            <Modal.Footer>
                <Button style={{ background: 'red', border: '0px' }} onClick={() => deleteFn}>
                    Delete{' '}
                </Button>
                <Button style={{ background: 'grey', border: '0px' }} onClick={handleModalState}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmation;
