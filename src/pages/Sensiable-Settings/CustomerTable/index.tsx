import { CellFormatter, PageSize ,Table} from "components";

import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { customer } from "../BuildingsTable/data";
import { Customer } from "../BuildingsTable/types";
import HorizontalStepper from "./HorizontalStepper";



type NewType = CellFormatter<Customer>;
const ActionColumn = ({ row }: NewType) => {
    const iconWithCircleStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        width: '30px',
        height: '30px',
        backgroundColor: '#6C757D',
        borderRadius: '50%',
        color: 'white',
    };

  
  
    const navigate = useNavigate();
    const handleTableItemClick = (item: any) => {
        navigate({ pathname: '/pages/buildingtable' });
    };
    return (

        <>  
<div className="action-icon">
  <div style={{ ...iconWithCircleStyle, marginLeft: '20px' }}>
  <button style={{border:'none',background:'none',color:'white'}} className="dripicons-arrow-thin-right "  onClick={handleTableItemClick}></button>
  </div>
</div>
        </>
    );
};


const columns: ReadonlyArray<Column> = [
    {
        Header: 'Customer',
        accessor: 'location',
        defaultCanSort: false,
    },
    {
        Header: 'Location',
        accessor: 'seats',
        defaultCanSort: false,
    },
  
    {
        Header: 'Action',
        accessor: 'action',
        defaultCanSort: false,
        Cell: ActionColumn,
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

const FloorsTable = () => {
    const [customerTableData, setCustomerTableData] = useState<any>([]);   
    
  
    const getCustomerTableData= async () => {
        try {
        const response =await getCustomerTableData();
        setCustomerTableData(response);

        } catch (e: any) {
            console.log(e.message);
        }
    };
    
    return (
        
        <div>

              <Row className='mb-5 '>
                <HorizontalStepper />
            </Row>
 <Row>
                
            </Row>
            <Row>
                <Col xs={12}>

                    <Card>
                        <Card.Body>
                        <Row>
                                <Col xs={12} className="d-flex justify-content-between mb-3">
                                <h5 style={{ fontWeight: 'bold' }}>CUSTOMERS TABLE</h5>

                                   
                                </Col>
                            </Row>

                  
                            <Table
                                columns={columns}
                                data={customer}
                                pageSize={10}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass="table-striped  "
                                searchBoxClass="mb-2"
                            />
                        </Card.Body>
                    </Card>

                </Col>
                </Row>
        </div>

    );
};


export default FloorsTable;
