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

const OutdoorTable = ({ setTotalDevices }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [devicesExists, setDevicesExists] = useState(true);
    const { customerId } = getUserIdFromSession();

    const navigate = useNavigate();
    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        const { buildingId = {}, floorId = {}, id = '' } = data || {};
        const name = data?.name || '';
        const buildingName = buildingId?.name ? buildingId?.name : '';
        const locationName = buildingId?.location ?? '';
        const floorName = floorId?.name ? floorId?.name : '';
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);

        // console.log('outdoor', searchParam.toString());

        let url = `${searchParam.toString()}`;
        // URLSearchParams.append/

        navigate(url, { state: { parentId: id } });
    };
    // const data = getUserDetailsFromSession();
    // const { dispatch, appSelector } = useRedux();

    // const {
    //     activeFloor: { floorId },
    // } = appSelector((state: any) => state.HomePageReducer);

    const getOutDoorDeviceList = async () => {
        try {
            setIsLoading(true);
            const deviceType = deviceTypesConstant.VRV_VRF_OUTDOOR;
            const response = await fetchDevicesList(deviceType);
            if (response?.data?.records?.length === 0) setIsEmpty(true);
            // console.log('Outdoor', response);
            setTableData(response?.data?.records || []);
            setDevicesExists(response?.data?.records?.length > 0 ? true : false);
            setIsLoading(false);
            setTotalDevices(response?.data?.records?.length);
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
            defaultCanSort: false,
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
        getOutDoorDeviceList();
    }, []);

    return !devicesExists ? (
        <NoDevice name={'Outdoor'} />
    ) : (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    <Col>
                        <h4 className="header-title mb-3">Outdoor Device List</h4>
                    </Col>
                </Row>

                {!isLoading ? (
                    devicesExists ? (
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

export default OutdoorTable;
