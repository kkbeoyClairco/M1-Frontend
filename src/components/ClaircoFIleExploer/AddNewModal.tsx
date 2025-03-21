import React from 'react';
import { Modal } from 'react-bootstrap';

const AddNewModal = ({ modalState, modalControlFn, textChangeFn }: any) => {
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="lg">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Add Data</h5>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <input type="text" id="lname" name="lname" onChange={(e: any) => textChangeFn(e.target.value)}></input>
            </Modal.Body>
        </Modal>
    );
};

export default AddNewModal;
