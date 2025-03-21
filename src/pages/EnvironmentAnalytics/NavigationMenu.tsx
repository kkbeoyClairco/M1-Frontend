import { Col, Row } from "react-bootstrap";
import Select from 'react-select';
import { Buildings , Floors , Parameters , Sensors } from "./data";
import React from 'react'

const NavigationMenu = () => {
    const [building, setBuilding] = React.useState('');
    const [floor, setFloor] = React.useState('');
    const [parameter, setParameter] = React.useState('');
    const [sensor, setSensor] = React.useState('');

    const handleBuildingChange = (e: any) => {
        setBuilding(e.value);
    }

    const handleFloorChange = (e: any) => {
        setFloor(e.value);
    }

    const handleParameterChange = (e: any) => {
        setParameter(e.value);
    }

    const handleSensorChange = (e: any) => {
        setSensor(e.value);
    }

    return(
        <>
            <Row>
                <Col lg={3} md={6} sm={6} xs={12}>
                    <div className="form-group mb-3">
                        <label className="form-label">Building</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Buildings}
                            placeholder="Select Building"
                            onChange={handleBuildingChange}
                        ></Select>
                    </div>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                    <div className="form-group mb-3">
                        <label className="form-label">Floor</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Floors}
                            placeholder="Select Floor"
                            onChange={handleFloorChange}
                        ></Select>
                    </div>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                    <div className="form-group mb-3">
                        <label className="form-label">Parameter</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Parameters}
                            placeholder="Select Parameter"
                            onChange={handleParameterChange}
                        ></Select>
                    </div>
                </Col>
                <Col lg={3} md={6} sm={6} xs={12}>
                    <div className="form-group mb-3">
                        <label className="form-label">Sensor</label>
                        <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            options={Sensors}
                            placeholder="Select Sensor"
                            onBlur={handleSensorChange}
                        ></Select>
                    </div>
                    </Col>
            </Row>
        </>
    );
};

export default NavigationMenu;
