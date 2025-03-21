import { Card, Col, Nav, Tab } from "react-bootstrap";
import Occupancy from "../Occupancy/Index";
import OdorLevel from "../OdorLevel";
import TissueLevel from "../TissueLevel";
import SoapTrends from "../SoapDispenserLevel";


const WashroomTrends = ( props : any ) => {
    return (
        <>
        {/* <Col xs={12}> */}
                <Tab.Container defaultActiveKey="OCCUPANCY">
                    <Card>
                        <Nav variant="pills" justify className="bg-nav-pills">
                            <Nav.Item>
                                <Nav.Link eventKey="OCCUPANCY">
                                    <span className="d-none d-md-block" style={{cursor:'pointer'}}>Dustbin Level</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="ODOR LEVEL">
                                    <span className="d-none d-md-block" style={{cursor:'pointer'}}>Odor Level</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="TISSUE LEVEL">
                                    <span className="d-none d-md-block"style={{cursor:'pointer'}}>Tissue Paper Level</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="SOAP DISPENSER">
                                    <span className="d-none d-md-block"style={{cursor:'pointer'}}>Soap Dispenser Level</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card>
                    <Tab.Content>
                        <Tab.Pane eventKey="OCCUPANCY" id="OCCUPANCY">
                            <Occupancy />
                        </Tab.Pane>
                        <Tab.Pane eventKey="ODOR LEVEL" id="ODOR LEVEL">
                            <OdorLevel/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="TISSUE LEVEL" id="TISSUE LEVEL">
                            <TissueLevel/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="SOAP DISPENSER" id="SOAP DISPENSER">
                            <SoapTrends />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            {/* </Col> */}
        </>
    );
}

export default WashroomTrends;