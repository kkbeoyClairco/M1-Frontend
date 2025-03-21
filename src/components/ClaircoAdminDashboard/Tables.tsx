import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
import { data as Sites } from './data';
import { DeviseTables } from './types';
type NewType = CellFormatter<DeviseTables>;

const ActionColumn = ({ row }: NewType) => {
    return (
        <div className="action-icon">
            <div style={{}}>
                <i className="mdi mdi-eye me-3"></i>
                <i className="mdi mdi- dripicons-gear"></i>
            </div>
        </div>
    );
};

export const Tables = ({}) => {
    const columns = [
        {
            Header: 'Device Id',
            accessor: 'sensor_address',
            defaultCanSort: true,
        },
        {
            Header: 'Type',
            accessor: 'type',
            defaultCanSort: true,
        },
        {
            Header: 'Location.',
            accessor: 'seat_no',
            defaultCanSort: false,
        },
        {
            Header: 'Building',
            accessor: 'building',
            defaultCanSort: true,
        },
        {
            Header: 'Floor',
            accessor: 'floor',
            defaultCanSort: true,
        },

        {
            Header: 'Commissioned Date',
            accessor: 'commissioned_date',
            defaultCanSort: false,
        },
        {
            Header: 'Last Updated',
            accessor: 'Last_Updated',
            defaultCanSort: false,
        },
        {
            Header: 'Status',
            accessor: 'health_status',
            defaultCanSort: false,
        },
        {
            Header: 'Action',
            accessor: 'action',
            defaultCanSort: false,
            Cell: ActionColumn,
        },
    ];
    const sizePerPageList = [
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: '50',
            value: 50,
        },
    ];

    return (
        <div>
            {' '}
            <>
                <Row>
                    <Col xs={12}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <h4 className="header-title mb-3">Device List</h4>
                                    </Col>
                                </Row>
                                <Table
                                    columns={columns}
                                    data={Sites}
                                    pageSize={10}
                                    sizePerPageList={sizePerPageList}
                                    isSortable={true}
                                    pagination={true}
                                    isSearchable={true}
                                    tableClass=" mt-3 "
                                    searchBoxClass="mb-2"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        </div>
    );
};
