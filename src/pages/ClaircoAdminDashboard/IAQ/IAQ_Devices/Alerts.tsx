import { Button, Card, Modal, Table } from 'react-bootstrap';
// import { TableRecord } from './types';
import { useToggle } from 'hooks';
import React, { useState } from 'react';
import classNames from 'classnames';
// import AlertsTable from './AlertTable';
type TableRecord = {
    value: string;
    // location: string;
    time: string;
    Parameter: string;
};

const records: TableRecord[] = [
    { value: '77 C', Parameter: 'Temperature', time: ' 3:30' },
    { value: '77 C', Parameter: 'Temperature', time: '3:30' },
    { value: '77 C', Parameter: 'Temperature', time: '3:30' },
    { value: '77 C', Parameter: 'Temperature', time: ' 3:30' },
    { value: '77 C', Parameter: 'Temperature', time: ' 3:30' },
    { value: '77 C', Parameter: 'Temperature', time: '3:30' },
    { value: '77 C', Parameter: 'Temperature', time: ' 3:30' },
    // { value: '77 C', Parameter: 'Temperature', time: ' 3:30' },
];

function rowStyle() {
    let colors = ['#FFFFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

const AlertTable = () => {
    return (
        <Table className="mb-0 text-center">
            <thead>
                <tr>
                    <th>Parameters</th>
                    <th>Value</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {records.map((record, index) => {
                    return (
                        <tr key={index.toString()} style={{ backgroundColor: rowStyle() }}>
                            <td>{record.Parameter}</td>
                            <td>{record.value}</td>
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
        // setScroll(false);
        // toggleModal();
    };

    return (
        <Card style={{ width: '100%', marginTop: '1.25em', marginLeft: '5px', height: '11em', padding: '1.5em' }}>
            {/* style={{ height: '417px' }} */}
            <Card.Body style={{ padding: '0' }}>
                <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                    <h4 className="header-title">Alerts</h4>
                    <Button
                        style={{ background: ' #008675', border: '0' }}
                        onClick={() => openModalWithClass('primary')}>
                        View all
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default React.memo(Alerts);
