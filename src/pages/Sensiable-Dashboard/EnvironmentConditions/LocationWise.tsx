import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import BuildingSplitUp from "../BuildingsetUpModal";

const LocationWise = () => {
  const [locationWise,setLocationWise] = useState({
    data: [
      { value: 16, name: 'Location 1' },
      { value: 18, name: 'Location 2' },
      { value: 20, name: 'Location 3' },
      { value: 18, name: 'Location 4' },
      { value: 16, name: 'Location 5' },
      { value: 22, name: 'Location 6' },
      { value: 24, name: 'Location 7' },
      { value: 15, name: 'Location 8' }
    ],
  });
  // const getLocationWise =async()=>{
  //   try{
  //       const response=await getLocationWiseData();
  //       setLocationWise(response);
  //   }
  //   catch(error){
  //     console.log('Error:', error);
  //   }
  // }
  const option = {
    title: {
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter:'{a} <br/>{b} : {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {    
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Location Wise IAQ',
        type: 'pie',
        radius: [20, 140],
        center: ['50%', '40%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false, 
        },
        emphasis: {
          label: {
            show: false, 
          },
        },
        data:locationWise?.data

      },
    ],
  
  };
  
  
  const [locationData, setLocationData] = useState(option);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSubmit = () => {
   
  };
  return (
    <>
    <Card className="">
      <Row className="">
        <Col md={8}>
          <Card.Title className='m-2'>LOCATION WISE IAQ</Card.Title>
        </Col>
        <Col md={4}>
          <button
            type="button"
            className="btn btn-sm btn-light float-end me-2"
            style={{ marginTop: "6px" }}

            onClick={() => {
              setShowAddModal(true);
            }}
          >
            View
          </button>
        </Col>
      </Row>
      <div style={{ width: "100%", height: 240, }}>
        <ReactEcharts option={option} />
      </div>
    </Card>
    <BuildingSplitUp show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

    </>
  );
};

export default LocationWise;
