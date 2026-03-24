import { useCallback, useContext, useMemo, useRef } from 'react';
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
import { TableTest } from 'components/table Test';
import { useCalendar } from 'pages/apps/Calendar/hooks';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';
import { error } from 'console';
import { toast } from 'sonner';
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
    const [pageIndex, setPageIndex] = useState(0);
    const [selectedPageSize, setSelectedPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(20);

    const controllerRef = useRef<AbortController>();
    const navigate = useNavigate();
    const [customerTabledata, setCustomerTableData] = useState([]);
    // const getCustomers = async () => {
    //     try {
    //         setIsLoading(true);
    //         if (controllerRef.current) {
    //             controllerRef.current.abort();
    //         }
    //         controllerRef.current = new AbortController();
    //         const res = await customer.all(controllerRef.current.signal);
    //         if (res.data) {
    //             const customers = res.data.map((customer: customerData) => ({
    //                 customerId: customer.id,
    //                 customerName: customer.name,
    //                 timeCreated: customer?.createdAt ? convertUnixToIST(customer?.createdAt) : 'N/A',
    //                 action: customer.action,
    //             }));
    //             dispatch(setCustomers(res?.data));
    //             setCustomerTableData(customers);
    //         }
    //         setIsLoading(false);
    //     } catch (error) {
    //         setIsLoading(false);
    //         console.log('Error', error);
    //     }
    // };

    const getCustomersPaginated = useCallback(
        async (newIndex: number) => {
            try {
                setIsLoading(true);
                if (controllerRef.current) {
                    controllerRef.current.abort();
                }
                controllerRef.current = new AbortController();
                const res = await customer.allTest(newIndex, selectedPageSize, controllerRef.current.signal);
                if (res.data?.records) {
                    const customers = res?.data?.records?.map((customer: customerData) => ({
                        customerId: customer.id,
                        customerName: customer.name,
                        timeCreated: customer?.createdAt ? convertUnixToIST(customer?.createdAt) : 'N/A',
                        action: customer.action,
                    }));
                    //Wrong calculation. Take the total document count from api. Once the api is ready
                    setTotalPages(
                        20
                        // calculateTotalPage(customers?.length, selectedPageSize)
                    );
                    setCustomerTableData(customers);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                toast.error('Oops! Something went wrong. Please try again in a moment.');
                console.log('Error', error);
            }
        },
        [selectedPageSize]
    );

    const calculateTotalPage = useMemo(() => {
        return (totalDocument: number, pageSize: number) => {
            try {
                if (!totalDocument || !pageSize) return 0;
                return Math.ceil(totalDocument / pageSize);
            } catch (error) {
                return 0;
            }
        };
    }, []);
    const handleNavigation = (data: any) => {
        const { customerId = '', customerName = '' } = data;
        console.log('customerId', customerId, customerName);
        navigate(`/admin/pages/customer/${customerName}`, {
            state: {
                id: customerId,
                name: customerName,
            },
        });
    };
    const handleNavigation1 = (data: any) => {
        const { customerId = '', customerName = '' } = data;
        console.log('customerId', customerId, customerName);
        const searchParam = new URLSearchParams();

        searchParam.append('customerId', customerId);
        searchParam.append('customerName', customerName);

        let url = `/admin/pages/whiteboard/${searchParam.toString()}`;
        navigate(url);
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
    const ActionColumn1 = ({ row }: any) => {
        return (
            <div className="action-icon">
                <div>
                    <i
                        className="mdi mdi-eye me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNavigation1(row.original)}></i>
                </div>
            </div>
        );
    };
    const columns = [
        {
            Header: 'Customer Name',
            accessor: 'customerName',
            defaultCanSort: true,
        },
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
        {
            Header: 'Floor Plan',
            accessor: 'floorplan',
            defaultCanSort: false,
            Cell: ActionColumn1,
        },
    ];
    const handlePageChange = (newPage: number) => {
        try {
            getCustomersPaginated(newPage);
            setPageIndex(newPage);
        } catch (error) {
            console.log(error);
        }
    };
    const handlePageSizeChange = (size: number) => {
        try {
            console.log(size);
        } catch (error) {
            console.log(error);
        }
    };
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
        getCustomersPaginated(1);
        return () => {
            controllerRef.current?.abort();
        };
    }, []);

    return (
        <Card className="shadow-lg mt-0 rounded-lg p-2 mx-2 ">
            <Card.Body>
                <Row>
                    {/* <Col> */}
                    <h4 style={{ color: '#333333' }} className="header-title mb-3">
                        CUSTOMERS LIST (Backend Paginated Component- WIP)
                    </h4>
                    {/* </Col> */}
                </Row>
                {!isLoading ? (
                    <TableTest
                        columns={columns}
                        data={customerTabledata}
                        pageSize={selectedPageSize}
                        sizePerPageList={sizePerPageList}
                        isSortable={true}
                        pagination={true}
                        isSearchable={false}
                        tableClass=" mt-3 "
                        searchBoxClass="mb-2"
                        onPageChange={handlePageChange}
                        currentPage={pageIndex}
                        totalPages={totalPages}
                        onPageSizeChange={handlePageSizeChange}
                    />
                ) : (
                    <>
                        <TableSkelton2 />
                        {/* < /> */}
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default CustomerTable;
