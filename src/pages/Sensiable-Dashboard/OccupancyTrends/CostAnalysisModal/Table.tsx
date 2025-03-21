import React, { useState } from 'react';
import { Column } from 'react-table';
import { Table, PageSize } from 'components';
import { AlertTableType } from 'pages/EnvironmentAnalytics/types';
import { AlertData } from 'pages/EnvironmentAnalytics/data';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { Buildings, Floors, Sensors, Unit } from '../data';
// import { Buildings, Floors, Sensors, Unit } from '../OccupancyTrends/data';
const columns: ReadonlyArray<Column> = [
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
  {
    Header: 'Seat Name',
    accessor: 'sensor_id',
    defaultCanSort: false,
  },
  {
    Header: 'Business Unit',
    accessor: 'businessunit',
    defaultCanSort: false,
  },
  {
    Header: 'Utilization Factor',
    accessor: 'parameter_value',
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
//   const[CostAnalysisTableData,setCostAnalysisTableData]=useState('')
//   const getCostAnalysisTableData =async()=>{
//       try{
// const response =await getCostAnalysisTableData();
// setCostAnalysisTableData(response)

//       }
//       catch(error){
//           console.log('Error',error)

//       }
//   }
const [building, setBuilding] = React.useState('');
const [floor, setFloor] = React.useState('');
const [unit, setUnit] = React.useState('');
const [Date, setDate] = React.useState('');

const handleBuildingChange = (e: any) => {
    setBuilding(e.value);
}

const handleFloorChange = (e: any) => {
    setFloor(e.value);
}

const handleUnitChange = (e: any) => {
    setUnit(e.value);
}

const handleDateChange = (e: any) => {
    setDate(e.value);
}

  return (
    <>
  <Row>
  <Col lg={2} md={6} sm={6} xs={12} className='me-3'>
                    <div className="form-group mb-3">
                        <label className="form-label">Date</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Sensors}
                            placeholder="Select Date"
                            onChange={handleDateChange}
                        ></Select>
                    </div>
                    </Col>
                    <Col lg={2} md={6} sm={6} xs={12} className='me-3'>
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
                <Col lg={2} md={6} sm={6} xs={12} className='me-3'>
                    <div className="form-group mb-3">
                        <label className="form-label">Floor</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Floors}
                            placeholder="Select Floor"
                            onChange={handleFloorChange}
                        ></Select>
                    </div>
                </Col>
                <Col lg={2} md={6} sm={6} xs={12} className='me-3'>
                    <div className="form-group mb-3">
                        <label className="form-label">BusinessUnit</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Unit}
                            placeholder="Select Unit"
                            onChange={handleUnitChange}
                        ></Select>
                    </div>
                </Col>
                <Col lg={2} md={6} sm={6} xs={12} className='me-3'>
                  <Form.Group className="">
<Form.Label htmlFor="searchBox">Occupancy Threshold %</Form.Label>
<Form.Control type="text" id="searchBox" placeholder='percent' style={{ width: '100%', maxWidth: '200px' }} />
</Form.Group>
                </Col>


            
            </Row>
      <Table<AlertTableType>
        columns={columns}
        data={AlertData}
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
