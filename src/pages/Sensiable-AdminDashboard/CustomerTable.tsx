import { Row, Col, Card } from 'react-bootstrap';
import { Column } from 'react-table';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component

import { CustomerTables } from './types';
import { useState, useEffect } from 'react';
import {customer } from 'helpers/api/services/Clairco/customer';
import { object } from 'yup';

type NewType = CellFormatter<CustomerTables>;

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

const columns = [
    { Header: 'Customer Name', accessor: 'customerName', defaultCanSort: false },
    { Header: 'Number of Devices', accessor: 'numberOfDevices', defaultCanSort: false },
    { Header: 'Number of Users', accessor: 'numberOfUsers', defaultCanSort: false },
    { Header: 'Time Created', accessor: 'timeCreated', defaultCanSort: false },
    { Header: 'Number of Alerts', accessor: 'numberOfAlerts', defaultCanSort: false },
    { Header: 'Status', accessor: 'status', defaultCanSort: false },
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
];

const CustomerTable = () => {
    const [customertabledata, setCustomerTableData] = useState([]);
    const getCustomers = async ()=>{
        const res = await customer.all();
        const customers = res.data.map((customer: { name: any; Devices: any; user: any; createdAt: string | number | Date; numberOfAlerts: any; status: any; action: any; otherProperty: any; }) => ({
            customerName: customer.name,
            numberOfDevices: customer.Devices,
            numberOfUsers: customer.user,
            timeCreated: new Date(customer.createdAt).toISOString().split('T')[0], // Extract date part
            numberOfAlerts: customer.numberOfAlerts,
            status: customer.status,
            action: customer.action,
            otherProperty: customer.otherProperty
            // You can add more properties or modify as per your needs
          }));
        setCustomerTableData(customers);
    }
    useEffect(() => {
        try {
            getCustomers();
        } catch (error) {
            console.log(error);
        }
    },[]);
    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <h4 className="header-title mb-3">CUSTOMERS LIST</h4>
                                </Col>
                            </Row>
                            <Table
                                columns={columns}
                                data={customertabledata}
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
    );
};

export default CustomerTable;
