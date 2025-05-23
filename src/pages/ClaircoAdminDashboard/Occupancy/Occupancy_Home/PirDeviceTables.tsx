import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';
// import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deviceTypeId, deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { useRedux } from 'hooks';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserIdFromSession } from 'utils/storageFunctions';
import NoDevice from 'components/ClaircoGeneral/NoDevice';
import { fetchPIRDeviceList } from 'helpers/api/services/Clairco/customerSide/occupancy';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';
// import { URLSearchParams } from 'url';

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

const PIRDeviceTable = ({ setTotalDevices, setTotalOccupants }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    const { customerId } = getUserIdFromSession();

    const navigate = useNavigate();
    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        const searchParam = new URLSearchParams();
        const {
            name = '',
            buildingId: { name: buildingName = '' } = {},
            floorId: { name: floorName = '' } = {},
            zoneId: { name: zoneName = '' } = {},
        } = data;
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('zoneName', zoneName);
        searchParam.append('floor', floorName);
        // admin/pages/occupancy
        let url = `/admin/pages/pir/${searchParam.toString()}`;
        navigate(url);
    };

    const getPIRData = async () => {
        try {
            setIsLoading(true);
            const deviceType = deviceTypesConstant.PIR;
            const res = await fetchDevicesList(deviceType, customerId);

            if (res?.data?.records?.length === 0) setDeviceExists(false);
            setTableData(res?.data?.records ?? []);
            // setOccupancyCount(res?.data?.length ?? 0);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setDeviceExists(false);
            setIsLoading(false);
        }
    };
    const ActionColumn = ({ row }: NewType) => {
        // console.log('Row name:', row);
        return (
            <div className="action-icon">
                <div style={{}}>
                    <i className="mdi mdi-eye me-3" onClick={() => handleNavigation(row?.original)}></i>
                    {/* <i className="mdi mdi- dripicons-gear"></i> */}
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Customer',
            accessor: 'customerId.name',
            defaultCanSort: true,
        },

        {
            Header: 'Building',
            accessor: 'buildingId.name',
            defaultCanSort: true,
        },
        {
            Header: 'Floor',
            accessor: 'floorId.name',
            defaultCanSort: true,
        },
        {
            Header: 'Location',
            accessor: 'buildingId.location',
            defaultCanSort: true,
        },
        {
            Header: 'Zone',
            accessor: 'zoneId.name',
            defaultCanSort: true,
        },
        {
            Header: 'Occupants',
            accessor: 'latestData.data.OCCUPANCY',
            defaultCanSort: true,
            Cell: ({ value }: any) => {
                const res = value === 1 ? 'Occupied' : value === 0 ? 'Unoccupied' : '-';
                return res;
            },
        },
        {
            Header: 'Humidity',
            accessor: 'latestData.data.HUMI',
            defaultCanSort: true,
        },
        {
            Header: 'R-Temp',
            accessor: 'latestData.data.RTEMP',
            defaultCanSort: true,
        },

        {
            Header: 'Device',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Updated on',
            accessor: 'latestData.EpochTime',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                if (!value) return 'N/A';
                const time = convertUnixToIST(value);
                return time;
            },
        },

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
    useEffect(() => {
        getPIRData();
    }, []);
    return !deviceExists ? (
        <NoDevice name={'PIR'} />
    ) : (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    <Col>
                        <h4 className="header-title mb-3">PIR Device List</h4>
                    </Col>
                </Row>

                {!isLoading ? (
                    deviceExists ? (
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
                    ) : null
                ) : (
                    <TableSkelton2 />
                )}
            </Card.Body>
        </Card>
    );
};

export default PIRDeviceTable;
