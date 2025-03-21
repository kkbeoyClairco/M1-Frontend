import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Breadcrumb, Card } from 'react-bootstrap';

const SeatOccupancy = () => {
  const [locationsplitData, setLocationSplitData] = useState([
    { value: 50, name: 'Location 1' },
    { value: 60, name: 'Location 2' },
    { value: 70, name: 'Location 3' },
    { value: 30, name: 'Location 4' },
    { value: 20, name: 'Location 5' },
  ]);

  const option = {
    toolbox: {},
    grid: {
      left: 50,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['54%', '40%'],

        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: '{c}%\n{b}',
          fontSize: 20,
          fontWeight: 'normal',
          color: '#6C757D',
        },
        labelLine: {
          show: true,
        },
        data: locationsplitData,
      },
    ],
  };

  const handleMouseOver = () => {
    setLocationSplitData((prevData) =>
      prevData.map((item) => ({ ...item, label: { show: false } }))
    );
  };

  const handleMouseOut = () => {
    setLocationSplitData((prevData) =>
      prevData.map((item) => ({ ...item, label: { show: true } }))
    );
  };

  return (
    <Card style={{ height: 'auto', marginBottom: '40px' }}>
      <Card.Title className='mt-2' style={{ marginLeft: '20px' }}>
        SEAT OCCUPANCY
      </Card.Title>
 

      <div
        style={{ width: '100%', height: '320px', marginTop: '20px' }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <ReactEcharts
          option={option}
          opts={{ renderer: 'svg' }}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </Card>
  );
};

export default SeatOccupancy;
