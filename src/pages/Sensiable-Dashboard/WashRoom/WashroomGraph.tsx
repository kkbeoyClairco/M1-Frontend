import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { CardTitle } from 'components';
import { Link } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import AreaModal from '../EnvironmentConditions/AreaModal';
// import AreaModal from './EnvironmentConditions/AreaModal';
// import AreaModal from './AreaModal';

const WashroomGraph = () => {
  const [occupancyData, setOccupancyData] = useState<any>({
    series1: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 70],
    series2: [40, 28, 75, 40, 68, 20, 92, 60, 45, 32, 70, 55],
    series3: [20, 28, 33, 55, 23, 30, 92, 68, 55, 33, 22, 77],
    series4: [75, 28, 32, 99, 77, 20, 55, 88, 48, 32, 39, 55],


  });
  // const getoccupancyData= async () => {
  //   try {
  //     const response = await getoccupancyData();
  //     setOccupancyData(response);
  //   } catch (error) {
  //     console.error('Error fetching dashboard stats:', error);
  //   }
  // };
  // useEffect(() => {
 
  // }, []); 

  const echartsOption = {
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Download',
          name: 'locationsplit-up',
          pixelRatio: 5,
          type: 'jpeg',
          iconStyle: {
            color: '',
            top: '20px',
          },
        },
      },
    },
 
    legend: {
      icon: 'circle',
      bottom:'-6',
      left: '0',  
      data: ['DustbinCleanups', 'WashroomCleanup','TissuePaperRefill','SoapDispenserRefill'],
    },
  
    grid: {
      left: '5%',
      right: '0%',
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTick: {
        alignWithLabel: true,
      },
      barGap: '20%', 
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: 'DustbinCleanups',
        data: occupancyData.series1,
        type: 'bar',
        barWidth: '20%',
        itemStyle: {
          color: '#34CD80',
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
      {
        name: 'WashroomCleanup',
        data: occupancyData.series1,
        type: 'bar',
        barWidth: '20%',
        itemStyle: {
          color: '#FFBC00',
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
      {
        name: 'TissuePaperRefill',
        data: occupancyData.series1,
        type: 'bar',
        barWidth: '20%',
        itemStyle: {
          color: '#144059',
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
      {
        name: 'SoapDispenserRefill',
        data: occupancyData.series1,
        type: 'bar',
        barWidth: '20%',
        itemStyle: {
          color: '#536DE6',
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
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
    <>
      <Card className="" style={{ height: '720px' }}> 
        <Card.Body>
          <Row>
            <Col md="8">
              <CardTitle
                containerClass="d-flex align-items-center justify-content-between mb-2"
                title="WASHROOM TRENDS"
                menuItems={[]}
              />
            </Col>
            <Col md="4">
            <Link to="#" className="btn btn-primary ms-1 float-end" onClick={handleModalOpen}
>
          <i className="mdi mdi-filter-variant"></i>
           </Link>
            </Col>
      
          </Row>
          <Breadcrumb className='' style={{ marginTop: '-30px' }}>
            <Breadcrumb.Item href="/ui/breadcrumb">Location</Breadcrumb.Item>
            <Breadcrumb.Item href="/ui/breadcrumb">Building</Breadcrumb.Item>
            <Breadcrumb.Item active>Floor</Breadcrumb.Item>
          </Breadcrumb>

          <div dir="ltr">
          <ReactECharts option={echartsOption} style={{ height: '480px' }} /> 
          </div>
          <div className="text-end">
            <Row className='mt-5'>
              <Col md="3">Note: Calculation % is based upon</Col>  
              <Col md="9">
              <ButtonGroup className="float-end">
                  <Button variant="primary">Day</Button>
                  <Button variant="primary">Week</Button>
                  <Button variant="primary">Month</Button>
                  <Button variant="primary">Quarter</Button>
                  <Button variant="primary">Year</Button>
              </ButtonGroup></Col>              
            </Row>
          </div>
        </Card.Body>
        <AreaModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

      </Card>

    </>
  );
};

export default WashroomGraph;
