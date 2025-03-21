import { Col, Card, Button, Row} from 'react-bootstrap';
import { Column } from 'react-table';
import { Table, PageSize } from 'components';
import { Customer } from './types';
import { customer } from './data';
import Building from 'assets/images/sensiable/Building.svg' 
import React, { useState } from 'react';

interface SensorMappingProps {
    checked: boolean;
    onChange: () => void;
  }
  
  const SensorMapping: React.FC<SensorMappingProps> = ({ checked, onChange }) => {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    );
  };
 
const columns: ReadonlyArray<Column> = [
    {
        Header: 'Seat/Meeting Room Number',
        accessor: 'location',
        defaultCanSort: true,
    },
    {
        Header: 'Sensor Address',
        accessor: 'seats',
        defaultCanSort: false,
    },
  {
    Header: 'Seat Selection',
    accessor: 'isSelected', 
    Cell: ({ row }) => (
      <SensorMapping
        checked={row.isSelected}
        onChange={() => {

        }}
      />
    ),
    defaultCanSort: false,
  },
    {
        Header: 'Room Selection',
        accessor: '', 
        Cell: ({ row }) => (
          <SensorMapping
            checked={row.isSelected}
            onChange={() => {
    
            }}
          />
        ),
        defaultCanSort: false,
    },
    {
        Header: 'Occupancy Selection',
        accessor: '', 
        Cell: ({ row }) => (
          <SensorMapping
            checked={row.isSelected}
            onChange={() => {
    
            }}
          />
        ),
        defaultCanSort: false,
    },
    
   
    
 
    {
        Header: 'Temperature Selection',
        accessor: '', 
        Cell: ({ row }) => (
          <SensorMapping
            checked={row.isSelected}
            onChange={() => {
    
            }}
          />
        ),
        defaultCanSort: false,
    },
    {
        Header: 'Humidity Selection',
        accessor: '', 
        Cell: ({ row }) => (
          <SensorMapping
            checked={row.isSelected}
            onChange={() => {
    
            }}
          />
        ),
        defaultCanSort: false,
    },
    {
        Header: 'CO2 Selection',
        accessor: '', 
        Cell: ({ row }) => (
          <SensorMapping
            checked={row.isSelected}
            onChange={() => {
    
            }}
          />
        ),
        defaultCanSort: false,
    },
    {
        Header: 'VOC Selection',
        accessor: '', 
        Cell: ({ row }) => (
          <SensorMapping
            checked={row.isSelected}
            onChange={() => {
    
            }}
          />
        ),
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

const SensorsTable = () => {
//   const[sensorTable , setSensorTable] = useState('');
//   const getSensorTable=async(){
//     try{
// const response=await getSensorTable();
// setSensorTable(response);
//     }
//     catch(error){
//       console.log('Error',Error)

//     }
//   }
    return (
        <>

<Col xs={12}>

                    <Card>
                        <Card.Body>
                                          <Row>
                                <Col xs={12} className="d-flex justify-content-between mb-3"> 
                                <h5 style={{ fontWeight: 'bold' }}>SENSOR MAPPING AND SETTING</h5>

                                    <Button variant="primary" className="ms-3" >
                                    Upload Mapping (.CSV)                                    </Button>
                                </Col>
                            </Row>
                  
                            <Table<Customer>
                                columns={columns}
                                data={customer}
                                pageSize={10}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass="table-striped text-center"
                                searchBoxClass="mt-2 mb-3"
                            />
                        </Card.Body>
                    </Card>
                    <div className=''>
        <img src={Building} alt=''/>

        </div>

                </Col>

            
        </>
    );
};

export default SensorsTable;
