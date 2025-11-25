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

import { sessionKeys } from 'appConstants/sessionKeys';

import DownloadModal from './DownloadModal';
import { occupancyList } from 'appConstants/dataToSvg';
// import { sampleTableTestData } from '../test';

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
    const [downloadModal, setDownloadModal] = useState(false);

    const [tableData, setTableData] = useState<any[]>([
        {
            name: 'IAQ_GRR1',
            deviceId: '',
            customer: 'Clairco',
            zone: 'Unit 1 GRR',
            location: 'Bangalore',
            building: 'BAN-04',
            floor: ' Floor 5',
            buildingId: '67e64d3855cf882553c9f44d',
            customerId: '67e64c8e55cf882553c9f44b',
        },
        {
            name: 'IAQ_GRR2',
            deviceId: '',
            customer: 'Clairco',
            zone: 'Unit 2 GRR',
            location: 'Bangalore',
            building: 'BAN-04',
            floor: ' Floor 5',
            buildingId: '67e64d3855cf882553c9f44d',
            customerId: '67e64c8e55cf882553c9f44b',
        },
        {
            name: 'IAQ_LRR1',
            deviceId: '',
            customer: 'Clairco',
            zone: 'Unit 1 LRR',
            location: 'Bangalore',
            building: 'BAN-04',
            floor: ' Floor 5',
            buildingId: '67e64d3855cf882553c9f44d',
            customerId: '67e64c8e55cf882553c9f44b',
        },
        {
            name: 'IAQ_LRR2',
            deviceId: '',
            customer: 'Clairco',
            zone: 'Unit 2 LRR',
            location: 'Bangalore',
            building: 'BAN-04',
            floor: ' Floor 5',
            buildingId: '67e64d3855cf882553c9f44d',
            customerId: '67e64c8e55cf882553c9f44b',
        },
    ]);
    const [iaqList, setIaqList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    const [customersList, setCutomersList] = useState<any>([]);
    const [buildingList, setBuildingList] = useState<any>([]);
    const [floorList, setFloorList] = useState<any>([]);
    const [filter, setFilter] = useState<any>({});
    const [placeHolder, setPlacehoder] = useState({
        customer: 'Select Customer',
        building: 'Select Building',
        floor: 'Select Floor',
    });
    const { customerId = '', buildingId = '' } = getUserIdFromSession();

    //Selected
    const [customerSelected, setCustomerSelected] = useState<any>([]);
    const [floorSelected, setFloorSelected] = useState<any>([]);
    const [buildingSelected, setBuildingSelected] = useState<any>([]);
    const { isAdmin } = getUserIdFromSession();
    const isAdminOrNot = isAdmin === 'Admin';
    const navigate = useNavigate();
    //Navigation
    const handleNavigation = (data: any) => {
        const name = data?.name ?? '';
        const buildingName = data?.building ?? '';
        const locationName = data?.location ?? '';
        const floorName = data?.floor ?? '';
        const zone = data?.zone ?? '';
        // const deviceId = data?._id ?? '';
        // const customerId = data?.customerId?._id;
        // console.log('Data', data);
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);
        searchParam.append('zone', zone);
        // searchParam.append('customerId', customerId);
        // searchParam.append('building', buildingName);
        // searchParam.append('buildingId', buildingId);

        let url = `${searchParam.toString()}`;
        // console.log('Nav data', data, url);

        navigate(url);
    };
    //API Call
    const getIAQData = async () => {
        try {
            // if (!customerId) return;
            setIsLoading(true);
            const deviceId = deviceTypeId['IAQ'];
            const response = { data: occupancyList };
            // await fetchDevicesList(deviceId, customerId, '', buildingId ?? '');
            // let sampleTestData = [];
            // // sampleTableTestData;
            // for (let i = 0; i < 10000; i++) {
            // for (let i = 0; i < 1000; i++) {
            //     sampleTestData[i] = {
            //         ...sampleTableTestData[0],
            //         name: sampleTableTestData[0].name + i,
            //         customerId: {
            //             ...sampleTableTestData[0].customerId,
            //             name: sampleTableTestData[0].customerId.name + i,
            //         },
            //         buildingId: {
            //             ...sampleTableTestData[0].buildingId,
            //             name: sampleTableTestData[0].buildingId.name + i,
            //         },
            //         floorId: { ...sampleTableTestData[0].floorId, name: sampleTableTestData[0].floorId.name + i },
            //     };
            // }
            // console.log('SampleTestData', sampleTestData);
            // // }
            setIaqList(response?.data); //Sets data as a referece for the filter
            if (response?.data.length === 0) setIsEmpty(true);
            // let filtered = response?.data;
            // console.log('Response', filtered);
            // getBuildingAndFloorList(filtered); //Populates the building and floor list for Selection
            // console.log('IAQ', response);
            // const filtersSaved = getDataFromSession(sessionKeys.IAQFilterKey);

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
    // Creates floorList in a format that can be used in the select component
    // const getFloorsListForSelect = (data: any) => {
    //     try {
    //         const floorMap = new Map();
    //         floorMap.set('Others', {
    //             value: '',
    //             label: 'None',
    //         });
    //         for (let i = 0; i < data.length; i++) {
    //             if (data?.[i]?.floorId?._id)
    //                 floorMap.set(data?.[i]?.floorId?._id, {
    //                     value: data?.[i]?.floorId?._id,
    //                     label: data?.[i]?.floorId?.name,
    //                 });
    //         }
    //         const floorList = Array.from(floorMap.values());
    //         return floorList;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const getCustomersListForSelect = (data: any) => {
    //     try {
    //         const customerMap = new Map();
    //         customerMap.set('Others', {
    //             value: '',
    //             label: 'None',
    //         });

    //         for (let i = 0; i < data.length; i++) {
    //             if (data?.[i]?.customerId?._id)
    //                 customerMap.set(data?.[i]?.customerId?._id, {
    //                     label: data?.[i]?.customerId?.name ?? '',
    //                     value: data?.[i]?.customerId?._id ?? '',
    //                 });
    //         }
    //         const customerList = Array.from(customerMap.values());
    //         return customerList;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // // Creates buildingList in a format that can be used in the select component
    // const getBuidinglListForSelect = (data: any) => {
    //     try {
    //         const buildingMap = new Map();
    //         buildingMap.set('Others', {
    //             value: '',
    //             label: 'None',
    //         });
    //         for (let i = 0; i < data.length; i++) {
    //             if (data?.[i]?.buildingId?._id)
    //                 buildingMap.set(data?.[i]?.buildingId?._id, {
    //                     label: data?.[i]?.buildingId?.name ?? '',
    //                     value: data?.[i]?.buildingId?._id ?? '',
    //                 });
    //         }
    //         const buildingList = Array.from(buildingMap.values());
    //         return buildingList;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const getBuildingAndFloorList = (data: any) => {
    //     try {
    //         // console.log('Building', buildingList, floorList);
    //         let customerList;
    //         if (isAdminOrNot) {
    //             customerList = getCustomersListForSelect(data);
    //             setCutomersList(customerList);
    //         }
    //         const buildingList = getBuidinglListForSelect(data);
    //         const floorList = getFloorsListForSelect(data);

    //         setBuildingList(buildingList);
    //         setFloorList(floorList);
    //     } catch (error) {
    //         console.log(error);
    //         setBuildingList([]);
    //         setFloorList([]);
    //     }
    // };
    // const filterBuildingsBasedOnCustomer = (customerId: string) => {
    //     try {
    //         if (!customerId) {
    //             const buildingList = getBuidinglListForSelect(iaqList);
    //             // console.log('customerId', buildingList);
    //             setBuildingList(buildingList ?? []);
    //             return;
    //         }
    //         const filterdBuildings = iaqList.filter((item: any) => item?.customerId?._id === customerId);
    //         const buildingList = getBuidinglListForSelect(filterdBuildings);
    //         // console.log('Filtered Building List', Object.keys(buildingList ?? []).length);
    //         setBuildingList(buildingList ?? []);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const filterFloorsBasedOnBuilding = (buildingId: string) => {
    //     try {
    //         if (!buildingId) {
    //             const floorList = getFloorsListForSelect(iaqList);
    //             setFloorList(floorList ?? []);
    //             return;
    //         }
    //         const filterdFloors = iaqList.filter((item: any) => item?.buildingId?._id === buildingId);
    //         const floorList = getFloorsListForSelect(filterdFloors);
    //         setFloorList(floorList ?? []);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const handleFilterSelection = (e: any, state: string) => {
    //     try {
    //         switch (state) {
    //             case 'customer':
    //                 setFilter({ customerId: { ...e } });
    //                 filterBuildingsBasedOnCustomer(e.value);
    //                 setCustomerSelected(e);
    //                 setBuildingSelected({});
    //                 setFloorList([]);
    //                 setFloorSelected({});
    //                 break;
    //             case 'building':
    //                 setFilter((currentFilter: any) => ({
    //                     customerId: currentFilter?.customerId,
    //                     buildingId: { ...e },
    //                 }));
    //                 filterFloorsBasedOnBuilding(e.value);
    //                 // setFloorList([]);
    //                 setBuildingSelected(e);
    //                 setFloorSelected({});
    //                 break;
    //             case 'floor':
    //                 setFilter({ ...filter, floorId: { ...e } });
    //                 setFloorSelected(e);
    //                 break;
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // Filter Function
    // const filterData = (filter: any, data: any) => {
    //     const customerId = filter?.customerId?.value ?? '';
    //     const buildingId = filter?.buildingId?.value ?? '';
    //     const floorId = filter?.floorId?.value ?? '';
    //     // console.log('filter', filter);
    //     let filteredData = data;
    //     if (customerId) filteredData = filteredData.filter((item: any) => item?.customerId._id === customerId);

    //     if (buildingId) filteredData = filteredData.filter((item: any) => item?.buildingId._id === buildingId);
    //     if (floorId) filteredData = filteredData.filter((item: any) => item?.floorId?._id === floorId);
    //     return filteredData;
    // };
    // // const handleDownloadModal = async () => {
    //     try {
    //         if (isLoading) return;
    //         // console.log('download clicked');
    //         setDownloadModal((currentState) => !currentState);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

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
            accessor: 'customer',
            defaultCanSort: true,
        },

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
            Header: 'Device',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Updated on',
            accessor: 'data.iaq.timestamp',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                // if (!value) return '-';
                const time = convertUnixToIST(Date.now());
                // console.log('TIme vlaues', value);
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
    // console.log('isAdmin', isAdmin);

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
        // getIAQData();
        // const filterData = getDataFromSession(sessionKeys.IAQFilterKey);
        // if (filterData?.buildingId || filterData?.floorId) {
        //     const { buildingId = {}, floorId = {} } = filterData ?? {};
        //     setFilter({ buildingId, floorId });
        // }
    }, []);
    // useEffect(() => {
    //     if (filter.buildingId || filter.floorId || filter.customerId) {
    //         const filteredData = filterData(filter, iaqList);
    //         setTableData(filteredData ?? []);
    //         storeDataToSession(sessionKeys.IAQFilterKey, JSON.stringify(filter));
    //     }
    // }, [filter]);
    return (
        <>
            <Card>
                <Card.Body>
                    <Row style={{ marginBottom: '1em' }}>
                        <Col xxl={8}>
                            <h4 className="header-title mb-3">Devices List</h4>
                        </Col>
                    </Row>
                    {!deviceExists && (
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">No devices installed here</h4>
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
        </>
    );
};

export default IAQDeviseTable;
