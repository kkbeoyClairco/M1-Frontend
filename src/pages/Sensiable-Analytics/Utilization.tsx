import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SettingModal from './SettingsModal/Index';

interface UtilizationProps {
  height?: string;
}

const Utilization: React.FC<UtilizationProps> = ({ height }) => {
  const [utilizationPattern, setUtilizationPattern] = useState({
    data1: [0, 600, 200, 800, 200, 1000, 200, 1200, 300, 1400],
    data2: [720, 632, 601, 534, 1190, 1230, 1220],
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
        smooth: false,
        showSymbol: false,
        lineStyle: {
          color: 'blue',
        },
      },
      {
        data: utilizationPattern.data2,
        type: 'line',
        smooth: false,
        showSymbol: false,
        lineStyle: {
          color: 'green',
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
            <Card.Title>UTILIZATION PATTERN</Card.Title>
          </Col>  
             <Col md="4">
             <Link to="#" className="btn btn-primary ms-1 float-end mb-2"  onClick={handleModalOpen}
>
          <i className="mdi mdi-filter-variant"></i>
                               </Link>
           </Col>
        </Row>

 <div className="chart-content-bg">
                    <Row className="text-center">
                        <Col md={3}>
                            <p className="text-muted mb-0 mt-3">0-10Mins</p>
                            <h2 className="fw-normal mb-3">
                                <small className="mdi mdi-checkbox-blank-circle text-success align-middle me-1"></small>
                                <span>54</span>
                            </h2>
                        </Col>

                        <Col md={3}>
                            <p className="text-muted mb-0 mt-3">10Mins-4Hrs</p>
                            <h2 className="fw-normal mb-3">
                                <small className="mdi mdi-checkbox-blank-circle text-success align-middle me-1"></small>
                                <span>254</span>
                            </h2>
                        </Col>
                        <Col md={3}>
                            <p className="text-muted mb-0 mt-3">4Hrs-8Hrs</p>
                            <h2 className="fw-normal mb-3">
                                <small className="mdi mdi-checkbox-blank-circle text-success align-middle me-1"></small>
                                <span>25</span>
                            </h2>
                        </Col>
                        <Col md={3}>
                        <p className="text-muted mb-0 mt-3">&gt;8Hrs</p>
                            <h2 className="fw-normal mb-3">
                                <small className="mdi mdi-checkbox-blank-circle text-success align-middle me-1"></small>
                                <span>58</span>
                            </h2>
                        </Col>
                    </Row>
                </div>
             
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
      <SettingModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

    </Card>
  );
};

export default Utilization;
