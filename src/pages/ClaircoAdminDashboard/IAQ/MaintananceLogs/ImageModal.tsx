import React from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({
    imageURL,
    modalState,
    modalControlFn,
}: {
    imageURL: string;
    modalState: boolean;
    modalControlFn: () => void;
}) => {
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="lg">
            <img src={imageURL} alt="" />
        </Modal>
    );
};

export default ImageModal;
