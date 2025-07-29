import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import React, { SetStateAction, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { convertUnixToIST } from 'utils/timeFunctions';

interface QuadrantTableInterface {
    navControlFn: React.Dispatch<React.SetStateAction<any>>;
}
const QuadrantsTable: React.FC<QuadrantTableInterface> = ({ navControlFn }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);

    const columns = [
        {
            Header: 'Quadrants',
            accessor: 'Quadrants',
            defaultCanSort: true,
        },
        {
            Header: 'Point 1',
            accessor: 'floorId.name',
            defaultCanSort: true,
        },

        {
            Header: 'Point 2',
            accessor: 'locationId.name',
            defaultCanSort: false,
        },

        {
            Header: 'Point 3',
            accessor: 'name',
            defaultCanSort: true,
        },

        {
            Header: 'Point 4',
            accessor: 'data.iaq.timestamp',
            defaultCanSort: false,
        },
        {
            Header: 'Delete',
            accessor: 'action',
            // defaultCanSort: false,
            // Cell: ActionColumn,
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

    return (
        <Card className="h-100 shadow-lg rounded-lg">
            <Card.Body>
                <Row className="mt-2">
                    <Col xxl={8}>
                        <h4 className="header-title mb-3">Quadrants list</h4>
                    </Col>
                    <Col xxl={4} className="d-flex justify-content-center align-items-center">
                        <Button style={{ background: '#008675' }} onClick={navControlFn}>
                            Add New Quadrant
                        </Button>
                    </Col>
                </Row>

                {!isLoading ? (
                    <Table
                        columns={columns}
                        data={tableData || []}
                        pageSize={0}
                        // sizePerPageList={sizePerPageList}
                        isSortable={true}
                        // pagination={true}
                        // isSearchable={true}
                        tableClass=" mt-3 "
                        searchBoxClass="mb-2"
                    />
                ) : (
                    <TableSkelton />
                )}
            </Card.Body>
        </Card>
    );
};

export default QuadrantsTable;
