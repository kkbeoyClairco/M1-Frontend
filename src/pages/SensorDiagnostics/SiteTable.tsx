import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { Column } from 'react-table';
import { Table, CellFormatter, PageSize } from 'components';
import { SiteComparision } from './types';
import { data as Sites } from './data';
import FilterModal from './FilterModal';
import { useState } from 'react';

/* status column render */
const StatusColumn = ({ row }: CellFormatter<SiteComparision>) => {
    return (
        <span
            className={classNames('badge', {
                'badge-success-lighten': row.original.health_status === 'ON',
                'badge-danger-lighten': row.original.health_status === 'OFF',
            })}>
            {row.original.health_status}
        </span>
    );
};

const columns: ReadonlyArray<Column> = [
    {
        Header: 'Sensor Address',
        accessor: 'sensor_address',
        defaultCanSort: true,
    },
    {
        Header: 'Seat/ Meeting Room No.',
        accessor: 'seat_no',
        defaultCanSort: false,
    },
    {
        Header: 'Building',
        accessor: 'building',
        defaultCanSort: false,
    },
    {
        Header: 'Floor',
        accessor: 'floor',
        defaultCanSort: false,
    },
    {
        Header: 'Health Status',
        accessor: 'health_status',
        defaultCanSort: false,
        Cell: StatusColumn,
    },
    {
        Header: 'Last Refreshed on',
        accessor: 'last_refreshed_on',
        defaultCanSort: false,
    },
    {
        Header: 'Last Diagnoised on',
        accessor: 'last_diagnosed_on',
        defaultCanSort: false,
    },
    {
        Header: 'Battery Level',
        accessor: 'battery_level',
        defaultCanSort: false,
    },
];

const sizePerPageList: PageSize[] = [
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

const SiteTable = () => {
    const [sitetabledata,setSiteTableData]=useState<number[]>([]);
    const getSiteTableData=async()=>{
        try{
            const response = await getSiteTableData();
            const data = response
            // setSiteTableData(data);
          }
          catch (e: any) {
            console.log(e.message);
        }

    }
    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <h4 className="header-title mb-3">Site Comparison</h4>
                                </Col>
                                <Col>
                                    <FilterModal/>
                                </Col>
                            </Row>
                            <Table<SiteComparision>
                                columns={columns}
                                data={Sites}
                                pageSize={10}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                tableClass="table-striped text-center"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SiteTable;


