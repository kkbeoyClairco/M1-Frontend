import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { useNavigate } from 'react-router-dom';
import { fetchAHUDeviceList } from 'helpers/api/services/Clairco/customerSide/ahu';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserDetailsFromSession, getUserIdFromSession } from 'utils/storageFunctions';
import { useRedux } from 'hooks';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { date, setLocale } from 'yup';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';
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
const ThermopileDevicePage = ({ setTotalDevices }: any) => {
    const [tableData, setTableData] = useState([
        {
            // _id: '67c6c8bad14eb2beb538a30d',
            name: 'S1',
            customerId: '67c6c75ad14eb2beb538a30b',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floorId: '67b4575da7bfc488c4831acf',
            // switchDeviceId: '67b46001a2d826c53ebd7d46',
            building: 'Tesco Blr',
            location: 'Bangalore',
            // building: 'BIEC',
            floor: '1st',
            // floor: 'Hall 5',
            zone: 'Table 1',
        },
        {
            // _id: '67c6c8bad14eb2beb538a30d',
            name: 'S2',
            customerId: '67c6c75ad14eb2beb538a30b',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floorId: '67b4575da7bfc488c4831acf',
            // switchDeviceId: '67b46001a2d826c53ebd7d46',
            building: 'Tesco Blr',
            location: 'Bangalore',
            // building: 'BIEC',
            floor: '1st',
            // floor: 'Hall 5',
            zone: 'Table 2',
        },
        {
            // _id: '67c6c8bad14eb2beb538a30d',
            name: '6_Seater',
            customerId: '67c6c75ad14eb2beb538a30b',
            buildingId: '67c6c8bad14eb2beb538a30d',
            floorId: '67b4575da7bfc488c4831acf',
            // switchDeviceId: '67b46001a2d826c53ebd7d46',
            building: 'Tesco Blr',
            location: 'Bangalore',
            // building: 'BIEC',
            floor: '1st',
            // floor: 'Hall 5',
            zone: '6_Seater',
        },
    ]);
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
            const deviceId = deviceTypeId['AHU'];
            // const { customerId } = data;

            const customerId = '67b45646a7bfc488c4831ab4';
            const response = await fetchDevicesList(deviceId, customerId, floorId);
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
        // const id = data?._id ?? '';
        const buildingName = data?.building ?? '	';
        const floorName = data?.floor ?? '	';
        const zone = data?.zone ?? '	';

        // const floorId = data?.floorId?._id ?? '';
        const location = data?.location ?? '';
        const deviceName = data?.name ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('location', location);
        searchParam.append('building', buildingName);
        searchParam.append('floorName', floorName);
        searchParam.append('deviceName', deviceName);
        searchParam.append('zone', zone);

        // const name = data?.name ?? '';
        // const sensorName = data?.switchDeviceId?.name ?? '';
        // const btuName = data?.btuDeviceId?.name ?? '';
        // console.log('Thermopile nav data', data, deviceName);
        // searchParam.append('btuSensor', btuName);
        // searchParam.append('ahuSensor', sensorName);
        // searchParam.append('ahuId', id);

        // searchParam.append('floorId', floorId);
        // searchParam.append('zone', zone);

        // console.log('id to navigate', floorId);
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
        // {
        //     Header: 'Customer',
        //     accessor: 'customer',
        //     defaultCanSort: true,
        // },

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
            Header: 'Updated on',
            accessor: 'updatedAt',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(Date?.now());
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
        // getAHUData();
    }, []);
    return (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    <Col>
                        <h4 className="header-title mb-3">Thermopile Devices </h4>
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
                    <TableSkelton2 />
                )}
            </Card.Body>
        </Card>
    );
};

export default ThermopileDevicePage;
