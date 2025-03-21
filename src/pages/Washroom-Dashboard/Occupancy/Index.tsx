

import react, { useState } from 'react'
import Building1 from './Building1';
import { Col, Row } from 'react-bootstrap';
import OccupancyTrends from './OccupancyTrends';
import DustbinIndicator from './DustbinIndicator';
// import Building2 from './Building2';
// import SelectParameters from './SelectParameters';

const Occupancy=()=>{
    const [chartData, setChartData] = useState({
        seriesData: [
          [120, 132, 101, 134, 90, 230, 210],
          [220, 182, 191, 234, 290, 330, 310],
          [150, 232, 201, 154, 190, 330, 410],
          [320, 332, 301, 334, 390, 330, 320],
          [820, 932, 901, 934, 1290, 1330, 1320],
        ],
      });
    
    
return(
    <>
    <Row>
        <Col md={5}>
        {/* <Col md={12}>
    <SelectParameters/>
    </Col> */}
    <Col md={12}>
    <Building1/>
    </Col>
    <Col md={12}>
    {/* <Building2/> */}
    </Col>
    </Col>
    <Col md={7}>
        <Col md={12}>   
            <DustbinIndicator/>
</Col>
<Col md={12} >   
<OccupancyTrends text="Dustbin Level" chartData={chartData} />
</Col>

    </Col>

    </Row>
  

    </>
);

};export default Occupancy