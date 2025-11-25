import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
// import { DeviseTables } from './types';
import { useNavigate } from 'react-router-dom';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserDetailsFromSession, getUserIdFromSession } from 'utils/storageFunctions';
import { useRedux } from 'hooks';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';

type ColumnType = CellFormatter<DeviseTables>;

type DeviseTables = {
    _id: string;
    deviceName: string;
    customer: string;
    location: string;
    building: string;
    floor: string;
    humidity: string;
    co2: string;
    status: string;
    last_updated: any;
    last_diagnosed_on: any;
    battery_level: string;
    sensor_address?: string; // Make it optional
};

const AHUDeviseTable = ({ customerId }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { isAdmin, id } = getUserIdFromSession();
    // console.log('Session storage:', isAdmin, id);

    // const data = getUserDetailsFromSession();
    const { dispatch, appSelector } = useRedux();

    const {
        activeFloor: { floorId },
    } = appSelector((state: any) => state.HomePageReducer);

    const getAHUData = async () => {
        try {
            setIsLoading(true);
            const deviceId = deviceTypeId['AHU'];
            // const { customerId } = data;
            // console.log('AHu');
            const response = await fetchDevicesList(deviceId, customerId, floorId);
            if (response?.data.length === 0) setIsEmpty(true);

            setTableData(response?.data || []);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        const id = data?._id;
        const sensorName = data?.switchDeviceId?.name;
        const name = data?.name;
        const btuName = data?.btuDeviceId?.name;

        // console.log('id to navigate', data);
        navigate(`/customer/ahu/${id}`, { state: { sensorName: sensorName, deviceName: name, btuName } });
    };

    // const getAllAHUDevices = async () => {
    //     try {
    //         const id = '66f675fbb41f4df0ba76eef6';
    //         const userId = isAdmin === 'Admin' ? '' : id;
    //         const res = await fetchAHUDeviceList(userId);
    //         // console.log('List of AHUs:', res);
    //         setTableData(res?.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const ActionColumn = ({ row }: ColumnType) => {
        // console.log(row);
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
            Header: 'Device Name',
            accessor: 'name',
            defaultCanSort: true,
        },

        // {
        //     Header: 'Last Updated',
        //     accessor: 'updatedAt',
        //     defaultCanSort: false,
        //     Cell: (row: any) => {
        //         // console.log('ROw ', row);
        //         return convertUnixToIST(row.value);
        //     },
        // },
        {
            Header: 'Commissioned Date',
            accessor: 'createdAt',
            defaultCanSort: false,
            Cell: (row: any) => {
                // console.log('ROw ', row);
                return convertUnixToIST(row.value);
            },
        },
        // {
        //     Header: 'Status',
        //     accessor: 'status',
        //     defaultCanSort: false,
        //     Cell: (row: any) => {
        //         console.log('ROw ', row);
        //         return 'Active';
        //         // <div
        //         //     style={{
        //         //         display: 'flex',
        //         //         justifyContent: 'center',
        //         //         borderRadius: '5px',
        //         //         background: `${row.value === 'Online' ? 'green' : 'red'}`,
        //         //         color: 'white',
        //         //     }}>
        //         //     {row.value}
        //         // </div>
        //     },
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
    useEffect(() => {
        getAHUData();
    }, [floorId]);
    return (
        <Row style={{ paddingRight: '0' }}>
            <Col xs={12} style={{ paddingRight: '0' }}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">AHU Device List</h4>
                            </Col>
                        </Row>
                        {isEmpty && (
                            <Row>
                                <Col>
                                    <h4 className="header-title mb-3">No AHU devices installed here</h4>
                                </Col>
                            </Row>
                        )}
                        {!isLoading ? (
                            <Table
                                columns={columns}
                                data={tableData || []}
                                pageSize={5}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass=" mt-3 "
                                searchBoxClass="mb-2"
                            />
                        ) : (
                            <TableSkelton />
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default AHUDeviseTable;
