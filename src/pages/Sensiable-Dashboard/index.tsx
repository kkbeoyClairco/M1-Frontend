import {Col, Row } from 'react-bootstrap';

import EnvironmentalTrends from './EnvironmentConditions/EnvironmentalTrends';

import Occupency from './OccupancyTrends/Occupency';
import Statistics from './OccupancyTrends/Statistics';

import { useState } from 'react';
import EnvironmentStatistics from './EnvironmentConditions/EnvironmentStatistics';
import WashroomStatistics from './WashRoom/Statistics';
import WashroomTrends from 'pages/Washroom-Dashboard/TrendsWashroom';
import WashroomGraph from './WashRoom/WashroomGraph';
// import WashroomStatistics from './WashRoom/WashroomStatistics';

const SensiableDashboard = () => {
  const [environmentconditionsData, setEnivronmentConditionsData] = useState<any>([]);

  const getEnvironmentConditionsData = async () => {
    try {
      const response = await getEnvironmentConditionsData();
      const data = response;
      setEnivronmentConditionsData(data);
    } catch (e: any) {
      console.log(e.message);
    }
  };
 
  return (
    <>
      <Row>
        <Col>
          <div className="page-title-box">
            <div className="page-title-right">
              <form className="d-flex">
             

              </form>
              
            </div>
            <h4 className="page-title">Global Dashboard</h4>
            <Row className="mb-3">
              <Col md={1}>
                <h4>Occupancy</h4>
              </Col>
              <Col md={11}>
                <hr />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {/* <div> */}
      <Row >
        <Col md={9} xs={12} sm={9}>
          <Occupency />
        </Col>
        <Col md={3} sm={3} xs={12} style={{height:'300px'}}>
          <Statistics />
        </Col>
      </Row>
  
      <Row className="mb-3">
        <Col md={2}>
          <h4>Environmental Conditions</h4>
        </Col>
        <Col md={10}>
          <hr />
        </Col>
      </Row>
      <Row>
      <Col md={3}>
          <Row>
          <Col className="">
          <EnvironmentStatistics/>
            </Col>
          </Row>
        </Col>
        <Col md={9}>
          <EnvironmentalTrends />
        </Col>
       
      </Row>
      <Row className="mb-3">
        <Col md={1}>
          <h4>Washroom</h4>
        </Col>
        <Col md={11}>
          <hr />
        </Col>
      </Row>
      <Row>
      <Col md={9}>
        <WashroomGraph/>
        </Col>
        <Col md={3} style={{height:'-15px'}}>
        <WashroomStatistics />
        </Col>
      </Row>
      <Row>
      </Row>
    </>
  );
};

export default SensiableDashboard;
