import { CellFormatter, PageSize ,Table} from "components";

import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { customer } from "../BuildingsTable/data";
import { Customer } from "../BuildingsTable/types";
import NewFloorModal from "./NewFloorModal";
import IconModal from "./IconModal";
import Group from 'assets/images/sensiable/Group.svg'
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

  
    const [showAddModal, setShowAddModal] = useState(false);

    const handleCloseModal = () => {
        setShowAddModal(false);
    };
    const handleSubmit = () => {
      
    }; 
    const navigate = useNavigate();
    const handleTableItemClick = (item: any) => {
        navigate({ pathname: '/pages/mappingsettings' });
    };




    return (

        <>
        
          
        <Link to="#" className="action-icon">
    <div>
        <img
            src={Group}
            alt="Upload"
            style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
            }}
            onClick={() => {
                setShowAddModal(true);
            }}
        />
    </div>
</Link>

<div className="action-icon">
  <div style={{ ...iconWithCircleStyle, marginLeft: '20px' }}>
  <button style={{border:'none',background:'none',color:'white'}} className="dripicons-arrow-thin-right " onClick={handleTableItemClick}></button>
  </div>
</div>


            <IconModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit}/>

        </>
    );
};


const columns: ReadonlyArray<Column> = [
    {
        Header: 'Floor Name',
        accessor: 'location',
        defaultCanSort: true,
    },
    {
        Header: 'Number of seats',
        accessor: 'seats',
        defaultCanSort: false,
    },
    {
        Header: 'Number of meeting rooms',
        accessor: 'meetingroom',
        defaultCanSort: false,
    },
    {
        Header: 'Number of Business Unit',
        accessor: 'openarea',
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
    const [floorsTableData, setFloorsTableData] = useState<any>([]);   
    
  
    const getFloorsTableData= async () => {
        try {
    const response = await getFloorsTableData();
    setFloorsTableData(response);       
        } catch (e: any) {
            console.log(e.message);
        }
    };
    
    const [showAddModal, setShowAddModal] = useState(false);

    const handleCloseModal = () => {
        setShowAddModal(false);
    };
    const handleSubmit = () => {

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
                                <h5 style={{ fontWeight: 'bold' }}>FLOORS TABLE</h5>

                                    <Button variant="primary" className="ms-3" onClick={() => setShowAddModal(true)}>
                                        Add New Floor
                                    </Button>
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
                                tableClass="table-striped text-center"
                                searchBoxClass="mb-2"
                            />
                        </Card.Body>
                    </Card>
                    <NewFloorModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit}/>

                </Col>
                </Row>
        </div>

    );
};


export default FloorsTable;
