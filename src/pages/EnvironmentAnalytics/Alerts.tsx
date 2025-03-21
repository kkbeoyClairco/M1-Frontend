import { Button, Card, Modal, Table } from 'react-bootstrap';
import { TableRecord } from './types';
import { useToggle } from 'hooks';
import { useState } from 'react';
import classNames from 'classnames';
import AlertsTable from './AlertTable';

const records: TableRecord[] = [
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
    { value: '77 C', location: 'Building-Floor-1', time: '09 Apr 2023 3:30' },
];

function rowStyle() {
    let colors = ['#FFADAD99', '#FAC85866', '#9AF2C6', '#536DE654'];
    return colors[Math.floor(Math.random() * colors.length)];
}



const AlertTable = () => {
    return (
        <Table className="mb-0 text-center">
            <thead>
                <tr>
                    <th>Value</th>
                    <th>Location</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {records.map((record, index) => {
                    return (
                        <tr key={index.toString()} style={{ backgroundColor: rowStyle() }}>
                            <th scope="row">{record.value}</th>
                            <td>{record.location}</td>
                            <td>{record.time}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

const Alerts = () => {
    const [isOpen, toggleModal] = useToggle();
    const [scroll, setScroll] = useState<boolean>(false);
    const [className, setClassName] = useState<string>('');

    const openModalWithClass = (className: string) => {
        setClassName(className);
        setScroll(false);
        toggleModal();
    };

    return (
        <Card>
            <Card.Body>
                <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                    <h4 className="header-title">Alerts</h4>
                    <Button variant="primary" onClick={() => openModalWithClass('primary')}>
                        View Alerts
                    </Button>
                </div>
                <Modal show={isOpen} onHide={toggleModal} size="lg">
                    <Modal.Header
                        onHide={toggleModal}
                        closeButton
                        className={classNames('modal-colored-header', 'bg-' + className)}>
                        <h4 className="modal-title text-light">OFFICE ENVIRONMENT ALERTS</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <AlertsTable />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={className} onClick={toggleModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <AlertTable />
            </Card.Body>
        </Card>
    );
};

export default Alerts;
