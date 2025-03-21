    import { Row, Col, Card, Button} from 'react-bootstrap';
    import { Column } from 'react-table';
    import { Table,  PageSize } from 'components';
    import { customer } from './data';
import { useState } from 'react';
import BusinessUnitModal from './BusinessUnitModal';
import React from 'react';


    const columns: ReadonlyArray<Column> = [
        {
            Header: 'BuildingName',
            accessor: 'location',
            defaultCanSort: true,
        },
        {
            Header: 'No.of Seats Assigned',
            accessor: 'seats',
            defaultCanSort: false,
            Cell: row => <div className="center-cell">{row.value}</div>,
          }
    ,      
          
        {
            Header: 'No of Rooms',
            accessor: 'meetingroom',
            defaultCanSort: false,
            Cell: row => <div className="center-cell">{row.value}</div>,
    
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

    const BusinessUnit = () => {
           const [buildingUnitTableData, setBuildingUnitDataTableData] = useState<any>([]);   
    
  
    // const getBuildingUnitTableData = async () => {
    //     try {
    //     const response=await getBuildingUnitTableData();
    //     setBuildingUnitDataTableData(response);
    //     } catch (e: any) {
    //         console.log(e.message);
    //     }
    // };
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
        <Col>
            <Card.Title className=''>BUSINESS UNIT TABLE</Card.Title>
        </Col>
        <Col>
            <Button variant="primary" className="float-end ms-3" onClick={() => {
                        setShowAddModal(true)}}>
                Add New BU
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
                                    tableClass="table-striped text-center"
                                    searchBoxClass="mt-2 mb-3"
                                />
                            </Card.Body>
                        </Card>
                        
                        < BusinessUnitModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit}/>

                    </Col>
                
            </>
        );
    };

    export default BusinessUnit;
