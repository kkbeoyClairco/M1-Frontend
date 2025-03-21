import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ReactEcharts from 'echarts-for-react';
import Select from 'react-select';
import { Col, Row, Card } from 'react-bootstrap';
import { Column } from 'react-table';
import { Table, CellFormatter } from 'components';
import { Buildings, Floors, Unit, customer } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';
type ParametersModalProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    modalTitle?: string;
    cardTitle?: string;
    temperatureHeader?:string;
  };
  const Parameter: React.FC<ParametersModalProps> = (props: ParametersModalProps) => {
    const [locationsplitData, setLocationSplitData] = useState([
    { value: 50, name: 'Location 1' },
    { value: 60, name: 'Location 2' },
    { value: 70, name: 'Location 3' },
    { value: 30, name: 'Location 4' },
    { value: 10, name: 'Location 5' },
  ]);

  const option = {
    toolbox: {},legend: {
      orient: 'horizontal',
      right: '%',
      bottom:'0%',
      data: locationsplitData.map((item) => item.name),
    },


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
          borderWidth: 2,
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

  const handleChartResize = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.resize();
    }
  };

  const chartRef = React.createRef<ReactEcharts>();
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [unit, setUnit] = useState('');

  const handleBuildingChange = (e: any) => {
    setBuilding(e.value);
  };

  const handleFloorChange = (e: any) => {
    setFloor(e.value);
  };

  const handleUnitChange = (e: any) => {
    setUnit(e.value);
  };

  const columns: ReadonlyArray<Column> = [
    {
      Header: 'TimeStamp',
      accessor: 'timestamp',
      defaultCanSort: true,
    },
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
        Header: 'BusinessUnit',
        accessor: 'businessunit',
        defaultCanSort: false,
      },
      {
        Header: 'SensorId',
        accessor: 'id',
        defaultCanSort: false,
      },
      {
        Header: props.temperatureHeader ,
        accessor: 'temparature',
        defaultCanSort: false,
      },
  ];

  return (
    <Modal
    size='xl'
    {...props}
    aria-labelledby='contained-modal-title-vcenter'
    className={`modal-center ${props.cardTitle}`}
    centered
    onHide={props.onClose}
    onEntered={handleChartResize}
  >
       <Modal.Header className={`bg-primary text-white`} closeButton>
       <Modal.Title id='contained-modal-title-vcenter'>
          {props.modalTitle}
        </Modal.Title>

      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={12} className='mb-3'>
          
        <Card.Title className='mt-2' style={{ marginLeft: '20px' }}>
          {props.cardTitle }
        </Card.Title>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} className='mb-3'>
            <Card>

            <div
              style={{ width: '100%', height: '450px', marginTop: '20px' }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
     <Row>
  <Col lg={4} md={4} sm={4} xs={12} className=''>
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
  <Col lg={4} md={4} sm={4} xs={12} className=''>
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
  <Col lg={4} md={4} sm={4} xs={12} className=''>
    <div className="form-group mb-3">
      <label className="form-label">WashRoom</label>
      <Select
        className="react-select"
        classNamePrefix="react-select"
        options={Unit}
        placeholder="Select Unit"
        onChange={handleUnitChange}
      ></Select>
    </div>
  </Col>
</Row>

              <ReactEcharts
                ref={chartRef}
                option={option}
                opts={{ renderer: 'svg' }}
                style={{ height: '70%', width: '100%' }}
              />
              
            </div>
            </Card>

            
          </Col>


          <Col lg={6} md={12} className='mb-3'>
          <Card>
              <Card.Body>
                <Card.Title>Building 1 {'>'} Floor 2 {'>'} Washroom 3</Card.Title>
               
                  <Table
                    columns={columns}
                    data={customer}
                    isSortable={true}
                    tableClass='table-striped text-center'
                    searchBoxClass='mt-2 mb-3'
                  />
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Parameter;
