import { Row, Col, Card } from 'react-bootstrap';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
import { DeviseTables } from '../BuildingsPage/types';
import { Column } from 'react-table';
import { formatDateToLocalTime } from '../../../helpers/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { building, floor } from 'helpers/api/services/Clairco/customer';
import { setLocale } from 'yup';
import { convertUnixToIST } from 'utils/timeFunctions';

type NewType = CellFormatter<DeviseTables>;

type FloorsTablesProps = {
    customerId?: string;
    buildingId?: string;
    customerName: string;
};

export const FloorsTable: React.FC<FloorsTablesProps> = ({ customerId, buildingId, customerName }) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const navigate = useNavigate();
    // const { dispatch, appSelector } = useRedux();

    const handleNavigation = (data: any) => {
        console.log(data);
        const { name = '', type = '' } = data;
        navigate(`${name}`, {
            state: {
                customerName: customerName,
                floorName: data?.name,
                buildingName: '',
                floorId: data?.id ?? '',
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

    const columns: ReadonlyArray<Column> = [
        { Header: 'Name', accessor: 'name', defaultCanSort: false },
        // { Header: 'Type', accessor: 'type', defaultCanSort: false },
        // { Header: 'Location', accessor: 'buildingId.location', defaultCanSort: false },
        // { Header: 'Building', accessor: 'buildingId.name', defaultCanSort: false },
        {
            Header: 'Layout',
            accessor: 'layout',
            defaultCanSort: false,
            Cell: ({ value }) => {
                return <img src={value} alt="" height={40} />;
            },
        },
        {
            Header: 'Created on',
            accessor: 'createdAt',
            defaultCanSort: false,
            Cell: ({ value }) => convertUnixToIST(value),
        },
        // {
        //     Header: 'Last Updated',
        //     accessor: 'updatedAt',
        //     defaultCanSort: false,
        //     Cell: ({ value }) => formatDateToLocalTime(value),
        // },
        // { Header: 'Status', accessor: 'status', defaultCanSort: false },
        {
            Header: 'View Devices',
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

    const fetchFloorsList = async (customerId: string, buildingId: string) => {
        try {
            setIsLoading(true);
            const res = await floor.byCustomerId(customerId, buildingId ?? '');
            // console.log('Floors List', res);
            setTableData(res?.data ?? []);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        if (buildingId) fetchFloorsList(customerId ?? '', buildingId);
    }, [buildingId]);

    return (
        // <Row style={{ marginLeft: '0px' }}>
        <Card className="shadow-lg mt-2 rounded-lg p-2 mx-2">
            <Card.Body>
                <Row>
                    <Col xs={8}>
                        <h4 className="header-title mb-3"> Floors List</h4>
                    </Col>
                    <Col xs={4}>{/* <h4 className="header-title mb-3">Device List</h4> */}</Col>
                </Row>
                {!isLoading ? (
                    isEmpty ? (
                        <h4>No Floors assigned to this building</h4>
                    ) : (
                        <Table
                            columns={columns}
                            data={tableData ?? []}
                            pageSize={10}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            isSearchable={true}
                            tableClass=" mt-3 "
                            searchBoxClass="mb-2"
                        />
                    )
                ) : (
                    <TableSkelton />
                )}
            </Card.Body>
        </Card>
        // </Row>
    );
};
