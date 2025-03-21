import { Card, Col, Row } from "react-bootstrap";
import StatisticsChartWidget3 from "./StatisticsChartWidget3";
import { useEffect, useState } from "react";
import { getDeskOccupency } from "helpers/api/services/analytics";

const Statistics = () => {        

    let CharWidgetObject = {
        stats: '' ,
        lastMonthData: '',
        currentMonthData: '',
        data : [0],
    } 

    const [deskoccupency, setDeskOccupency] = useState(CharWidgetObject);
    const getOccupencyData=async()=>{
        try{
           const response = await getDeskOccupency();
        //    setDeskOccupency(response);
   
        } 
           catch (e: any) {
               console.log(e.message);
           }
      
   }
    useEffect(() => {
        setDeskOccupency({
            stats: '8.254',
            lastMonthData: '781.12',
            currentMonthData: '781.12',
            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        });
      
    }, []);
    return (
        <>
            <Row>
                <Col xxl={3} md={6}>
                    <StatisticsChartWidget3
                        title="DESK OCCUPANCY PATTERN"
                        stats={`${deskoccupency.stats}%`} 
                        lastMonthData={`${deskoccupency.lastMonthData}%`} // Add the percentage symbol here
                        currentMonthData={`${deskoccupency.currentMonthData}%`} // Add the percentage symbol here
                        name="series-1"
                        colors={['#00C5DC']}
                        strokeWidth={2}
                        borderRadius={1}
                        data={[12, 14, 2, 47, 32, 44, 14, 55, 41, 69]}
                    />
                </Col>
                <Col xxl={3} md={6}>
                    <StatisticsChartWidget3
                        title="MEETING ROOM OCCUPANCY PATTERN"
                        stats={`${deskoccupency.stats}%`} // Add the percentage symbol here
                        lastMonthData={`${deskoccupency.lastMonthData}%`} // Add the percentage symbol here
                        currentMonthData={`${deskoccupency.currentMonthData}%`} 
                        name="series-1"
                        colors={['#00C5DC']}
                        strokeWidth={2}
                        borderRadius={1}
                        data={[12, 14, 2, 47, 32, 44, 14, 55, 41, 69]}
                    />
                </Col>
                <Col xxl={3} md={6}>
                    <StatisticsChartWidget3
                        title="POTENTIAL SAVINGS"
                        stats={`${deskoccupency.stats}$`} // Add the percentage symbol here
                        lastMonthData={`${deskoccupency.lastMonthData}$`} // Add the percentage symbol here
                        currentMonthData={`${deskoccupency.currentMonthData}$`} 
                        name="series-1"
                        colors={['#34BFA3']}
                        strokeWidth={2}
                        borderRadius={1}
                        data={[12, 14, 2, 47, 32, 44, 14, 55, 41, 69]}
                    />
                </Col>
                <Col xxl={3} md={6}>
                    <Card className="cta-box bg-warning text-white">
                        <Card.Body style={{ padding: "29px" }}>
                            <Row>
                                <Col md={9}>
                                    <div className="d-flex align-items-start align-items-center">
                                        <div className="w-100 overflow-hidden">
                                            <h2 className="mt-0">
                                                <i className="mdi mdi-bullhorn-outline"></i>
                                            </h2>
                                            <h5>
                                                Identified potential flexidesk convertable seats
                                            </h5>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <span className='chart' style={{ paddingBottom: "15px" }}>
                                    <span className='m-0' style={{ fontSize: "40px",}}>10</span>
                                    </span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="cta-box bg-info text-white">
                        <Card.Body style={{ padding: "29px" }}>
                            <Row>
                                <Col md={9}>
                                    <div className="d-flex align-items-start align-items-center">
                                        <div className="w-100 overflow-hidden">
                                            <h2 className="mt-0">
                                                <i className="mdi mdi-bullhorn-outline"></i>
                                            </h2>
                                            <h5>
                                                Identified potential underused Meeting Rooms
                                            </h5>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <span className='chart' style={{ paddingBottom: "15px" }}>
                                        <span className='m-0' style={{ fontSize: "40px" }}>10</span>
                                    </span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Statistics;
