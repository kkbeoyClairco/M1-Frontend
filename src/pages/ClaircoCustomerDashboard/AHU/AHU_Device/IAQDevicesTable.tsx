import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { useNavigate } from 'react-router-dom';
import { convertUnixToIST } from 'utils/timeFunctions';
type DeviseTables = {
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
type ColumnType = CellFormatter<DeviseTables>;
const IAQDevicesTable = ({ tableData }: any) => {
    // const [tableData, setTableData] = useState([]);

    const navigate = useNavigate();

    //Function to navigate to devise specific page
    const handleNavigation = (id: string) => {
        // console.log('id to navigate', id);
        navigate(`/customer/vrv-vrf/${id}`);
    };

    const ActionColumn = ({ row }: ColumnType) => {
        return (
            <div className="action-icon">
                <div style={{}}>
                    <i className="mdi mdi-eye me-3" onClick={() => handleNavigation(row.id)}></i>
                    <i className="mdi mdi- dripicons-gear"></i>
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Device',
            accessor: 'name',
            defaultCanSort: true,
        },
        // {
        //     Header: 'Floor',
        //     accessor: 'floor1',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Zone',
        //     accessor: 'zone',
        //     defaultCanSort: true,
        // },
        {
            Header: 'AQI',
            accessor: 'realtimeData.AQI',
            defaultCanSort: true,
        },
        {
            Header: 'Temperature (°C)',
            accessor: 'realtimeData.TEMP',
            defaultCanSort: false,
        },
        {
            Header: 'Humidity(%)',
            accessor: 'realtimeData.HUM',
            defaultCanSort: true,
        },
        {
            Header: 'CO2(ppm)',
            accessor: 'realtimeData.CO2',
            defaultCanSort: true,
        },
        {
            Header: 'VOC(ppm)',
            accessor: 'realtimeData.VOC',
            defaultCanSort: false,
        },
        {
            Header: 'PM 25(µg/m³)',
            accessor: 'realtimeData.PM25',
            defaultCanSort: false,
        },
        {
            Header: 'PM 10(µg/m³)',
            accessor: 'realtimeData.PM10',
            defaultCanSort: false,
        },
        {
            Header: 'Last Updated',
            accessor: 'realtimeData.timestamp',
            defaultCanSort: false,
            Cell: ({ row }: any) => {
                // console.log('Row', row);
                const unixTime = row?.original?.realtimeData?.timestamp;
                const ISOTime = convertUnixToIST(unixTime);
                return ISOTime == 'Invalid Date' ? '' : ISOTime;
            },
        },
        // {
        //     Header: 'Status',
        //     accessor: 'health_status3',
        //     defaultCanSort: false,
        // },

        // {
        //     Header: 'View',
        //     accessor: 'action',
        //     defaultCanSort: false,
        //     Cell: ActionColumn,
        // },
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
                                <h4 className="header-title mb-3">IAQ Device List</h4>
                            </Col>
                        </Row>
                        <Table
                            columns={columns}
                            data={tableData || []}
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

export default IAQDevicesTable;
