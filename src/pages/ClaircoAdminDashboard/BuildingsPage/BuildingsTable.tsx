import { Row, Col, Card } from 'react-bootstrap';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
import { DeviseTables } from '../FloorsPage/types';
import { Column } from 'react-table';
import { formatDateToLocalTime } from '../../../helpers/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { useRedux } from 'hooks';
// import { getAllBuildings, getDeviceTypes } from 'redux/actions';
// import { useSSR } from 'react-i18next';
// import { getDevices, getDeviceTypeList } from 'helpers/api/services/Clairco/adminSide/devices';
// import Select, { ActionMeta, SingleValue } from 'react-select';
// import { customer } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';
import { selectTagType } from 'types/selectTagType';
// import { setLabels } from 'react-chartjs-2/dist/utils';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { building } from 'helpers/api/services/Clairco/customer';

type NewType = CellFormatter<DeviseTables>;

type BuildingTablesProps = {
    customerId?: string;
    deviceTypeId?: string;
    customerName?: string;
};

export const BuildingsTable: React.FC<BuildingTablesProps> = ({ customerId, customerName }) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const navigate = useNavigate();
    // const { dispatch, appSelector } = useRedux();

    const handleNavigation = (data: any) => {
        // console.log(data);

        const { name = '', type = '', customerId = '', id = '' } = data;
        navigate(`${name}`, { state: { customerName, customerId, buildingId: id, name } });
    };

    const ActionColumn = ({ row }: any) => {
        return (
            <div className="action-icon">
                <div>
                    <i
                        className="mdi mdi-eye me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNavigation(row?.original)}></i>
                </div>
            </div>
        );
    };

    const columns: ReadonlyArray<Column> = [
        { Header: 'Name', accessor: 'name', defaultCanSort: false },
        // { Header: 'Type', accessor: 'type', defaultCanSort: false },
        // { Header: 'Location', accessor: 'buildingId.location', defaultCanSort: false },
        // { Header: 'Building', accessor: 'buildingId.name', defaultCanSort: false },
        { Header: 'Cost of Energy', accessor: 'costOfEnergy', defaultCanSort: false },
        {
            Header: 'Created on',
            accessor: 'createdAt',
            defaultCanSort: false,
            Cell: ({ value }) => formatDateToLocalTime(value),
        },
        // {
        //     Header: 'Last Updated',
        //     accessor: 'updatedAt',
        //     defaultCanSort: false,
        //     Cell: ({ value }) => formatDateToLocalTime(value),
        // },
        // { Header: 'Status', accessor: 'status', defaultCanSort: false },
        {
            Header: 'View Floors',
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

    const fetchBuildingsList = async (customerId: string) => {
        try {
            setIsLoading(true);
            const res = await building.byCustomerId({ customerId });
            setTableData(res?.data ?? []);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        if (customerId) fetchBuildingsList(customerId);
    }, [customerId]);

    return (
        <Card className="shadow-lg mt-2 rounded-lg p-2 mx-2">
            <Card.Body>
                <Row>
                    <Col xs={8}>
                        <h4 className="header-title mb-3"> Buildings List</h4>
                    </Col>
                    <Col xs={4}>{/* <h4 className="header-title mb-3">Device List</h4> */}</Col>
                </Row>
                {!isLoading ? (
                    isEmpty ? (
                        <h4>No buildings assigned to this customer</h4>
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
