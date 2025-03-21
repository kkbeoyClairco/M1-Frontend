import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import { Breadcrumb, Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import { CardTitle } from "components";
import { Link } from "react-router-dom";
import AreaEnvironmentModal from "./AreaEnvironmentModal";

const EnvironmentalTrends = () => {
  const [environmentTrends, setEnvironmentTrends] = useState<any>({
    data: [
      [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5],
      [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2],
      [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4],
      [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1],
      [4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],


    ],
  });

  const graphColors = ['#35B8E0', '#FF5B5B', '#F9C851', '#10C469', '#536DE6'];
  
  // const getEnvironmentTrends = async () => {
  //   try {
  //     // Replace this with your API call to fetch data
  //     const response = await fetch("your_api_endpoint");
  //     const data = await response.json();
  //     setEnvironmentTrends(data);
  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // };

  // useEffect(() => {
  //   getEnvironmentTrends();
  // }, []);

  const hours = [
    '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
    '7:00', '8:00', '9:00', '10:00', '11:00',
    '12:00', '1:00', '2:00', '3:00', '4:00', '5:00',
    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00'
  ];

  const days = [
    'Saturday', 'Friday', 'Thursday',
    'Wednesday', 'Tuesday',
  ];

  const singleAxis: echarts.SingleAxisComponentOption[] = [];
const series: echarts.ScatterSeriesOption[] = [];

days.forEach(function (day: any, idx: any) {
  singleAxis.push({
    left: 20,
    right:0, // Adjust this value to move the graph to the left
    type: 'category',
    boundaryGap: false,
    data: hours,
    top: (idx * 140) / 7 + 5 + '%', // Adjusted top value
    height: 80 / 7 - 5 + '%', // Adjusted height value
    axisLabel: {
      interval: 2
    }
  });

  const graphColor = graphColors[idx] || 'auto';
  series.push({
    singleAxisIndex: idx,
    coordinateSystem: 'singleAxis',
    type: 'scatter',
    data: environmentTrends.data
      .filter((dataItem: any) => dataItem[0] === idx)
      .map((filteredItem: any) => [filteredItem[1], filteredItem[2]]),
    symbolSize: function (dataItem: any) {
      return dataItem[1] * 4;
    },
    itemStyle: {
      color: graphColor,
    },
  });
});

const option = {
  tooltip: {
    position: 'top'
  },
  singleAxis: singleAxis,
  series: series
};
 
const [showAddModal, setShowAddModal] = useState(false);

const handleModalOpen = () => {
  setShowAddModal(true);
};

const handleCloseModal = () => {
  setShowAddModal(false);
};
const handleSubmit=()=>{

}

  return (
    <>
      <Card style={{ height: '720px'}}>
      <Row className='mt-3'>
            <Col md="8" >
             <h4 style={{marginLeft:"20px"}}>ENVIRONMENT TRENDS</h4>
            </Col>
            <Col md="4">
            <Link to="#" className="btn btn-primary ms-1 float-end me-3" onClick={handleModalOpen}
>
          <i className="mdi mdi-filter-variant"></i>
                                </Link>
            </Col>
      
       
          </Row>
          <Breadcrumb className='' style={{ marginTop: '-20px', marginLeft: '20px'  }}>
            <Breadcrumb.Item href="/ui/breadcrumb">Location</Breadcrumb.Item>
            <Breadcrumb.Item href="/ui/breadcrumb">Building</Breadcrumb.Item>
            <Breadcrumb.Item active>Floor</Breadcrumb.Item>
          </Breadcrumb>

      <Card.Body>
      <ReactEcharts option={option} style={{ maxWidth: '100%', height: '450px', margin: 'auto' }} />
      <Row className='mt-3'>
         
            <Col md="8" className="">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontWeight: 'normal', marginBottom: '15px', paddingRight: '20px' }}>
                  <i className="mdi mdi-circle text-info " style={{ fontSize: '15px' }}></i> IAQ
                </div>
                <div style={{ fontWeight: 'normal', marginBottom: '15px', paddingRight: '20px' }}>
                  <i className="mdi mdi-circle text-danger" style={{ fontSize: '15px' }}></i> Temparature(C)
                </div>
                <div style={{ fontWeight: 'normal', marginBottom: '15px', paddingRight: '20px' }}>
                  <i className="mdi mdi-circle text-warning" style={{ fontSize: '15px' }}></i> Humidity(%)
                </div>
                <div style={{ fontWeight: 'normal', marginBottom: '15px', paddingRight: '20px' }}>
                  <i className="mdi mdi-circle text-success" style={{ fontSize: '15px' }}></i> CO2(PPM)
                </div>
                <div style={{ fontWeight: 'normal', marginBottom: '15px', paddingRight: '20px' }}>
                  <i className="mdi mdi-circle text-primary" style={{ fontSize: '15px' }}></i> VOC(PPM)
                </div>
              </div>
            </Col>
            <Col md="4" className='float-end' style={{marginLeft:"30"}}>
            <ButtonGroup className="">
                  <Button variant="primary">Day</Button>
                  <Button variant="primary">Week</Button>
                  <Button variant="primary">Month</Button>
                  <Button variant="primary">Quarter</Button>
                  <Button variant="primary">Year</Button>
                </ButtonGroup>           
                 </Col>
          </Row>
</Card.Body>
<AreaEnvironmentModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

    </Card>
    </>
  );
};

export default EnvironmentalTrends;
