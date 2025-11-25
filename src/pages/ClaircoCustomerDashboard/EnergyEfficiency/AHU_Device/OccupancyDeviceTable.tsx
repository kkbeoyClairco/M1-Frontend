import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { useNavigate } from 'react-router-dom';
import { convertUnixToIST } from 'utils/timeFunctions';
type OccupancyDevicesTableType = {
    device_id: string;
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
type ColumnType = CellFormatter<OccupancyDevicesTableType>;
const OccupancyDevicesTable = ({ tableData }: any) => {
    // const [tableData, setTableData] = useState([]);

    const navigate = useNavigate();

    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        // console.log('id to navigate', id);
        navigate(`/customer/occupancy/${data.name}`);
    };

    const ActionColumn = ({ row }: ColumnType) => {
        return (
            <div className="action-icon">
                <div style={{}}>
                    <i className="mdi mdi-eye me-3" onClick={() => handleNavigation(row.original)}></i>
                    {/* <i className="mdi mdi- dripicons-gear"></i> */}
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Zone ',
            accessor: 'data.zoneName',
            defaultCanSort: true,
        },
        {
            Header: 'Occupants',
            accessor: 'realtimeData.metaData.occupancy_number',
            defaultCanSort: true,
        },
        {
            Header: 'Temperature',
            accessor: 'RTEMP',
            defaultCanSort: true,
        },
        {
            Header: 'Humidity',
            accessor: 'HUMI',
            defaultCanSort: true,
        },
        {
            Header: 'Device',
            accessor: 'name',
            defaultCanSort: true,
        },
        // {
        //     Header: 'Customer',
        //     accessor: 'customer',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Location.',
        //     accessor: 'seat_no',
        //     defaultCanSort: false,
        // },
        // {
        //     Header: 'Building',
        //     accessor: 'building',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Floor',
        //     accessor: 'floor',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Zone',
        //     accessor: 'building',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Occupants',
        //     accessor: 'realtimeData.metaData.occupancy_number',
        //     defaultCanSort: true,
        // },
        {
            Header: 'Last Updated',
            accessor: 'realtimeData.epochTime',
            defaultCanSort: false,
            Cell: ({ row }: any) => {
                // console.log('Row', row);
                const unixTime = row?.original?.realtimeData?.epochTime;
                const ISOTime = convertUnixToIST(unixTime);
                return ISOTime == 'Invalid Date' ? '' : ISOTime;
            },
        },
        // {
        //     Header: 'Status',
        //     accessor: 'health_status',
        //     defaultCanSort: false,
        // },

        {
            Header: 'View',
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
        <Row style={{ paddingRight: '0px' }}>
            <Col xs={12} style={{ paddingRight: '0px' }}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">Occupancy Device List</h4>
                            </Col>
                        </Row>
                        <Table
                            columns={columns}
                            data={tableData}
                            pageSize={0}
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
    );
};

export default OccupancyDevicesTable;
