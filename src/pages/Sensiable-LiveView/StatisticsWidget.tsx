import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';

type StatisticsWidgetProps = {
    textClass?: string;
    bgClass?: string;
    iconPath?:any;
    title: string;
    description: string;
    stats?: string;
    trend: {
        textClass?: string;
        icon?: string;
        value?: string;
        time?: string;
    };
    additionalTitle?: string; 
};

const StatisticsWidget = ({ textClass, bgClass, iconPath, title, stats, trend, description, additionalTitle }: StatisticsWidgetProps) => {
    return (
        <Card className={classNames('widget-flat', bgClass)}style={{ height: '210px' }}>
            <Card.Body>
                
                <Row style={{marginTop:'-15px'}}>
                    <Col md={2}>
                    {iconPath && (
                        <div className="mb-4">
                          <img src={iconPath} alt='Statistics Icon'/>
                        </div>
                    )}
                     </Col>
                     <Col md={10}>
                    <div>
                   
                        <h4
                            className={classNames('mt-2', '', textClass ? textClass : 'text-muted')}
                            title={description}
                            style={{ paddingLeft: '20px', textTransform: 'none', color: '#6C757D',fontWeight:'20px'}} // Set text-transform to none
                        >
                            {title}
                        </h4>
                        </div>
                        </Col>
                        </Row>
                        <Row>
                        <h5 className={classNames('mt-0', 'mb-0', textClass ? textClass : null)} style={{ paddingTop: '15px' }}>
  <span style={{ fontWeight: 'normal', color: '#8A999C',fontSize:'20px' }}>{additionalTitle}</span>
  <span className="header-title" style={{ fontWeight: 'normal', color: '#8A999C',fontSize:'20px' }}>:{stats}</span>
</h5>

</Row>
                  
                    {/* </div> */}
             <Row className=' px-4'>
             {trend && (
  <p className={classNames('mt-4', textClass ? textClass : 'text-muted')}  style={{marginLeft:"30px"}}>
    <span className={classNames(trend.textClass, '')}>
      <i className={classNames(trend.icon)}></i> 
      <span
        style={{
            float:'right',
            borderRadius: '40px',
            padding: '1px 30px ',
            backgroundColor: trend.time === 'online' ? '#10C4694D' : '#FF57334D',
          color: trend.time === 'online' ? '#10C469' : '#FF5733',
         
        }}
      >
        {trend.time}
      </span>
    </span>
  </p>
)}

</Row>
            </Card.Body>
        </Card>
    );
};

export default StatisticsWidget;
