import SelectionTreemap from "./SelectionTreeMap";
import Statistics from "./Statistics";
import { Col, Row } from "react-bootstrap";
import WashroomAlerts from "./WashroomAlerts";
import WashroomTrends from "./TrendsWashroom";
// import WashroomTrends from "./TrendsWashrrom";

const WashroomDashboard=()=>{
    return(
<>
<Row>
<h4 className="page-title">Washroom Analytics</h4>

    <Col md={6}>
    <Statistics/> 
  
    </Col>

    <Col md={6}>
    <WashroomAlerts/> 
    </Col>
    </Row>
    <Row>
        <WashroomTrends/>
    </Row>

</>
    )
}; export default WashroomDashboard;