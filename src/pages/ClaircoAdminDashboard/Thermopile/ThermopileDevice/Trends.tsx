import React from 'react';
import { Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';

import { Link, useLocation } from 'react-router-dom';

// WIP -Pending/Abandoned
interface GraphOptions {
    [key: string]: number;
}
interface TrendsInterface {
    graphOptions: GraphOptions;
    timePeriod: number;
}
const Trends: React.FC<TrendsInterface> = ({ graphOptions, timePeriod }) => {
    return (
        <></>
        // <Card className="shadow rounded-lg p-2 m-2">
        //     <Card.Body>
        //         <Tab.Container defaultActiveKey="1hr">
        //             <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
        //                 <div className="ChartHeading">
        //                     <h4 className="header-title">Occupancy Trends</h4>
        //                 </div>

        //                 <Nav as="ul" variant="pills" className=" p-1 rounded  ">
        //                     {Object.keys(graphOptions ?? {}).map((key: any) => {
        //                         return (
        //                             <Nav.Item as="li" key={key} className="flex-fill text-center">
        //                                 {' '}
        //                                 <Nav.Link
        //                                     as={Link}
        //                                     className="py-1"
        //                                     to="#"
        //                                     eventKey={graphOptions[key]}
        //                                     style={{
        //                                         background: timePeriod == graphOptions[key] ? '#00695C' : '#008675',

        //                                         borderRadius: '0px',
        //                                         color: timePeriod == graphOptions[key] ? '#FFFFFF' : '#000000',
        //                                     }}
        //                                     onClick={() => changeTimePeriod(graphOptions[key])}>
        //                                     {key}hr
        //                                 </Nav.Link>
        //                             </Nav.Item>
        //                         );
        //                     })}
        //                 </Nav>
        //             </div>
        //             <form
        //                 // style={{ display: 'flex', justifyContent: 'start', padding: '10px' }}
        //                 className="d-flex flex-column flex-md-row align-items-center p-2">
        //                 <label style={{ padding: '10px' }} htmlFor="">
        //                     From
        //                 </label>
        //                 <HyperDatepicker
        //                     value={startDate}
        //                     inputClass="form-control-light"
        //                     onChange={(date: any) => {
        //                         setStartDate(date);
        //                     }}
        //                 />
        //                 <label htmlFor="" style={{ padding: '10px', marginLeft: '50px' }}>
        //                     To
        //                 </label>
        //                 <HyperDatepicker
        //                     value={endDate}
        //                     inputClass="form-control-light"
        //                     onChange={(date: any) => {
        //                         setEndDate(date);
        //                     }}
        //                 />{' '}
        //                 <Button
        //                     className="ms-md-3 mt-2 mt-md-0"
        //                     style={{
        //                         // margin: '20px',
        //                         // marginTop: '10px',
        //                         background: '#008675',
        //                         // borderWidth: '0px',
        //                     }}
        //                     onClick={handleDatePick}>
        //                     Submit
        //                 </Button>{' '}
        //             </form>
        //             {/* Graph*/}
        //             <Row style={{ height: '600px' }}>
        //                 <Col md={12}>
        //                     <ReactEcharts
        //                         option={option}
        //                         style={{ height: '500px', width: '100%' }}
        //                         onEvents={{ click: handleChartClick }}
        //                     />
        //                 </Col>
        //             </Row>
        //         </Tab.Container>
        //     </Card.Body>
        // </Card>
    );
};

export default Trends;
