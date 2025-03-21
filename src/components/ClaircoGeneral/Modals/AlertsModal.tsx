import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component

import { convertUnixToIST } from 'utils/timeFunctions';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';

interface AlertsModalInterface {
    modalState?: boolean;
    modalControlFn?: () => void;
    data?: [];
    loadingStatus?: boolean;
}
const AlertsModal: React.FC<AlertsModalInterface> = ({ modalState, modalControlFn, data, loadingStatus }) => {
    // const [data, setData] = useState([]);
    const columns = [
        {
            Header: 'Building',
            accessor: 'buildingName',
            defaultCanSort: true,
        },
        {
            Header: 'Floor',
            accessor: 'floorName',
            defaultCanSort: true,
        },

        {
            Header: 'Device',
            accessor: 'deviceName',
            defaultCanSort: true,
        },
        {
            Header: 'Alert Time',
            accessor: 'offSince',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
                return time;
            },
        },
    ];
    console.log('Loading status', loadingStatus);
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="xl">
            <ModalHeader style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>Alerts</Modal.Title>
            </ModalHeader>
            <ModalBody>
                {' '}
                {!loadingStatus ? (
                    <Table
                        columns={columns}
                        data={data || []}
                        pageSize={0}
                        // sizePerPageList={sizePerPageList}
                        isSortable={true}
                        pagination={true}
                        isSearchable={true}
                        tableClass=" mt-3 "
                        searchBoxClass="mb-2"
                    />
                ) : (
                    <TableSkelton />
                )}
            </ModalBody>
            {/* <ModalDialog>Hiii</ModalDialog> */}
            <ModalFooter></ModalFooter>
        </Modal>
    );
};

export default AlertsModal;
