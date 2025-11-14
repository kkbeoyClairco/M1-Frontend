import React from 'react';
import { Modal } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import alertIcon from 'assets/icons/caution.png';
import { convertUnixToIST } from 'utils/timeFunctions';

type NewType = CellFormatter<DeviseTables>;
export type DeviseTables = {
    name: string;
    customer: string;
    seat_no: string;
    building: string;
    floor: string;
    health_status: string;
    last_refreshed_on: any;
    last_diagnosed_on: any;
    battery_level: string;
    sensor_address: string;
};

interface AlertsModalPropTypes {
    modalState?: boolean;
    modalControlFn?: any;
    // name?: string;
    // zoneId?: any;
    dataArray: [];
    // floorsData?: [];
}
const AlertsModal: React.FC<AlertsModalPropTypes> = ({ modalState, modalControlFn, dataArray }) => {
    const columns = [
        // {
        //     Header: 'Customer',
        //     accessor: 'customerName',
        //     defaultCanSort: true,
        // },
        {
            Header: 'Building',
            accessor: 'building',
            defaultCanSort: true,
        },
        // {
        //     Header: 'Floor',
        //     accessor: 'floorName',
        //     defaultCanSort: true,
        // },

        {
            Header: 'Device',
            accessor: 'deviceId',
            defaultCanSort: true,
        },
        // {
        //     Header: 'Alert Time',
        //     accessor: 'offSince',
        //     defaultCanSort: false,
        //     Cell: ({ value }: any) => {
        //         const time = convertUnixToIST(value);
        //         return time;
        //     },
        // },
    ];
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="xl">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> OFFLINE IAQ DEVICES </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table
                    columns={columns}
                    data={dataArray || []}
                    pageSize={0}
                    // sizePerPageList={sizePerPageList}
                    isSortable={true}
                    pagination={true}
                    isSearchable={true}
                    tableClass=" mt-3 "
                    searchBoxClass="mb-2"
                />
            </Modal.Body>
        </Modal>
    );
};

export default AlertsModal;
