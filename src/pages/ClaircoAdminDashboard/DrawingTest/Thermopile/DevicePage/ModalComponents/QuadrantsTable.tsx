import { scalingFactorVGAdot3Camera } from 'appConstants/DeviceConstants';
import React from 'react';
import { Card, Row } from 'react-bootstrap';
import { roundToOneDecimal } from 'utils/maths';
interface QuadrantTableInterface {
    points: { x: number; y: number }[];
}
const QuadrantsTable: React.FC<QuadrantTableInterface> = ({ points }) => {
    return (
        <Row className=" m-2 p-3 d-flex justify-evenly" style={{ height: '16em' }}>
            {points.map((point, index) => {
                return (
                    // point?.x, point?.y
                    <p key={index} className="font-weight-bold" style={{ fontWeight: 'bold' }}>
                        Point {index + 1}: &nbsp; &nbsp; &nbsp; X :&nbsp;
                        {point?.x ? roundToOneDecimal(point?.x / scalingFactorVGAdot3Camera) : 'NA'} &nbsp; &nbsp;
                        &nbsp; Y :{point?.y ? roundToOneDecimal(point?.y / scalingFactorVGAdot3Camera) : 'NA'}
                    </p>
                );
            })}

            {points.length < 4 && <p>Please select four boundaries in the image to proceed</p>}
        </Row>
    );
};

export default QuadrantsTable;
