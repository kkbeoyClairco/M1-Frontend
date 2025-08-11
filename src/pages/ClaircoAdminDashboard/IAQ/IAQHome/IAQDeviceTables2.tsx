import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';
// import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getUserIdFromSession, getUserType, storeDataToSession } from 'utils/storageFunctions';
// import { URLSearchParams } from 'url';
// import alertIcon from 'assets/icons/caution.png';

import Select from 'react-select';
import { sessionKeys } from 'appConstants/sessionKeys';

import downloadIcon from 'assets/icons/downloads.png';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';

import { userType } from 'appConstants/claircoConstants';
import { getFloorsListForSelect } from 'utils/device/filters';
import DownloadModal1 from './DownloadModal1';
// const addIcon = `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001702/plus_u1czew.png`;
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
    data: any;
};
const selectTagAll = {
    value: '',
    label: 'All',
};
const IAQDeviseTable2 = ({ fetchOfflineIaqDevice ,data }: any) => {
    const [downloadModal, setDownloadModal] = useState(false);
    // const [deviceCreationModal, setDeviceCreationModal] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [iaqList, setIaqList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    // const [customersList, setCutomersList] = useState<any>([]);
    const [buildingList, setBuildingList] = useState<any>([]);
    const [floorList, setFloorList] = useState<any>([]);
    const [filter, setFilter] = useState<any>({});
    const [infoToModal, setInfotoModal] = useState({});
    // const [placeHolder, setPlacehoder] = useState();
    //Selected
    // const [customerSelected, setCustomerSelected] = useState<any>([]);
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
        const buildingId = data?.buildingId?._id ?? '';
        const deviceId = data?._id ?? '';
        const customerId = data?.customerId?._id;
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
        navigate(url);
    };
    //API Call
    const getIAQData = async (buildingId?: string) => {
        try {
            if (!buildingId) return;
            setIsLoading(true);
            const currentUserType = getUserType();
            const isCustomer = currentUserType === userType.Customer;
            if (isCustomer) buildingId = '';
            const deviceType = deviceTypesConstant.IAQ;
            const response = await fetchDevicesList(deviceType, customerId, '', buildingId ?? '');
            const data1 = response?.data?.records ?? [];
            if (data1?.length === 0) setIsEmpty(true);
            const floors = getFloorsListForSelect(data1);

            setFloorList(floors ?? []);
            setIaqList(data1);
            setTableData(data1 || []);
            //Check this state
            setDeviceExists(data1?.length > 0 ? true : false);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };

    const filterFloorsBasedOnBuilding = (buildingId: string) => {
        try {
            if (!buildingId) {
                const floorList = getFloorsListForSelect(iaqList);
                setFloorList(floorList ?? []);
                return;
            }
            const filterdFloors = iaqList.filter((item: any) => item?.buildingId?._id === buildingId);
            const floorList = getFloorsListForSelect(filterdFloors);
            setFloorList(floorList ?? []);
        } catch (error) {
            console.log(error);
        }
    };
    const handleFilterSelection = (e: any, state: string) => {
        try {
            switch (state) {
                case 'building':
                    setFilter((currentFilter: any) => ({
                        customerId: e?.customerId,
                        buildingId: { ...e },
                    }));
                    if (e.value !== buildingSelected?.value) getIAQData(e.value ?? '');
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
    const filterFloors = (data: any, buildingId: string) => {
        try {
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
        if (customerId) filteredData = filteredData.filter((item: any) => item?.customerId._id === customerId);

        if (buildingId) filteredData = filteredData.filter((item: any) => item?.buildingId._id === buildingId);
        if (floorId) filteredData = filteredData.filter((item: any) => item?.floorId?._id === floorId);
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
        if (!data) return;
        const defaultBuilding = data?.buildings?.[0] ?? {};

        if (defaultBuilding) setBuildingSelected(defaultBuilding);

        getIAQData(defaultBuilding?.value ?? '');
        fetchOfflineIaqDevice(defaultBuilding?.value ?? '');
        if (!defaultBuilding) return;
        const filteredFloors = data?.floors?.filter((doc: any) => doc.buildingId === defaultBuilding?.value);
        const buildingsList = data?.buildings ?? [];
        const floorsList = filteredFloors;
        // buildingsList?.unshift(selectTagAll);
        floorsList?.unshift(selectTagAll);
        setBuildingList(buildingsList ?? []);
        setFloorList(floorsList ?? []);
    }, [data]);
    useEffect(() => {
        if (filter.buildingId || filter.floorId || filter.customerId) {
            const filteredData = filterData(filter, iaqList);
            setTableData(filteredData ?? []);
            storeDataToSession(sessionKeys.IAQFilterKey, JSON.stringify(filter));
        }
    }, [filter]);

    return (
        <>
            {downloadModal && (
                <DownloadModal1
                    modalState={downloadModal}
                    modalControlFn={handleDownloadModal}
                    // deviceId={deviceId}
                    dataArray={iaqList}
                    floorsData={floorList}
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
                            {/* {isAdminOrNot && (
                                // <div
                                //     className="mx-2"
                                //     style={{ textAlign: 'center', cursor: 'pointer' }}
                                //     onClick={handleAddClick}>
                                //     {' '}
                                //     <img src={addIcon} alt="" height={'55%'} />
                                //     <h6 style={{ fontSize: '10px', textAlign: 'center' }}>Add new</h6>
                                // </div>
                            )} */}
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
                        {/* {!isLoading ? (
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
                        ) : null}{' '} */}
                        {!isLoading ? (
                            <Col xs={4}>
                                {' '}
                                <Select
                                    options={buildingList}
                                    onChange={(e) => handleFilterSelection(e, 'building')}
                                    placeholder={'Select Building'}
                                    value={Object.keys(buildingSelected ?? {})?.length < 1 ? null : buildingSelected}
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

export default React.memo(IAQDeviseTable2);
