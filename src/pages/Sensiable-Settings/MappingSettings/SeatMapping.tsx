import { Card, Nav, Tab } from 'react-bootstrap';
import SensorPlacement from './SensorPlacement';

const SeatMapping = () => {
    return (
        <>
            <h4 className="header-title">SEAT MAPPING</h4>
            <Tab.Container defaultActiveKey="Sensor Creation">

                <Nav  variant="tabs" >
                    
                    <Nav.Item  className="nav-item">
                        <Nav.Link href="#" eventKey="Sensor Placement" >
                            Sensor Placement
                        </Nav.Link>
                    </Nav.Item>

                </Nav>

                <Tab.Content className='p-2'>
                    
                    <Tab.Pane eventKey="Sensor Placement">
                        <SensorPlacement />
                    </Tab.Pane>
                   
                </Tab.Content>

            </Tab.Container>
        </>
    );
};

export default SeatMapping;
