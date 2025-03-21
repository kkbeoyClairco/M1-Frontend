import { Row, Col, Card, Button} from 'react-bootstrap';
import { Column } from 'react-table';
import { Table,  PageSize } from 'components';
import { customer } from './data';
import { useState } from 'react';
import SeatTypeModal from './SeatTypeModal';


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
        Cell: row => <div className="center-cell">{row.value}</div>,
      }
,      
      
    {
        Header: 'Cost/sqft₹',
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

const SeatType = () => {    
    const [seatTypeTableData, setSeatTypeTableDataTableData] = useState<any>([]);   
    
  
    const getSeatTypeTableData = async () => {
        try {
        const response=await getSeatTypeTableData();
        setSeatTypeTableDataTableData(response);

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
    <Col>
        <Card.Title className=''>SEAT TYPE TABLE</Card.Title>
    </Col>
    <Col>
        <Button variant="primary" className="float-end ms-3" 
    onClick={() => {
        setShowAddModal(true)}} >
            Add New Seat Type
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
                                searchBoxClass="mb-2"
                            />
                        </Card.Body>
                    </Card>
                    < SeatTypeModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit}/>


                </Col>
            
        </>
    );
};

export default SeatType;
