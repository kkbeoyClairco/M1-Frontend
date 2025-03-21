import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { useNavigate } from 'react-router-dom';
import { fetchAHUDeviceList } from 'helpers/api/services/Clairco/customerSide/ahu';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserDetailsFromSession, getUserIdFromSession } from 'utils/storageFunctions';
import { useRedux } from 'hooks';
import { deviceTypeId, deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { setLocale } from 'yup';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import NoDevice from 'components/ClaircoGeneral/NoDevice';
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

type ColumnType = CellFormatter<DeviseTables>;
const AHUDevicesTable = ({ setTotalDevices }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { isAdmin, id } = getUserIdFromSession();
    // console.log('Session storage:', isAdmin, id);

    const data = getUserDetailsFromSession();
    const { dispatch, appSelector } = useRedux();

    const {
        activeFloor: { floorId },
    } = appSelector((state: any) => state.HomePageReducer);

    const getAHUData = async () => {
        try {
            setIsLoading(true);
            const deviceType = deviceTypesConstant.AHU;
            const response = await fetchDevicesList(deviceType);
            if (response?.data.length === 0) setIsEmpty(true);

            setTableData(response?.data || []);
            // console.log('AHu', response);
            setTotalDevices(response?.data?.length);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    //Function to navigate to devise specific page
    const handleNavigation = (data: any) => {
        // console.log('AHU Nav data', data);
        const id = data?.id;
        const buildingName = data?.buildingId.name ?? '';
        const floorName = data?.floorId?.name ?? '';
        const floorId = data?.floorId?.id;
        const location = data?.buildingId?.location ?? '';
        // const name = data?.name ?? '';

        const sensorName = data?.switchDeviceId?.name ?? '';
        const ahuName = data?.name ?? '';
        const btuName = data?.btuDeviceId?.name ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('location', location);
        searchParam.append('building', buildingName);
        searchParam.append('floorName', floorName);
        searchParam.append('ahuName', ahuName);
        searchParam.append('btuSensor', btuName);
        searchParam.append('ahuSensor', sensorName);
        searchParam.append('ahuId', id);
        searchParam.append('floorId', floorId);

        navigate(`${searchParam}`, {
            // state: { sensorName: sensorName, deviceName: name, btuName, id, floorId },
        });
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
            Header: 'Device',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Updated on',
            accessor: 'updatedAt',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
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
        getAHUData();
    }, []);
    return isEmpty ? (
        <NoDevice name={'AHU'} />
    ) : (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    <Col>
                        <h4 className="header-title mb-3">AHU Devices </h4>
                    </Col>
                </Row>

                {!isLoading ? (
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
                ) : (
                    <TableSkelton />
                )}
            </Card.Body>
        </Card>
    );
};

export default AHUDevicesTable;
