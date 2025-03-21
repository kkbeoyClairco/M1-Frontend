import {  useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button} from 'react-bootstrap';
import { Column } from 'react-table';
import { Table, CellFormatter, PageSize } from 'components';
import { Customer } from './types';
import { customer } from './data';
import { useState } from 'react';
import React from 'react';
import NewBuildingModal from './NewBuildingModal';
const ActionColumn = ({ row }: CellFormatter<Customer>) => {
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
    const handleRightIconClick = () => {
        navigate({ pathname: '/pages/floorstable' });
    };
    return (
        <>
                <div style={iconWithCircleStyle} >
                    <button dripicons-downloadclassName="dripicons-arrow-thin-right "  onClick={handleRightIconClick}></button>
                </div>
        </>
    );
};

const columns: ReadonlyArray<Column> = [
    {
        Header: 'Building',
        accessor: 'location',
        defaultCanSort: true,
    },
    {
        Header: 'Location',
        accessor: 'seats',
        defaultCanSort: false,
    },
    {
        Header: 'Cost/sqft₹',
        accessor: 'meetingroom',
        defaultCanSort: false,
    },
    {
        Header: 'Number of Floors',
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

const Building = () => {
    const [buildingTableData, setbuildingTableData] = useState<any>([]);   
    
  
    const getBuildingTableData = async () => {
        try {
        const response=await getBuildingTableData();
        setbuildingTableData(response);

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
        <>

                <Col xs={12}>

                    <Card>
                        <Card.Body>
                        <Row>
                                <Col xs={12} className="d-flex justify-content-between mb-3">
                                <h5 style={{ fontWeight: 'bold' }}>BUILDINGS TABLE</h5>

                                    <Button variant="primary" className="ms-3" onClick={() => setShowAddModal(true)}>
                                    Add New Building
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
                                tableClass="table-striped "
                                searchBoxClass="mt-2 mb-3"
                            />
                        </Card.Body>
                    </Card>
                    
                    <NewBuildingModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit}/>

                </Col>
            
        </>
    );
};

export default Building;
