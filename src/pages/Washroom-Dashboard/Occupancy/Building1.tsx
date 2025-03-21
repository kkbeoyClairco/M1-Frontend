import React, { useState } from 'react';
import { Card, Table, ProgressBar, Col, Row } from 'react-bootstrap';
import SimpleBar from 'simplebar';
import { Buildings, Floors } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';
import Select from 'react-select';



const Building1 = () => {
    const [washroomsData, setWashroomsData] = useState([
        { id: 1, liveoccupancy: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101) },
        { id: 2, liveoccupancy: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101) },
        { id: 3, liveoccupancy: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101) },
        { id: 4, liveoccupancy: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101) },
    ]);

    const getRandomColor = () => {
        const colors = ['info', 'warning', 'danger', 'success', 'primary', 'secondary'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const [building, setBuilding] = useState('');
    const [floor, setFloor] = useState('');
    
    
    const handleBuildingChange = (e: any) => {
        setBuilding(e.value);
    }
    
    const handleFloorChange = (e: any) => {
        setFloor(e.value);
    }
    
    return (
        <Card>
            <Card.Body>
            <Row className="">


            <Col lg={5} md={5} sm={5}  className=''>
<div className="form-group mb-3">
    <label className="form-label">Building</label>
    <Select
        className="react-select"
        classNamePrefix="react-select"
        options={Buildings}
        placeholder="Select Building" 
        onChange={handleBuildingChange}
    ></Select>
</div>
</Col>
<Col lg={5} md={5} sm={5}  className=''>
<div className="form-group mb-3">
    <label className="form-label">Floor</label>
    <Select
        className="react-select"
        classNamePrefix="react-select"
        options={Floors}
        placeholder="Select Floor "
        onChange={handleFloorChange}
    ></Select>
</div>
</Col>


<Col lg={2} md={2} sm={2}  className=''>

<button
            type="button"
            className="btn btn-sm btn-light float-end "
            // style={{ marginTop: "6px" }}

            // onClick={() => {
            //   setShowAddModal(true);
            // }}
          >
            Visualize
          </button>
          </Col>





</Row>

                <h4 className="header-title mt-1 mb-3">Building 1- Floor 1</h4>
                <div style={{ maxHeight: '120px', overflowY: 'auto' }}>

                <Table responsive className="table table-sm table-centered mb-0 font-14">
                    <thead className="table-light">
                        <tr>
                            <th>Washroom Id</th>
                            <th style={{ width: '40%' }}>Indicator</th>
                        </tr>
                    </thead>
                    {/* <SimpleBar style={{ maxHeight: '600px', width: '100%' }}> */}

                        <tbody>
                            {washroomsData.map((washroom) => (
                                <tr key={washroom.id}>
                                    <td>WS{washroom.id}</td>
                                    <td>
                                        <ProgressBar
                                            now={washroom.indicatorValue % 101}
                                            style={{ height: '3px' }}
                                            variant={getRandomColor()}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    {/* </SimpleBar> */}
                </Table></div>

            </Card.Body>
        </Card>
    );
};

export default Building1;
