import { Column } from 'react-table';
import { Table, PageSize } from 'components';
import { AlertTableType } from './types';
import { AlertData } from './data';

const columns: ReadonlyArray<Column> = [
    {
        Header: 'Time Stamp',
        accessor: 'time_stamp',
        defaultCanSort: true,
    },
    {
        Header: 'Sensor  ID',
        accessor: 'sensor_id',
        defaultCanSort: false,
    },
    {
        Header: 'Parameter',
        accessor: 'parameter',
        defaultCanSort: false,
    },
    {
        Header: 'Parameter Value',
        accessor: 'parameter_value',
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
    }
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

const AlertsTable = () => {
    return (
        <>
            <Table<AlertTableType>
                columns={columns}
                data={AlertData}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                tableClass="table-striped text-center"
            />
        </>
    );
};

export default AlertsTable;
