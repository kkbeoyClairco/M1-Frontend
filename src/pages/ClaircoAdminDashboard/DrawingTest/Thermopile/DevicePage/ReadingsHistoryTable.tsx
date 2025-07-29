import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import React, { SetStateAction, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { convertUnixToIST } from 'utils/timeFunctions';

interface ReadingsHistoryTableInterface {
    // modalControlFn: React.Dispatch<React.SetStateAction<any>>;
}
const ReadingsHistoryTable: React.FC<ReadingsHistoryTableInterface> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState<any[]>([]);

    const columns = [
        {
            Header: 'Time ',
            accessor: 'Quadrants',
            defaultCanSort: true,
        },
        {
            Header: 'Count',
            accessor: 'floorId.name',
            defaultCanSort: true,
        },
        {
            Header: 'View',
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
                        <h4 className="header-title mb-3">Readings</h4>
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

export default ReadingsHistoryTable;
