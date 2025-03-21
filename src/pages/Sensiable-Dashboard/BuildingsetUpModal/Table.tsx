import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Column } from 'react-table';
import { PageTitle, Table, CellFormatter, PageSize } from 'components';
// import { Seller } from '../types';
// import { sellers } from '../data';
import { useState } from 'react';
import { Seller } from '../OccupancyTrends/types';
import { sellers } from '../OccupancyTrends/data';

const columns: ReadonlyArray<Column> = [
    {
        Header: 'Parameter',
        accessor: 'name',
        defaultCanSort: false,
    }, 
    {
        Header: 'Floor',
        accessor: 'store',
        defaultCanSort: false,
    },
    {
        Header: 'Value',
        accessor: 'products',
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

const SplitupTable = () => {
//     const[splitTableData,setSplitTableData]=useState('')
//     const getSplitTableData =async()=>{
//         try{
// const response =await getSplitTableData();
// setSplitTableData(response)

//         }
//         catch(error){
//             console.log('Error',error)

//         }
//     }
    
    return (
        <>

            <Row>
                <Col xs={12} md={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={3} xs={12}>
                                    <h4>Location1</h4>
                                </Col>
                                <Col md ={9} xs={12} >
                                <ButtonGroup className='me-3'>
          <Button variant="primary">Min</Button>
          <Button variant="primary">Avg</Button>
          <Button variant="primary" className='me-3'>Max</Button>                                        
          <Button variant="primary">Day</Button>
          <Button variant="primary">Week</Button>
          <Button variant="primary">Month</Button>
          <Button variant="primary">Quarter</Button>
          <Button variant="primary">Year</Button>
        </ButtonGroup>
                                </Col>
                    
                            </Row>

                            <Table<Seller>
                                columns={columns}
                                data={sellers}
                                pageSize={10}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                tableClass="table-striped"
                                searchBoxClass="mt-2 mb-3"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SplitupTable;
