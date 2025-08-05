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
const BuildingHealthModal: React.FC<AlertsModalPropTypes> = ({ modalState, modalControlFn, dataArray }) => {
    const columns = [
        {
            Header: 'Building',
            accessor: "buildingName",
            defaultCanSort: true,
        },
        {
            Header : 'Status',
            accessor : 'airQualityCategory',
            defaultCanSort : true
        }
    ];
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="xl">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Building Health </h5>
                    {/* <img src={alertIcon} alt="" height={'40em'} /> */}
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

export default BuildingHealthModal;
