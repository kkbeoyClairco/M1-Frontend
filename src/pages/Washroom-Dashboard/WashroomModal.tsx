import React from 'react';
import { Column } from 'react-table';
import { Table, PageSize } from 'components';
import { washroomdata } from './data';
import { WashroomAlerts } from './types';


const columns: ReadonlyArray<Column> = [
  {
    Header: 'TimeStamp',
    accessor: 'timestamp',
    defaultCanSort: false,
  },
  {
    Header: 'Sensor  ID',
    accessor: 'sensorid',
    defaultCanSort: false,
  },
  {
    Header: 'Parameter',
    accessor: 'parameter',
    defaultCanSort: false,
  },
  {
    Header: 'Parameter Value',
    accessor: 'parametervalue',
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

const CostAnalysisTable = () => {
  return (
    <> 
      <Table<WashroomAlerts>
        columns={columns}
        data={washroomdata}
        pageSize={10}
        sizePerPageList={sizePerPageList}
        isSortable={true}
        pagination={true}
        isSearchable={true}
        tableClass="table-striped text-center"
      />
    </>
  );
};

export default CostAnalysisTable;
