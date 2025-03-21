import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { DeviseTables } from './types';
import { useNavigate } from 'react-router-dom';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getUserDetailsFromSession } from 'utils/storageFunctions';
import { useRedux } from 'hooks';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';
type NewType = CellFormatter<DeviseTables>;

const DeviseTable = ({ customerId }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const navigate = useNavigate();
    // const data = getUserDetailsFromSession();
    //Function to navigate to devise specific page
    const { dispatch, appSelector } = useRedux();

    const {
        activeFloor: { floorId },
    } = appSelector((state: any) => state.HomePageReducer);
    const getOutdoorUnitsData = async () => {
        try {
            setIsLoading(true);

            const deviceId = deviceTypeId['VRV/VRF Outdoor'];
            // const { customerId } = data;
            const response = await fetchDevicesList(deviceId, customerId, floorId);
            // console.log('Outdoor unit', response);
            if (response?.data.length === 0) setIsEmpty(true);

            setIsLoading(false);
            setTableData(response?.data || []);
            // console.log('Outdoor unit');
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    const handleNavigation = (id: string) => {
        console.log('id to navigate', id);
        navigate(`/customer/vrv-vrf/${id}`);
    };

    const ActionColumn = ({ row }: NewType) => {
        return (
            <div className="action-icon">
                <div style={{}}>
                    <i className="mdi mdi-eye me-3" onClick={() => handleNavigation(row.id)}></i>
                    {/* <i className="mdi mdi- dripicons-gear"></i> */}
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Name',
            accessor: 'name',
            defaultCanSort: true,
        },
        // {
        //     Header: 'Customer',
        //     accessor: 'customer',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Location.',
        //     accessor: 'seat_no',
        //     defaultCanSort: false,
        // },
        // {
        //     Header: 'Building',
        //     accessor: 'building',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Floor',
        //     accessor: 'floor',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Status',
        //     accessor: 'health_status',
        //     defaultCanSort: false,
        // },

        {
            Header: 'Commissioned Date',
            accessor: 'updatedAt',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
                return time;
            },
        },
        // {
        //     Header: 'Commissioned Date',
        //     accessor: 'updatedAt',
        //     defaultCanSort: false,
        //     Cell: ({ value }: any) => {
        //         const time = convertUnixToIST(value);
        //         return time;
        //     },
        // },
        // {
        //     Header: 'Last Updated',
        //     accessor: 'last_refreshed_on',
        //     defaultCanSort: false,
        // },
        // {
        //     Header: 'Status',
        //     accessor: 'health_status',
        //     defaultCanSort: false,
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
        getOutdoorUnitsData();
    }, [floorId]);
    return (
        <Row style={{ paddingRight: '0' }}>
            <Col xs={12} style={{ paddingRight: '0' }}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">Outdoor Units</h4>
                            </Col>
                        </Row>
                        {isEmpty && (
                            <Row>
                                <Col>
                                    <h4 className="header-title mb-3">No Outdoor devices installed here</h4>
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

export default DeviseTable;
