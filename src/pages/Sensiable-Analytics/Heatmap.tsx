import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import * as echarts from 'echarts';
import { Link } from 'react-router-dom';
import FilterModal from './FilterModal';
// import FilterModal from './FilterModal';

const HeatMap = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const handleModalOpen = () => {
      setShowAddModal(true);
    };
  
    const handleCloseModal = () => {
      setShowAddModal(false);
    };
  
    const handleSubmit = () => {
     
    };
  
  function getVirtualData(year: string) {
    const date = +echarts.time.parse(year + '-01-01');
    const end = +echarts.time.parse(+year + 1 + '-01-01');
    const dayTime = 3600 * 24 * 1000;
    const data: [string, number][] = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
        Math.floor(Math.random() * 10000)
      ]);
    }
    return data;
  }

  const option = {

    tooltip: {},
    visualMap: {
      min: 0,
      max: 10000,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 220
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: '2016',
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData('2016')
    }, 
    
  };

  return (
    <>
    <Card style={{ width: '100%', margin: 'auto', marginTop: '20px' }}>
           <Row >
          <Col md={10}   className='mt-3'>
            <Card.Title className='ms-2'>HEATMAP PATTERN</Card.Title>
          </Col>  
             <Col md={2} className='mt-3'>
             <Link to="#" className="btn btn-primary float-end me-3" onClick={handleModalOpen} 
>
          <i className="mdi mdi-filter-variant"></i>
                               </Link>
           </Col>
        </Row>
      <div style={{ height: '275px', width: '100%' }}>
        <div ref={(el) => el && echarts.init(el).setOption(option)} style={{ height: '100%' }} />
      </div>
    </Card>
    <FilterModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

    </>
  );
};

export default HeatMap;
