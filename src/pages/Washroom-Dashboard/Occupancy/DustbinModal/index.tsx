import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface DustbinProps {
  height?: string;
}

const DustbinModal: React.FC<DustbinProps> = ({ height }) => {
  const [utilizationPattern, setUtilizationPattern] = useState({
    data1: [0, 600, 200, 800, 200, 1000, 200, 1200, 300, 1400],
  });
//   const getUtilizationPattern=async()=>{
//     try{
// const response= await getUtilizationPattern();
// setUtilizationPattern(response);
//     }
//     catch(error){
//       console.log('Error',Error)
//     }
//   }
  


  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      name: 'Days', 
      nameTextStyle: {
        fontWeight: 'bold', // Make the y-axis label thicker
        nameLocation: 'middle' ,// Place the label at the middle of the axis
        nameGap: '15' 

      },

      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Occupancy', 
      nameTextStyle: {
        fontWeight: 'bold', 
        name: 'Day of the Week',
        nameLocation: 'middle', 
        nameGap: '15' 


      },

      splitLine: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    series: [
      {
        data: utilizationPattern.data1,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: 'blue',
        },
      },

    ],
  };
  const [showAddModal, setShowAddModal] = useState(false);

  const handleModalOpen = () => {
    setShowAddModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
  };
  
  const handleSubmit = () => {
   
  };
  
  return (
    <Card>
      <Card.Body style={{ height: '590px' }}>
        
        <Row>
          <Col md={8}>
            <Card.Title>Dustbin Level</Card.Title>
          </Col>  
             <Col md="4">
             <Link to="#" className="btn btn-primary ms-1 float-end mb-2"  onClick={handleModalOpen}
>
          <i className="mdi mdi-filter-variant"></i>
                               </Link>
           </Col>
        </Row>


             
        <div style={{ height: height || '500px' }}>
          <ReactECharts option={option} style={{ height: '80%' }} />         
        </div>    
        <ButtonGroup
          className="position-absolute bottom-0 end-0 mb-2 me-2"
        >
          <Button variant="primary">Day</Button>
          <Button variant="primary">Week</Button>
          <Button variant="primary">Month</Button>
          <Button variant="primary">Quarter</Button>
          <Button variant="primary">Year</Button>
        </ButtonGroup>  
      </Card.Body>

    </Card>
  );
};

export default DustbinModal;
