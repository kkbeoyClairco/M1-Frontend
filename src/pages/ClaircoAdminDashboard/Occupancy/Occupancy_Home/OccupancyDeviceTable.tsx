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

const OccupancyDeviceTable = ({ setTotalDevices, setTotalOccupants }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    const { customerId } = getUserIdFromSession();

    const navigate = useNavigate();
    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        // console.log('data', data);
        // const {
        //     name,
        //     buildingId: { name: buildingName },
        //     locationId: { name: locationName },
        //     floorId: { name: floorName },
        // } = data;
        // const searchParam = new URLSearchParams();
        // searchParam.append('name', name);
        // searchParam.append('building', buildingName);
        // searchParam.append('location', locationName);
        // searchParam.append('floor', floorName);

        // console.log('Occu', data);
        const sensorName = data?.name ?? '';
        const building = data?.buildingId?.name ?? '';
        const location = data?.buildingId?.location ?? '';
        const zone = data?.zoneId?.name ?? '';

        // const building = buildingId?.name ?? '';

        const searchParams = new URLSearchParams();
        searchParams.append('building', building);
        searchParams?.append('location', location);
        searchParams?.append('zone', zone);
        searchParams?.append('deviceName', sensorName);
        let url = searchParams?.toString();
        // console.log('URL', url, data);
        navigate(url);
    };

    const getOccupancyData = async () => {
        try {
            setIsLoading(true);

            const deviceType = deviceTypesConstant.OCCUPANCY;
            const response = await fetchDevicesList(deviceType, customerId);
            if (response?.data.length === 0) setIsEmpty(true);

            setTableData(response?.data || []);
            setDeviceExists(response?.data?.length > 0 ? true : false);
            setIsLoading(false);
            setTotalDevices(response?.data?.length);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    const ActionColumn = ({ row }: NewType) => {
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
            accessor: 'data.occupancy_number',
            defaultCanSort: true,
        },

        {
            Header: 'Device ',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Updated on',
            accessor: 'updatedAt',
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
        getOccupancyData();
    }, []);
    return !deviceExists ? (
        <NoDevice name={'Occupancy'} />
    ) : (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    <Col>
                        <h4 className="header-title mb-3">Occupancy Device List</h4>
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
                    <TableSkelton />
                )}
            </Card.Body>
        </Card>
    );
};

export default OccupancyDeviceTable;
