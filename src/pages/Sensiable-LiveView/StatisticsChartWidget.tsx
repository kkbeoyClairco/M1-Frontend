import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';



type StatisticsChartWidgetProps = {
  colors?: Array<string>;
  name?: string;
  dataPercentage?: number;
  textClass?: string;
  bgClass?: string;
  iconPath?: string;
  description?: string;
  title?: string;
  stats1?: string;
  stats2?: string;
  stats3?: string;
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
  dataPercentage = 0,
  textClass,
  bgClass,
  iconPath,
  description,
  title,
  stats1,
  stats2,
  stats3,

  trend,
}: StatisticsChartWidgetProps) => {
  const remainingPercentage = 100 - dataPercentage;

  const option = {
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    series: [
      {
        type: 'pie',
        radius: ['85%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '{a|percent}\n{b|{c}}',
          rich: {
            a: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#6C757D',
            },
            b: {
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          fontSize: 20,
          fontWeight: 'bold',
          color: '#6C757D',
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: dataPercentage,
            name: 'Data',
            itemStyle: {
              color: colors && colors.length > 0 ? colors[0] : '#727cf5',
            },
          },
          {
            value: remainingPercentage,
            name: 'Remaining',
            itemStyle: {
              color: '#DEE2E6',
            },
            emphasis: { 
              label: {
                show: false,
              },
            },
          },
        ],
      },
    ],
  };

  const isAvailable = trend.value === 'Available'; 

  return (
    <Card className={classNames('widget-flat', bgClass, isAvailable ? 'bg-green' : 'bg-red')} style={{ height: '210px' }}>
      <Card.Body>
        <Row className="align-items-center" style={{marginTop:'-15px'}}>
          <div className="d-flex align-items-center">
            <Col md={2}>
              {iconPath && (
                <div className="mb-1">
                  <img src={iconPath} alt='Statistics Icon' />
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
        </Row>
        <Row>
          <Col className="col-6 mt-1">
            <h5>
              <div className="mt-1" style={{ fontWeight: 'normal', marginBottom: '15px' }}>Total: {stats1}</div>
              <div className="mt-1" style={{ fontWeight: 'normal', marginBottom: '15px' }}>Occupied: {stats2}</div>
              <div className="mt-1" style={{ fontWeight: 'normal', marginBottom: '15px' }}>Available: {stats3}</div>
            </h5>
          </Col>
          <Col className="col-6 pl-3">
            <div className="text-end">
              <ReactEcharts
                option={option}
                opts={{ renderer: 'svg' }}
                style={{ width: '160px', height: '130px'}}
              />
            </div>
          </Col>
        </Row>
        {trend && (
          <div
            className='px-2'
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              borderRadius: '10px',
              backgroundColor: isAvailable ? '#10C4694D' : '#FF57334D',
              color: isAvailable ? '#10C469' : '#FF5733',
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
