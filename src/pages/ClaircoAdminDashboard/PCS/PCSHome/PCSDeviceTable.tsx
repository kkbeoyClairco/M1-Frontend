import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';
// import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { useRedux } from 'hooks';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserIdFromSession } from 'utils/storageFunctions';
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

const PCSDeviceTable = ({ setTotalDevices, setTotalOccupants }: any) => {
    const [tableData, setTableData] = useState([
        {
            name: 'PCS_M1',
            // deviceId: '67b45c64724e252de8978907',
            zone: 'Meeting Room 1',
            customer: 'Tesco',
            customerId: '67c6c75ad14eb2beb538a30b',
            location: 'Bangalore',
            building: 'Tesco Blr',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floor: '1st',
        },
        {
            name: 'PCS_M2',
            // deviceId: '67b45c64724e252de8978907',
            zone: 'Meeting Room 2',
            customer: 'Tesco',
            customerId: '67c6c75ad14eb2beb538a30b',
            location: 'Bangalore',
            building: 'Tesco Blr',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floor: '1st',
        },
        {
            name: 'PCS_WS_M',
            // deviceId: '67b45c64724e252de8978907',
            zone: 'Mens WS',
            customer: 'Tesco',
            customerId: '67c6c75ad14eb2beb538a30b',
            location: 'Bangalore',
            building: 'Tesco Blr',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floor: 'Ground',
        },
        {
            name: 'PCS_WS_W',
            // deviceId: '67b45c64724e252de8978907',
            zone: 'Womens WS',
            customer: 'Tesco',
            customerId: '67c6c75ad14eb2beb538a30b',
            location: 'Bangalore',
            building: 'Tesco Blr',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floor: 'Ground',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    const { customerId } = getUserIdFromSession();

    const navigate = useNavigate();
    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        const { building = '', location = '', floor = '', zone = '' } = data;
        const name = data.name ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', building);
        searchParam.append('location', location);
        searchParam.append('floor', floor);
        searchParam.append('zone', zone);

        // console.log('getIAQData', searchParam.toString());
        let url = `${searchParam.toString()}`;
        // URLSearchParams.append/
        // console.log('data', url, data);

        navigate(url);
    };
    // const data = getUserDetailsFromSession();
    // const { dispatch, appSelector } = useRedux();

    // const {
    //     activeFloor: { floorId },
    // } = appSelector((state: any) => state.HomePageReducer);

    const getOccupancyData = async () => {
        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            // const deviceId = deviceTypeId['Occupancy'];
            // const response = await fetchDevicesList(deviceId, customerId);
            // if (response?.data.length === 0) setIsEmpty(true);

            // setTableData(response?.data || []);
            // setDeviceExists(response?.data?.length > 0 ? true : false);
            setIsLoading(false);
            // setTotalDevices(response?.data?.length);
        } catch (error) {
            console.log(error);
            setTableData([]);
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
            accessor: 'customer',
            defaultCanSort: true,
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
        // {
        //     Header: 'Occupants',
        //     accessor: 'data.occupancy_number',
        //     defaultCanSort: true,
        // },
        {
            Header: 'Location',
            accessor: 'location',
            defaultCanSort: false,
        },
        {
            Header: 'Zone',
            accessor: 'zone',
            defaultCanSort: false,
        },
        // {
        //     Header: 'Status',
        //     accessor: 'health_status',
        //     defaultCanSort: false,
        // },

        {
            Header: 'Device ',
            accessor: 'name',
            defaultCanSort: true,
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
        getOccupancyData();
    }, []);
    return (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body style={{ color: 'black' }}>
                <Row>
                    <Col>
                        <h4 className="header-title mb-3">People Counting Sensors</h4>
                    </Col>
                </Row>
                {!deviceExists && (
                    <Row>
                        <Col>
                            <h4 className="header-title mb-3">No Occupancy devices installed here</h4>
                        </Col>
                    </Row>
                )}
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

export default PCSDeviceTable;
