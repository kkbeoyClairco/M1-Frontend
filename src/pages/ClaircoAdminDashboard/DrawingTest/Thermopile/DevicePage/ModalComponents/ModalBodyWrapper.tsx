import React, { useEffect, useState } from 'react';
import QuadrantPlotting from './QuadrantPlotting';
import QuadrantsTable from './QuadrantsTable';
import { Col, Modal, Row } from 'react-bootstrap';
import QuadrantInputs from './QuadrantInputs';
import { scalingFactorVGAdot3Camera } from 'appConstants/DeviceConstants';
import { image_base64, raw_data } from './../constant';
interface ModalBodyWrapperInterface {
    modalState: boolean;
    modalControlFn: VoidFunction;
}

const ModalBodyWrapper: React.FC<ModalBodyWrapperInterface> = ({ modalState, modalControlFn }) => {
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="xl">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Zone Planner</h5>
                </Modal.Title>{' '}
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center ">
                <Row>
                    {' '}
                    <Col xs={12} xl={6} className="d-flex justify-content-center align-items-center">
                        <QuadrantPlotting
                            scalingFactor={scalingFactorVGAdot3Camera}
                            changePointFn={setPoints}
                            imageURL={image_base64}
                        />
                    </Col>
                    <Col xs={12} xl={6}>
                        <QuadrantInputs points={points} modalControlFn={modalControlFn} />
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default ModalBodyWrapper;
