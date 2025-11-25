import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';
// import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';
import { getDataFromSession, getUserIdFromSession, isAdmin, storeDataToSession } from 'utils/storageFunctions';
// import { URLSearchParams } from 'url';
import alertIcon from 'assets/icons/caution.png';

import Select from 'react-select';
import { sessionKeys } from 'appConstants/sessionKeys';
import { format } from 'path';
import { building } from 'helpers/api/services/Clairco/customer';
import downloadIcon from 'assets/icons/downloads.png';
import { cumulativeData, zoneWiseData } from 'appConstants/feedbackData';
// import { getListOfZones } from 'helpers/api/services/Clairco/customerSide/feedback';

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

const FeedbackZoneTable = ({ setTotalDevices }: any) => {
    // const [downloadModal, setDownloadModal] = useState(false);

    const [tableData, setTableData] = useState<any[]>([]);
    const [iaqList, setIaqList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceExists, setDeviceExists] = useState(true);
    // const [customersList, setCutomersList] = useState<any>([]);
    // const [buildingList, setBuildingList] = useState<any>([]);
    // const [floorList, setFloorList] = useState<any>([]);
    // const [filter, setFilter] = useState<any>({});
    // const [placeHolder, setPlacehoder] = useState({
    //     customer: 'Select Customer',
    //     building: 'Select Building',
    //     floor: 'Select Floor',
    // });
    // const { customerId = '', buildingId = '' } = getUserIdFromSession();

    //Selected
    // const [customerSelected, setCustomerSelected] = useState<any>([]);
    // const [floorSelected, setFloorSelected] = useState<any>([]);
    // const [buildingSelected, setBuildingSelected] = useState<any>([]);
    // const { isAdmin } = getUserIdFromSession();
    // const isAdminOrNot = isAdmin === 'Admin';
    const navigate = useNavigate();
    //Navigation
    const handleNavigation = (data: any) => {
        // console.log('Nav Data', data);
        const name = data?.name ?? '';
        const buildingName = data?.buildingId.name ?? '';
        const floorName = data?.floorId.name ?? '';
        const customer = data?.customerId.name;
        const zoneId = data?.id ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('floor', floorName);
        searchParam.append('customer', customer);
        let url = `${searchParam.toString()}`;
        navigate(url, {
            state: {
                zoneId: zoneId,
            },
        });
    };

    //API Call

    const getFeedbackZOneLIst = async () => {
        try {
            setIsLoading(true);
            // const intuitCustomerId = `67e64c8e55cf882553c9f44b`;
            const res: any = { data: zoneWiseData };
            //  await getListOfZones(intuitCustomerId);
            console.log('Zones', res);
            const zones = res?.data?.zones ?? '';
            setTotalDevices(zones.length ?? 0);
            setTableData(zones ?? []);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    // const getIAQData = async () => {
    //     try {
    //         // if (!customerId) return;
    //         setIsLoading(true);
    //         const deviceId = deviceTypeId['IAQ'];
    //         const response = await fetchDevicesList(deviceId, customerId, '', buildingId ?? '');
    //         let sampleTestData = [];
    //         // // sampleTableTestData;
    //         // for (let i = 0; i < 10000; i++) {
    //         // for (let i = 0; i < 1000; i++) {
    //         //     sampleTestData[i] = {
    //         //         ...sampleTableTestData[0],
    //         //         name: sampleTableTestData[0].name + i,
    //         //         customerId: {
    //         //             ...sampleTableTestData[0].customerId,
    //         //             name: sampleTableTestData[0].customerId.name + i,
    //         //         },
    //         //         buildingId: {
    //         //             ...sampleTableTestData[0].buildingId,
    //         //             name: sampleTableTestData[0].buildingId.name + i,
    //         //         },
    //         //         floorId: { ...sampleTableTestData[0].floorId, name: sampleTableTestData[0].floorId.name + i },
    //         //     };
    //         // }
    //         // console.log('SampleTestData', sampleTestData);
    //         // // }
    //         setIaqList(response?.data); //Sets data as a referece for the filter
    //         if (response?.data.length === 0) setIsEmpty(true);
    //         let filtered = response?.data;
    //         // console.log('Response', filtered);
    //         getBuildingAndFloorList(filtered); //Populates the building and floor list for Selection
    //         // console.log('IAQ', response);
    //         const filtersSaved = getDataFromSession(sessionKeys.IAQFilterKey);

    //         if (filtersSaved) {
    //             filtered = filterData(filtersSaved, filtered);
    //             // console.log('filtered', filtered);
    //         }
    //         setTableData(response?.data || []);
    //         setDeviceExists(response?.data?.length > 0 ? true : false);
    //         setIsLoading(false);
    //         setTotalDevices(response?.data?.length);
    //     } catch (error) {
    //         console.log(error);
    //         setTableData([]);
    //         setIsLoading(false);
    //     }
    // };
    // // Creates floorList in a format that can be used in the select component
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
    // // Filter Function
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
    // const handleDownloadModal = async () => {
    //     try {
    //         if (isLoading) return;
    //         // console.log('download clicked');
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
            Header: 'Zone',
            accessor: 'name',
            defaultCanSort: false,
        },

        // {
        //     Header: 'Version',
        //     accessor: 'type',
        //     defaultCanSort: true,
        // },

        // {
        //     Header: 'Updated on',
        //     accessor: 'data.iaq.timestamp',
        //     defaultCanSort: false,
        //     Cell: ({ value }: any) => {
        //         return convertUnixToIST(Date.now());
        //     },
        // },
        {
            Header: 'View',
            accessor: 'action',
            defaultCanSort: false,
            Cell: ActionColumn,
        },
    ];
    // console.log('isAdmin', isAdmin);
    // if (isAdminOrNot) {
    //     columns.unshift({
    //         Header: 'Customer',
    //         accessor: 'customerId.name',
    //         defaultCanSort: true,
    //     });
    // }
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
        getFeedbackZOneLIst();

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
        <Card>
            <Card.Body>
                <Row style={{ marginBottom: '1em' }}>
                    <Col xxl={8}>
                        <h4 className="header-title mb-3">Feedback-Enabled Zones</h4>
                    </Col>
                </Row>
                {!deviceExists && (
                    <Row>
                        <Col>
                            <h4 className="header-title mb-3">No Feedback devices installed here</h4>
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
    );
};

export default FeedbackZoneTable;
