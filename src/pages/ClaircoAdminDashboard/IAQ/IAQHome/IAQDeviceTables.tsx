import React, { useEffect, useRef, useState } from 'react';
import { CellFormatter, Table } from 'components';
// import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deviceTypeId, deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getDataFromSession, getUserIdFromSession, isAdmin, storeDataToSession } from 'utils/storageFunctions';
// import { URLSearchParams } from 'url';
// import alertIcon from 'assets/icons/caution.png';

import Select from 'react-select';
import { sessionKeys } from 'appConstants/sessionKeys';

import downloadIcon from 'assets/icons/downloads.png';
import DownloadModal from './DownloadModal';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';
import IAQDeviceCreation from './IAQDeviceCreation';
const addIcon = `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001702/plus_u1czew.png`;
// import { sampleTableTestData } from '../test';
const placeHolder = {
    customer: 'Select Customer',
    building: 'Select Building',
    floor: 'Select Floor',
};
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

const IAQDeviseTable = ({ setTotalDevices, setOfflineCount }: any) => {
    const [downloadModal, setDownloadModal] = useState(false);
    const [deviceCreationModal, setDeviceCreationModal] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [iaqList, setIaqList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    const [customersList, setCutomersList] = useState<any>([]);
    const [buildingList, setBuildingList] = useState<any>([]);
    const [floorList, setFloorList] = useState<any>([]);
    const [filter, setFilter] = useState<any>({});
    const [infoToModal, setInfotoModal] = useState({});
    // const [placeHolder, setPlacehoder] = useState();
    //Selected
    const [customerSelected, setCustomerSelected] = useState<any>([]);
    const [floorSelected, setFloorSelected] = useState<any>([]);
    const [buildingSelected, setBuildingSelected] = useState<any>([]);

    const { customerId = '', buildingId = '' } = getUserIdFromSession();
    const { isAdmin } = getUserIdFromSession();
    const isAdminOrNot = isAdmin === 'Admin';
    const navigate = useNavigate();
    //Navigation
    const handleNavigation = (data: any) => {
        const name = data?.name ?? '';
        const buildingName = data?.buildingId?.name ?? '';
        const locationName = data?.locationId?.name ?? '';
        const floorName = data?.floorId?.name ?? '';
        const buildingId = data?.buildingId?.id ?? '';
        const deviceId = data?.id ?? '';
        const customerId = data?.customerId?.id;
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);
        searchParam.append('deviceId', deviceId);
        searchParam.append('customerId', customerId);
        searchParam.append('building', buildingName);
        searchParam.append('buildingId', buildingId);

        let url = `${searchParam.toString()}`;
        // console.log('Nav data', data, buildingId, url);
        navigate(url);
    };
    //API Call
    const getIAQData = async () => {
        try {
            // if (!customerId) return;
            setIsLoading(true);
            const deviceType = deviceTypesConstant.IAQ;
            const response = await fetchDevicesList(deviceType, customerId, '', buildingId ?? '');
            setIaqList(response?.data?.records); //Sets data as a referece for the filter
            if (response?.data?.records?.length === 0) setIsEmpty(true);
            let filtered = response?.data?.records; //Unfiltered
            getBuildingAndFloorList(filtered); //Populates the building and floor list for Selection
            // console.log('IAQ device List', filtered); ////Saved Filters

            // const filtersSaved = getDataFromSession(sessionKeys.IAQFilterKey);

            // if (filtersSaved) {
            //     filtered = filterData(filtersSaved, filtered);
            //     console.log('filtered', filtered);
            // }
            setTableData(response?.data?.records ?? []);
            setDeviceExists(response?.data?.records?.length > 0 ? true : false);
            setIsLoading(false);
            setTotalDevices(response?.data?.records?.length);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    // Creates floorList in a format that can be used in the select component
    const getFloorsListForSelect = (data: any) => {
        try {
            const floorMap = new Map();
            floorMap.set('Others', {
                value: '',
                label: 'All',
            });
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.floorId?.id)
                    floorMap.set(data?.[i]?.floorId?.id, {
                        value: data?.[i]?.floorId?.id,
                        label: data?.[i]?.floorId?.name,
                    });
            }
            const floorList = Array.from(floorMap.values());
            return floorList;
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomersListForSelect = (data: any) => {
        try {
            const customerMap = new Map();
            customerMap.set('Others', {
                value: '',
                label: 'All',
            });

            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.customerId?.id)
                    customerMap.set(data?.[i]?.customerId?.id, {
                        label: data?.[i]?.customerId?.name ?? '',
                        value: data?.[i]?.customerId?.id ?? '',
                    });
            }
            const customerList = Array.from(customerMap.values());
            return customerList;
        } catch (error) {
            console.log(error);
        }
    };
    // Creates buildingList in a format that can be used in the select component
    const getBuidinglListForSelect = (data: any) => {
        try {
            const buildingMap = new Map();
            buildingMap.set('Others', {
                value: '',
                label: 'All',
            });
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.buildingId?.id)
                    buildingMap.set(data?.[i]?.buildingId?.id, {
                        label: data?.[i]?.buildingId?.name ?? '',
                        value: data?.[i]?.buildingId?.id ?? '',
                    });
            }
            const buildingList = Array.from(buildingMap.values());
            return buildingList;
        } catch (error) {
            console.log(error);
        }
    };

    const getBuildingAndFloorList = (data: any) => {
        try {
            let customerList;
            if (isAdminOrNot) {
                customerList = getCustomersListForSelect(data);
                setCutomersList(customerList);
            }
            const buildingList = getBuidinglListForSelect(data);
            const floorList = getFloorsListForSelect(data);

            setBuildingList(buildingList);
            setFloorList(floorList);
            setInfotoModal({
                customerList,
                buildingList,
                floorList,
            });
        } catch (error) {
            console.log(error);
            setBuildingList([]);
            setFloorList([]);
        }
    };
    const filterBuildingsBasedOnCustomer = (customerId: string) => {
        try {
            if (!customerId) {
                const buildingList = getBuidinglListForSelect(iaqList);
                // console.log('customerId', buildingList);
                setBuildingList(buildingList ?? []);
                return;
            }
            const filterdBuildings = iaqList.filter((item: any) => item?.customerId?.id === customerId);
            const buildingList = getBuidinglListForSelect(filterdBuildings);
            setBuildingList(buildingList ?? []);
        } catch (error) {
            console.log(error);
        }
    };
    const filterFloorsBasedOnBuilding = (buildingId: string) => {
        try {
            if (!buildingId) {
                const floorList = getFloorsListForSelect(iaqList);
                setFloorList(floorList ?? []);
                return;
            }
            const filterdFloors = iaqList.filter((item: any) => item?.buildingId?.id === buildingId);
            const floorList = getFloorsListForSelect(filterdFloors);
            setFloorList(floorList ?? []);
        } catch (error) {
            console.log(error);
        }
    };
    const handleFilterSelection = (e: any, state: string) => {
        try {
            switch (state) {
                case 'customer':
                    setFilter({ customerId: { ...e } });
                    filterBuildingsBasedOnCustomer(e.value);
                    setCustomerSelected(e);
                    setBuildingSelected({});
                    setFloorList([]);
                    setFloorSelected({});
                    break;
                case 'building':
                    setFilter((currentFilter: any) => ({
                        customerId: currentFilter?.customerId,
                        buildingId: { ...e },
                    }));
                    filterFloorsBasedOnBuilding(e.value);
                    // setFloorList([]);
                    setBuildingSelected(e);
                    setFloorSelected({});
                    break;
                case 'floor':
                    setFilter({ ...filter, floorId: { ...e } });
                    setFloorSelected(e);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Filter Function
    const filterData = (filter: any, data: any) => {
        const customerId = filter?.customerId?.value ?? '';
        const buildingId = filter?.buildingId?.value ?? '';
        const floorId = filter?.floorId?.value ?? '';
        let filteredData = data;
        if (customerId) filteredData = filteredData.filter((item: any) => item?.customerId.id === customerId);

        if (buildingId) filteredData = filteredData.filter((item: any) => item?.buildingId.id === buildingId);
        if (floorId) filteredData = filteredData.filter((item: any) => item?.floorId?.id === floorId);
        return filteredData;
    };
    const handleDownloadModal = async () => {
        try {
            if (isLoading) return;
            setDownloadModal((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };
    const handleAddClick = async () => {
        try {
            console.log('Add new Click');
            setDeviceCreationModal((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
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
            Header: 'Device',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Updated on',
            accessor: 'dataUpdatedAt',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                if (!value) return '-';
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
        console.log('Fileters', filter);
        if (filter.buildingId || filter.floorId || filter.customerId) {
            const filteredData = filterData(filter, iaqList);
            setTableData(filteredData ?? []);
            storeDataToSession(sessionKeys.IAQFilterKey, JSON.stringify(filter));
        }
    }, [filter]);

    return (
        <>
            {downloadModal && (
                <DownloadModal
                    modalState={downloadModal}
                    modalControlFn={handleDownloadModal}
                    // deviceId={deviceId}
                    dataArray={iaqList}
                    floorsData={floorList}
                />
            )}
            {deviceCreationModal && (
                <IAQDeviceCreation
                    show={deviceCreationModal}
                    data={infoToModal}
                    // onSubmit={handleDeviceCreation}
                    onClose={() => setDeviceCreationModal(false)}
                />
            )}
            <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 " style={{ color: 'black' }}>
                <Card.Body>
                    <Row style={{ marginBottom: '1em' }}>
                        <Col xxl={8}>
                            <h4 className="header-title mb-3">IAQ Device List</h4>
                        </Col>
                        <Col
                            xxl={4}
                            style={{
                                minWidth: '200px',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'end',
                                alignContent: 'baseline',
                                height: '30px',
                            }}>
                            {isAdminOrNot && (
                                <div
                                    className="mx-2"
                                    style={{ textAlign: 'center', cursor: 'pointer' }}
                                    onClick={handleAddClick}>
                                    {' '}
                                    <img src={addIcon} alt="" height={'55%'} />
                                    <h6 style={{ fontSize: '10px', textAlign: 'center' }}>Add new</h6>
                                </div>
                            )}
                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleDownloadModal}>
                                {' '}
                                <img src={downloadIcon} alt="" height={'55%'} style={{}} />
                                <h6 style={{ fontSize: '10px', textAlign: 'center' }}>Download</h6>
                            </div>{' '}
                        </Col>
                    </Row>
                    {!deviceExists && (
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">No IAQ devices installed here</h4>
                            </Col>
                        </Row>
                    )}
                    <Row style={{ marginBottom: '1em' }}>
                        {' '}
                        {!isLoading ? (
                            <Col xs={4}>
                                {isAdminOrNot ? (
                                    <Select
                                        options={customersList}
                                        onChange={(e) => handleFilterSelection(e, 'customer')}
                                        placeholder={placeHolder.customer}
                                        value={customerSelected ?? null}
                                    />
                                ) : null}
                            </Col>
                        ) : null}{' '}
                        {!isLoading ? (
                            <Col xs={4}>
                                {' '}
                                <Select
                                    options={buildingList}
                                    onChange={(e) => handleFilterSelection(e, 'building')}
                                    placeholder={'Select Building'}
                                    value={Object.keys(buildingSelected).length < 1 ? null : buildingSelected}
                                />
                            </Col>
                        ) : null}
                        {!isLoading ? (
                            <Col xs={4}>
                                {' '}
                                <Select
                                    options={floorList}
                                    onChange={(e) => handleFilterSelection(e, 'floor')}
                                    placeholder={'Select Floor'}
                                    value={Object.keys(floorSelected).length < 1 ? null : floorSelected}
                                />
                            </Col>
                        ) : null}
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
        </>
    );
};

export default React.memo(IAQDeviseTable);
