import { useContext, useRef } from 'react';
import { ToastContext } from 'context/ToastContext';
import { Row, Col, Card } from 'react-bootstrap';
import { Table } from 'components'; // Assuming 'Table' is a valid component
import { useState, useEffect } from 'react';
import { customer } from 'helpers/api/services/Clairco/customer';
import { useNavigate } from 'react-router-dom';
import { setCustomers, getAllBuildings, getDevices, getDeviceTypes } from 'redux/actions';
import { useRedux } from 'hooks';
import { convertUnixToIST } from 'utils/timeFunctions';
import SkeltonLoader from 'components/ClaircoCustomer/Skeltons/SkeltonLoader';
// export type CustomerTables = {
//     customerName: string;
//     numberOfDevices: number;
//     numberOfUsers: number;
//     timeCreated: string;
//     numberOfAlerts: number;
//     status: string;
//     action: string;
// };
// type NewType = CellFormatter<CustomerTables>;

type customerData = {
    id: any;
    name: any;
    createdAt: string | number | Date;
    action: any;
};
const CustomerTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useContext(ToastContext);
    const { dispatch, appSelector } = useRedux();
    const controllerRef = useRef<AbortController>();
    const navigate = useNavigate();
    const [customerTabledata, setCustomerTableData] = useState([]);
    const getCustomers = async () => {
        try {
            setIsLoading(true);
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
            controllerRef.current = new AbortController();
            const res = await customer.all(controllerRef.current.signal);
            if (res.data) {
                const customers = res.data.map((customer: customerData) => ({
                    customerId: customer.id,
                    customerName: customer.name,
                    timeCreated: customer?.createdAt ? convertUnixToIST(customer?.createdAt) : 'N/A',
                    action: customer.action,
                }));
                dispatch(setCustomers(res?.data));
                setCustomerTableData(customers);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log('Error', error);
        }
    };

    const handleNavigation = (data: any) => {
        const { customerId = '', customerName = '' } = data;
        console.log('customerId', customerId, customerName);
        navigate(`/admin/pages/${customerName}`, {
            state: {
                id: customerId,
                name: customerName,
            },
        });
    };

    const ActionColumn = ({ row }: any) => {
        return (
            <div className="action-icon">
                <div>
                    <i
                        className="mdi mdi-eye me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNavigation(row.original)}></i>
                </div>
            </div>
        );
    };
    const columns = [
        { Header: 'Customer Name', accessor: 'customerName', defaultCanSort: true },
        // { Header: 'Logo', accessor: 'logo', defaultCanSort: false },
        // { Header: 'Number of Devices', accessor: 'numberOfDevices', defaultCanSort: false },
        // { Header: 'Number of Users', accessor: 'numberOfUsers', defaultCanSort: false },
        {
            Header: ' Created on',
            accessor: 'timeCreated',
            defaultCanSort: false,
        },
        //{ Header: 'Number of Alerts', accessor: 'numberOfAlerts', defaultCanSort: false },
        //{ Header: 'Status', accessor: 'status', defaultCanSort: false },
        {
            Header: 'Action',
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
    ];
    useEffect(() => {
        try {
            getCustomers();
        } catch (error: any) {
            toast?.showToast('Error occure while fetching data ', 'error');
        }
        return () => {
            controllerRef.current?.abort();
        };
    }, []);
    return (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    {/* <Col> */}
                    <h4 className="header-title mb-3">CUSTOMERS LIST</h4>
                    {/* </Col> */}
                </Row>
                {!isLoading ? (
                    <Table
                        columns={columns}
                        data={customerTabledata}
                        pageSize={10}
                        sizePerPageList={sizePerPageList}
                        isSortable={true}
                        pagination={true}
                        isSearchable={true}
                        tableClass=" mt-3 "
                        searchBoxClass="mb-2"
                    />
                ) : (
                    <>
                        {' '}
                        <SkeltonLoader />
                        <SkeltonLoader />
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default CustomerTable;
