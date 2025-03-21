import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { ApexOptions } from 'apexcharts'; 
import classNames from 'classnames';
import Chart from 'react-apexcharts'; 




type StatisticsChartWidgetProps = {
  colors?: Array<string>;
  name?: string;
  data?: Array<number>;
  textClass?: string;
  bgClass?: string;
  description?: string;
  title?: string;
  stats?: string;
  temp?:string;
  Humidity?:string;
  Co2?:string;
  Voc?:string;
  iconPath?:string;
    apexData: Array<number>; 


  trend: {
    textClass: string;
    icon: string;
    value: string;
    title?: string;
  };
};

const StatisticsChartWidget = ({
  colors,
  name,
  data,
  textClass,
  bgClass,
  iconPath,
  description,
  title,
  stats,
  trend,
  temp,
  Humidity,
  Co2,
  Voc,
  apexData,
}: StatisticsChartWidgetProps) => {const apexOpts: ApexOptions = {
  grid: {
    padding: {
      left: 0,
      right: 0,
    },
  },
  
  chart: {
    height: 278,
    type: 'radialBar',
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 270,
      
      
      dataLabels: {
        name: {
          show: false, 
          fontSize: '22px',
        },
        
        value: {
          show: false, 
          fontSize: '16px',
        },
      },
     
      
      
    },
  },
 
  colors: ['#0ACF97', '#727CF5', '#FA5C7C', '#FFC35A'],
   
    stroke: {
      width: -2,
  }
};


  
  // const apexData = [44, 55, 67, 83];
  

  const isIdeal = trend.value === 'Ideal'; 

  return (
    <Card className={classNames('widget-flat', bgClass)} style={{ height: '210px' }}>
      <Card.Body>
        <Row className="align-items-center "style={{marginTop:'-15px'}}>
          <div className="d-flex align-items-center">
          <Col md={2}>
                    {iconPath && (
                        <div className="">
                          <img src={iconPath} alt='Statistics Icon'/>
                        </div>
                    )}
                     </Col>
            <div>
              <h3
                className={classNames('', 'header-title', textClass ? textClass : 'text-muted')}
                title={description}
                style={{
                  paddingLeft: '10px',
                  textTransform: 'none',
                  color: '#6C757D',
                }}
              >
                {title}
              </h3>
            </div>
          </div>
          <Col className="col-6">
            <h5>
              <div style={{ fontWeight: 'normal', marginBottom: '15px' }}><i className="mdi mdi-square text-danger"></i>  Temp: {temp}</div>
              <div style={{ fontWeight: 'normal', marginBottom: '15px' }}><i className="mdi mdi-square text-warning"></i>  Humidity: {Humidity}</div>
              <div style={{ fontWeight: 'normal', marginBottom: '15px' }}><i className="mdi mdi-square text-success"></i>  Co2: {Co2}</div>
              <div style={{ fontWeight: 'normal', marginBottom: '15px' }}>
               <i className="mdi mdi-square" style={{ color: '#5470C6' }}></i>  VOC:{Voc}
              </div>

            </h5>
          </Col>
          <Col className="col-6">
            <div className="text-end">
              <Chart
                options={apexOpts}
                series={apexData}
                type="radialBar"
                height={150} 
                style={{ width: '100%' }} 
               
              />
            </div>
          </Col>
        </Row>
        {trend && (
          <div className='px-2'
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              borderRadius: '10px',
              backgroundColor: isIdeal ? '#10C4694D' : '#FF57334D',
              color: isIdeal ? '#10C469' : '#FF5733',
              width: 'auto', 
              textAlign: 'center',
            }}
          >
            {trend.value}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatisticsChartWidget;
