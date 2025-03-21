import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
// import { data as Sites } from './occupancyData';

import { Row, Col, Card } from 'react-bootstrap';
import { occupancyTables } from './types';
import { useNavigate } from 'react-router-dom';
import { getOccupancyDeviceList } from 'helpers/api/services/Clairco/customerSide/occupancy';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertEpochToIST } from 'utils/claircoFunctions';
import { convertUnixToIST, getCurrentEpochTime } from 'utils/timeFunctions';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getUserDetailsFromSession } from 'utils/storageFunctions';
import { useRedux } from 'hooks';
type NewType = CellFormatter<occupancyTables>;
interface Params {
    fanSpeedDict: Record<string, any>;
    modeDict: Record<string, any>;
}

interface Registers {
    Status: number;
    Mode: number;
    FanSpeed: number;
    SetTemp: number;
    AmbTemp: number;
}

interface MetaData {
    occupancy_number: number;
    linked_ahu: string;
}

interface Occupancy {
    _id: string;
    deviceId: string;
    metaData: MetaData;

    epochTime?: number;
}

interface DataItem {
    _id: string;
    name: string;
    deviceType: string;
    locationId: string;
    buildingId: string;
    floorId: string;
    dataUpdatedTime: string;
    createdAt: string;
    updatedAt: string;
    parentDeviceId: string;
    occupancy: Occupancy;
}

interface DataItem {
    data: {
        occupancy_number: Number;
        epochTime: Number;
        aliasName?: string;
        buildingId: string;
        createdAt: string;
        dataUpdatedTime: string;
        deviceType: string;
        floorId: string;
        gateway: string;
        locationId: string;
        name: string;
        params: Params;
        parentDeviceId: string;
        registers: Registers;
        updatedAt: string;
        id: string;
    };
}

const OccupancyTable = ({ setOccupantsNumber, setOccupancyLastUpdated, customerId }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    // const [dataToTable, setDataToTable] = useState({});
    const navigate = useNavigate();
    const { dispatch, appSelector } = useRedux();

    const {
        activeFloor: { floorId },
    } = appSelector((state: any) => state.HomePageReducer);
    //Function to navigate to devise specific page
    const handleNavigation = (id: string) => {
        // console.log('id to navigate', id);
        navigate(`/customer/occupancy/${id}`, { state: { deviceId: id } });
    };
    // const loggedInUserdata = getUserDetailsFromSession();

    const getDataForTable = async () => {
        try {
            setIsLoading(true);
            const deviceId = deviceTypeId['Occupancy'];
            const response: any = await fetchDevicesList(deviceId, customerId, floorId);
            const { data: OccupancyArray } = response;
            // console.log('Occupants number', OccupancyArray);
            // if (OccupancyArray && OccupancyArray.data) {
            const occupancyNumber = OccupancyArray.reduce((sum: number, currentValue: DataItem) => {
                const time = Number(currentValue?.data?.epochTime);
                const currentTime = getCurrentEpochTime();
                if (currentTime - time <= 600) sum = sum + (Number(currentValue?.data?.occupancy_number) || 0);
                return sum;
            }, 0);
            // console.log('COunt:', occupancyNumber);
            if (OccupancyArray.length === 0) setIsEmpty(true);
            setTableData(OccupancyArray);
            setOccupantsNumber(occupancyNumber);
            setIsLoading(false);
            // }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    const ActionColumn = ({ row }: NewType) => {
        return (
            <div className="action-icon">
                <div style={{}}>
                    <i className="mdi mdi-eye me-3" onClick={() => handleNavigation(row.original.name)}></i>
                    {/* <i className="mdi mdi- dripicons-gear"></i> */}
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Zones',
            accessor: 'zoneId',
            defaultCanSort: false,
        },
        {
            Header: 'Device Name',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Occupants ',
            accessor: 'data.occupancy_number',
            defaultCanSort: true,
        },

        {
            Header: 'Last Updated',
            accessor: 'data.epochTime',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
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
        getDataForTable();
    }, [floorId]);
    return (
        <Row style={{ paddingRight: '0' }}>
            <Col xs={12} style={{ paddingRight: '0' }}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">Occupancy Details</h4>
                            </Col>
                        </Row>
                        {isEmpty && (
                            <Row>
                                <Col>
                                    <h4 className="header-title mb-3">No Occupancy devices installed here</h4>
                                </Col>
                            </Row>
                        )}
                        {!isLoading ? (
                            <Table
                                columns={columns}
                                data={tableData}
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

export default OccupancyTable;
