import React, { useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Col, Dropdown, DropdownButton, Form, InputGroup, Row } from 'react-bootstrap';

const SplitupChart = ({ props }: { props: any }   ) => {
  const option = {
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Download',
          name: 'locationsplit-up',
          pixelRatio: 5,
          type: 'jpeg',
          iconStyle: {
            color: '',
            top:'20px' // Set the icon color to black
          },
        },
      },
    },
    grid: {
      left: 50,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '80%'],
        center: ['30%', '40%'],
        avoidLabelOverlap: true,
        label: {
          show: true, // Set to true by default
          position: 'center',
          formatter: '{c}%\n{b}',
          fontSize: 20,
          fontWeight: 'normal',
          color: '#6C757D',
        },
        labelLine: {
          show: true,
        },
        data: [
          { value: 50, name: 'Location1' },
          { value: 60, name: 'Location2'},
          { value: 70, name: 'Location3' },
          { value: 30, name: 'Location4' },
          { value: 10, name: 'Location5' },
        ],
      },
    ],
  };

  const [locationsplitData, setLocationSplitData] = useState<any>(option);
  const chartRef = useRef<any>(null);

 
  const handleMouseOver = () => {
    const updatedOption = {
      ...option,
      series: [
        {
          ...option.series[0],
          label: {
            ...option.series[0].label,
            show: false,
          },
        },
      ],
    };
    setLocationSplitData(updatedOption);
  };

  const handleMouseOut = () => {
    const updatedOption = {
      ...option,
      series: [
        {
          ...option.series[0],
          label: {
            ...option.series[0].label,
            show: true,
          },
        },
      ],
    };
    setLocationSplitData(updatedOption);
  };


  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(props.show);

  const handleBuildingSelect = (selectedValue:any) => {
    setSelectedBuilding(selectedValue);
  };

  const handleFloorSelect = (selectedValue:any) => {
    setSelectedFloor(selectedValue);
  };
  useEffect(() => {
    if (chartRef.current && isModalVisible) {
        chartRef.current.getEchartsInstance().resize();
    }
}, [isModalVisible]);
  return (
    <Card style={{ height: 450 }}>
      <Row>
        <Col md={10} xs={12}>
          <h4 style={{ fontSize: '15.5px', paddingLeft: '15px', paddingTop: '5px' }}>LOCATION WISE IAQ</h4>
        </Col>
        <Col md={2} xs={12}>
          <div style={{ marginBottom: '15px' }}>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group>
            <InputGroup className="mb-3">
              <DropdownButton
                variant="primary"
                title='Building'
                id="building-dropdown"
              >
                <Dropdown.Item onClick={() => handleBuildingSelect('Building1')}>Building1</Dropdown.Item>
                <Dropdown.Item onClick={() => handleBuildingSelect('Building2')}>Building2</Dropdown.Item>
                <Dropdown.Item onClick={() => handleBuildingSelect('Building3')}>Building3</Dropdown.Item>
                <Dropdown.Item onClick={() => handleBuildingSelect('Building4')}>Building4</Dropdown.Item>
              </DropdownButton>
              <Form.Control
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                aria-label="Text input with dropdown button"
                placeholder='Select Building'
              />
            </InputGroup>
          </Form.Group>
        </Col>

        <Col sm={6} >
          <Form.Group>
            <InputGroup className="mb-3">
              <DropdownButton
                variant="primary"
                title='Floor'
                id="floor-dropdown"
              >
                <Dropdown.Item onClick={() => handleFloorSelect('Floor1')}>Floor1</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFloorSelect('Floor2')}>Floor2</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFloorSelect('Floor3')}>Floor3</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFloorSelect('Floor4')}>Floor4</Dropdown.Item>
              </DropdownButton>
              <Form.Control
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                aria-label="Text input with dropdown button"
                placeholder='Select Floor'
              />
            </InputGroup>
          </Form.Group>
        </Col>
        </Row>
       <div
        style={{ width: '150%', height: 350, marginTop: '40px' }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <ReactEcharts ref={chartRef}  option={locationsplitData} opts={{ renderer: 'svg' }} />
      </div>
    </Card>
  );
};


export default SplitupChart;
