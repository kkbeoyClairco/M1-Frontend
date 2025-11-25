import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { convertUnixToIST } from 'utils/timeFunctions';
// import { getFeedbackForTables } from 'helpers/api/services/Clairco/customerSide/feedback';
import { setDatasets } from 'react-chartjs-2/dist/utils';
import { feedackForTable, zoneWiseData } from 'appConstants/feedbackData';

interface FeedbackTablePropType {
    zoneId: string;
}
const FeedbackTable = ({ zoneId }: any) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const columns = [
        // {
        //     Header: 'Customer',
        //     accessor: 'customer',
        //     defaultCanSort: true,
        // },

        // {
        //     Header: 'Washroom',
        //     accessor: 'buildingId.name',
        //     defaultCanSort: true,
        // },
        // {
        //     Header: 'Floor',
        //     accessor: 'floorId.name',
        //     defaultCanSort: true,
        // },
        {
            Header: 'Feedback Type',
            accessor: 'requirement',
            defaultCanSort: true,
        },

        {
            Header: 'Feedback',
            accessor: 'description',
            defaultCanSort: false,

            Cell: ({ value }: any) => {
                // console.log('Table ', value);
                return (
                    <p style={{ maxWidth: '150px', wordWrap: 'break-word', overflow: 'hidden', whiteSpace: 'normal' }}>
                        {value}
                    </p>
                );
            },
        },
        {
            Header: 'Name',
            accessor: 'name',
            defaultCanSort: false,
        },
        {
            Header: 'Phone',
            accessor: 'phoneNo',
            defaultCanSort: false,
        },
        {
            Header: 'Email',
            accessor: 'email',
            defaultCanSort: false,
        },
        // {
        //     Header: 'Status',
        //     accessor: 'health_status',
        //     defaultCanSort: false,
        // },

        {
            Header: 'Reported at',
            accessor: 'updatedAt',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
                return time;
            },
        },
        {
            Header: 'Rating',
            accessor: 'feedBack',
            defaultCanSort: true,
        },
        // {
        //     Header: 'View',
        //     accessor: 'action',
        //     defaultCanSort: false,
        //     Cell: ActionColumn,
        // },
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

    const fetchDataForTable = useCallback(async () => {
        try {
            // if (!zoneId) return;
            setIsLoading(true);
            const res: any = { data: feedackForTable };
            //  await getFeedbackForTables(zoneId);
            setTableData(res?.data?.data ?? []);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [zoneId]);

    useEffect(function getDataForTable() {
        fetchDataForTable();
    }, []);
    return (
        <Card>
            <Card.Body>
                <Card.Header className="mb-2">
                    <Col xs={12}>
                        <h5>Feedback Ratings: Poor & Very Poor Cases</h5>
                    </Col>{' '}
                </Card.Header>
                {!isLoading ? (
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
                ) : (
                    <TableSkelton />
                )}
            </Card.Body>
        </Card>
    );
};

export default FeedbackTable;
