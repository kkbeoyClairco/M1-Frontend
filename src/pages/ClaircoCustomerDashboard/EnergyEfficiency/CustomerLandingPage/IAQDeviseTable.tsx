import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';
import { data as Sites } from './data';

import { Row, Col, Card } from 'react-bootstrap';
import { DeviseTables } from './types';
import { useNavigate } from 'react-router-dom';
import { getUserDetailsFromSession } from 'utils/storageFunctions';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { useRedux } from 'hooks';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { convertUnixToIST } from 'utils/timeFunctions';

type NewType = CellFormatter<DeviseTables>;

const IAQDeviseTable = ({ customerId }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const navigate = useNavigate();
    //Function to navigate to devise specific page
    const handleNavigation = (id: string) => {
        // console.log('id to navigate', id);
        navigate(`/customer/vrv-vrf/${id}`);
    };
    // const data = getUserDetailsFromSession();
    const { dispatch, appSelector } = useRedux();

    const {
        activeFloor: { floorId },
    } = appSelector((state: any) => state.HomePageReducer);

    const getIAQData = async () => {
        try {
            setIsLoading(true);

            const deviceId = deviceTypeId['IAQ'];
            // const { customerId } = data;
            const response = await fetchDevicesList(deviceId, customerId, floorId);
            // console.log('getIAQData', response);
            if (response?.data.length === 0) setIsEmpty(true);

            setTableData(response?.data || []);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    const ActionColumn = ({ row }: NewType) => {
        return (
            <div className="action-icon">
                <div style={{}}>
                    <i className="mdi mdi-eye me-3" onClick={() => handleNavigation(row.id)}></i>
                    <i className="mdi mdi- dripicons-gear"></i>
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Device Id',
            accessor: 'sensor_address',
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
        {
            Header: 'Status',
            accessor: 'health_status',
            defaultCanSort: false,
        },

        {
            Header: 'Commissioned Date',
            accessor: 'last_diagnosed_on',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
                return time;
            },
        },
        // {
        //     Header: 'Last Updated',
        //     accessor: 'last_refreshed_on',
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
        getIAQData();
    }, [floorId]);
    return (
        <Row style={{ paddingRight: '0px' }}>
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">IAQ Device List</h4>
                            </Col>
                        </Row>
                        {isEmpty && (
                            <Row>
                                <Col>
                                    <h4 className="header-title mb-3">No IAQ devices installed here</h4>
                                </Col>
                            </Row>
                        )}
                        {!isLoading ? (
                            <Table
                                columns={columns}
                                data={[]}
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
            </Col>
        </Row>
    );
};

export default IAQDeviseTable;
