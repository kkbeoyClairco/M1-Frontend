import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import KonvaThermalImage from '../KonvaThermalImage/KonvaThermalImage';
// import { sampleTemp } from '../../sampleData';
import Slider from '../Slider/Slider';
import { raw_data } from '../constant';
// import KonvaThermalImage2 from '../KonvaThermalImage/KonvaThermalImage2';
// import { conforms } from 'lodash';

// const generateSampleThermalData = () => {
//     const data = [];

//     for (let x = 0; x < 24; x++) {
//         for (let y = 0; y < 24; y++) {
//             const temp = Math.floor(Math.random() * (40 - 16 + 1)) + 16; // Generates a random temp between 16 and 40
//             data.push([x, y, temp]);
//         }
//     }
//     return data;
// };
interface ThermalImageInterface {
    image: string;
}
const ThermalImage: React.FC<ThermalImageInterface> = ({ image }) => {
    const [data, setData] = useState<any>();
    const [isOverlay, setIsOverlay] = useState(false);
    const [opacity, setOpacity] = useState(0.5);
    const handleOverlaySelection = async () => {
        try {
            setIsOverlay((prev) => !prev);
        } catch (error) {}
    };

    const handleOpacityInput = async (value: number) => {
        requestAnimationFrame(() => {
            setOpacity(value / 100);
        });
    };
    // useEffect(() => {
    //     // const data = generateSampleThermalData();
    //     // setData(data);
    // }, []);

    return (
        <Card className="shadow-lg rounded-lg" style={{ height: '30em' }}>
            <Card.Body>
                <Row>
                    <Col xs={12} lg={4}></Col>
                    <Col xs={12} lg={8}>
                        <Row className="d-flex justify-content-end">
                            {' '}
                            <div className="form-check form-switch d-flex justify-content-end align-items-center">
                                <label className="form-check-label me-5 " htmlFor="overlapSwitch">
                                    Overlap
                                </label>
                                <input
                                    className="form-check-input me-1 "
                                    type="checkbox"
                                    role="switch"
                                    id="overlapSwitch"
                                    onChange={handleOverlaySelection}
                                />
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center " style={{ height: '100%', overflow: 'hidden' }}>
                    <KonvaThermalImage
                        overlayState={isOverlay}
                        temperatureArray={raw_data}
                        opacity={opacity}
                        image={image}
                    />
                    <Slider
                        value={opacity * 100}
                        setValue={handleOpacityInput}
                        min={0}
                        max={100}
                        parameterName={'Opacity'}
                    />
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ThermalImage;
