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
import NoDevice from 'components/ClaircoGeneral/NoDevice';
import { ahuList, occupancyList } from 'appConstants/dataToSvg';
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
    const [tableData, setTableData] = useState<any>([
        {
            Customer: 'Panasonic',
            Building: 'Brigade Signature Towers',
            Floor: 'Ground Floor',
            Device: 'CLIRO25001',
            Occupants: '1',
        },
        {
            Customer: 'Panasonic',
            Building: 'Brigade Signature Towers',
            Floor: 'Ground Floor',
            Occupants: '2',
            Device: 'CLIRO25002',
        },
    ]);
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

        // console.log('getIAQData', searchParam.toString());
        const sensorName = data?.name;
        let url = `${sensorName}`;
        // URLSearchParams.append/

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

            const deviceId = deviceTypeId['Occupancy'];
            const response = occupancyList;
            // await fetchDevicesList(deviceId, customerId);
            if (response?.length === 0) setIsEmpty(true);
            // console.log('Data', response);
            // setTableData(response || []);
            // setDeviceExists(response?.length > 0 ? true : false);
            setIsLoading(false);
            setTotalDevices(response?.length);
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
            accessor: 'Customer',
            defaultCanSort: false,
        },
        {
            Header: 'Building',
            accessor: 'Building',
            defaultCanSort: true,
        },

        {
            Header: 'Floor ',
            accessor: 'Floor',
            defaultCanSort: true,
        },
        {
            Header: 'Device ',
            accessor: 'Device',
            defaultCanSort: true,
        },
        {
            Header: 'Occupants ',
            accessor: 'Occupants',
            defaultCanSort: true,
        },

        {
            Header: 'Last Updated',
            accessor: 'data.epochTime',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(Date.now());
                return time;
            },
            // defaultCanSort: false,
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
    return isEmpty ? (
        <NoDevice name="Occupancy" />
    ) : (
        <Row style={{ paddingRight: '0px' }}>
            {/* <Col xs={12}> */}
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <h4 className="header-title mb-3">Occupancy Device List</h4>
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
                        <TableSkelton />
                    )}
                </Card.Body>
            </Card>
            {/* </Col> */}
        </Row>
    );
};

export default OccupancyDeviceTable;
