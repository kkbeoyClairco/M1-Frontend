import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';
// import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getDataFromSession, getUserIdFromSession, storeDataToSession } from 'utils/storageFunctions';
// import { URLSearchParams } from 'url';
import Select from 'react-select';
import { sessionKeys } from 'appConstants/sessionKeys';
import NoDevice from 'components/ClaircoGeneral/NoDevice';

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

const IAQDeviseTable = ({ setTotalDevices }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    const [buildingList, setBuildingList] = useState<any>([]);
    const [floorList, setFloorList] = useState<any>([]);
    const [filter, setFilter] = useState<any>({});

    const { customerId } = getUserIdFromSession();

    const navigate = useNavigate();
    //Navigation
    const handleNavigation = (data: any) => {
        const name = data?.name ?? '';
        const buildingName = data?.buildingId?.name ?? '';
        const locationName = data?.locationId?.name ?? '';
        const floorName = data?.floorId?.name ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);

        let url = `${searchParam.toString()}`;

        navigate(url);
    };
    //API Call
    const getIAQData = async () => {
        try {
            // console.log('IAQ Table', customerId);
            if (!customerId) return;
            setIsLoading(true);
            const deviceId = deviceTypeId['IAQ'];
            const response = await fetchDevicesList(deviceId, customerId);
            if (response?.data.length === 0) setIsEmpty(true);
            let filtered = response?.data;
            const filtersSaved = getDataFromSession(sessionKeys.IAQFilterKey);

            if (filtersSaved) {
                filtered = filterData(filtersSaved, filtered);
                // console.log('filtered', filtered);
            }
            getBuildingAndFloorList(filtered); //Populates the building and floor list for Selection
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

    const getBuildingAndFloorList = (data: any) => {
        try {
            const buildingMap = new Map();
            const floorMap = new Map();
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.floorId?._id)
                    floorMap.set(data?.[i]?.floorId?._id, {
                        value: data?.[i]?.floorId?._id,
                        label: data?.[i]?.floorId?.name,
                    });
                if (data?.[i]?.buildingId)
                    buildingMap.set(data?.[i]?.buildingId, {
                        label: data?.[i]?.buildingId?.name ?? 'dummy',
                        value: data?.[i]?.buildingId.id ?? '',
                    });
            }
            const buildingList = Array.from(buildingMap.values());
            const floorList = Array.from(floorMap.values());
            setBuildingList(buildingList);
            setFloorList(floorList);
        } catch (error) {
            console.log(error);
            setBuildingList([]);
            setFloorList([]);
        }
    };

    const handleFilterSelection = (e: any, state: string) => {
        try {
            switch (state) {
                case 'building':
                    setFilter({ buildingId: { ...e } });
                    break;
                case 'floor':
                    setFilter({ ...filter, floorId: { ...e } });
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Filter Function
    const filterData = (filter: any, data: any) => {
        const customerId = filter?.customerId ?? '';
        const buildingId = filter?.buildingId?.value ?? '';
        const floorId = filter?.floorId?.value ?? '';
        console.log('filter', filter);
        let filteredData = data;
        if (buildingId) filteredData = filteredData.filter((item: any) => item?.buildingId === buildingId);
        if (floorId) filteredData = filteredData.filter((item: any) => item?.floorId?._id === floorId);
        return filteredData;
    };
    //Table action Column
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
        // {
        //     Header: 'Customer',
        //     accessor: 'customer',
        //     defaultCanSort: true,
        // },

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
        // {
        //     Header: 'Status',
        //     accessor: 'health_status',
        //     defaultCanSort: false,
        // },

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
        getIAQData();
        const filterData = getDataFromSession(sessionKeys.IAQFilterKey);
        if (filterData?.buildingId || filterData?.floorId) {
            const { buildingId = {}, floorId = {} } = filterData ?? {};
            setFilter({ buildingId, floorId });
        }
    }, []);
    useEffect(() => {
        if (filter.buildingId || filter.floorId) {
            const filteredData = filterData(filter, tableData);
            setTableData(filteredData ?? []);
            storeDataToSession(sessionKeys.IAQFilterKey, JSON.stringify(filter));
        }
    }, [filter]);
    return isEmpty ? (
        <NoDevice name={'IAQ'} />
    ) : (
        <Row style={{ paddingRight: '0px' }}>
            {/* <Col xs={12}> */}
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <h4 className="header-title mb-3">IAQ Device List</h4>
                        </Col>
                    </Row>
                    {!deviceExists && (
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">No IAQ devices installed here</h4>
                            </Col>
                        </Row>
                    )}{' '}
                    <Row>
                        {' '}
                        <Col xs={4}></Col>
                        <Col xs={4}>
                            {' '}
                            <Select options={buildingList} onChange={(e) => handleFilterSelection(e, 'building')} />
                        </Col>{' '}
                        <Col xs={4}>
                            {' '}
                            <Select options={floorList} onChange={(e) => handleFilterSelection(e, 'floor')} />
                        </Col>{' '}
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
            {/* </Col> */}
        </Row>
    );
};

export default IAQDeviseTable;
