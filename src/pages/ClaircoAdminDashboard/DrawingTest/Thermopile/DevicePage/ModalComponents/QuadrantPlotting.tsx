import { Button, Col, Modal, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image, Circle, Line } from 'react-konva';
import Konva from 'konva';
import { vgaCameradot3mpResolution } from 'appConstants/DeviceConstants';

interface QuadrantPlottingInterface {
    imageURL: string;
    changePointFn: (points: { x: number; y: number }[]) => void;
    scalingFactor: number;
}
const QuadrantPlotting: React.FC<QuadrantPlottingInterface> = ({ imageURL, changePointFn, scalingFactor }) => {
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

    const handleClick = (event: { target: { getStage: () => any } }) => {
        const stage = event.target.getStage();
        const pointerPosition = stage.getPointerPosition();
        if (points.length > 3) return;
        setPoints([...points, { x: pointerPosition.x, y: pointerPosition.y }]);
    };
    const handleDragMove = (index: number, e: { target: { x: () => any; y: () => any } }) => {
        const newPoints = [...points];
        const newX = e.target.x();
        const newY = e.target.y();

        // Check if the new position is within bounds
        if (
            newX < 0 ||
            newX > vgaCameradot3mpResolution?.width * scalingFactor ||
            newY < 0 ||
            newY > vgaCameradot3mpResolution?.height * scalingFactor
        ) {
            console.log('Out of bounds, reverting to previous position');
            const target = e.target as Konva.Node; // Replace Konva.Node with the correct type
            target.x(points[index].x);
            target.y(points[index].y);
            // e.target.x(points[index].x); // Reset x position
            // e.target.y(points[index].y); // Reset y position
            return;
        }
        newPoints[index] = { x: e.target.x(), y: e.target.y() };
        // if (newPoints[index].x > 400 || newPoints[index].x<0> || newPoints[index].y) return;
        // console.log(newPoints[index]);
        setPoints(newPoints);
    };
    // const handleDragMove = (index: number, e: { target: { x: () => any; y: () => any } }) => {
    //     const newPoints = [...points];
    //     const newX = e.target.x();
    //     const newY = e.target.y();

    //     // Check if the new X position is out of bounds
    //     if (newX < 0 || newX > vgaCameradot3mpResolution?.width * scalingFactor) {
    //         console.log('X out of bounds, reverting to previous X position');
    //         const target = e.target as Konva.Node;
    //         target.x(points[index].x); // Reset X to the last valid position
    //         newPoints[index] = { x: points[index].x, y: newY }; // Save Y and last valid X
    //         setPoints(newPoints);
    //         return;
    //     }

    //     // Check if the new Y position is out of bounds
    //     if (newY < 0 || newY > vgaCameradot3mpResolution?.height * scalingFactor) {
    //         console.log('Y out of bounds, reverting to previous Y position');
    //         const target = e.target as Konva.Node;
    //         target.y(points[index].y); // Reset Y to the last valid position
    //         newPoints[index] = { x: newX, y: points[index].y }; // Save X and last valid Y
    //         setPoints(newPoints);
    //         return;
    //     }

    //     // If both X and Y are within bounds, update the point
    //     newPoints[index] = { x: newX, y: newY };
    //     setPoints(newPoints);
    // };
    const handleRefresh = async () => {
        try {
            setPoints(() => []);
        } catch (error) {}
    };

    useEffect(
        function setRawImageEffect() {
            // const image = new window.Image();
            // image.src = imageURL;
            // image.onload = () => setRawImage(image);
            const img = new window.Image();
            img.src = `data:image/jpeg;base64,${imageURL}`;
            img.onload = () => setImage(img);
            console.log('Image Width and height', img.src);
        },
        [imageURL]
    );

    // React.useEffect(() => {
    //     const img = new window.Image();
    //     img.src = imageURL;
    //     img.onload = () => setImage(img);
    // }, [imageURL]);
    useEffect(() => {
        // console.log('Points', points);
        changePointFn(points);
    }, [changePointFn, points]);
    return (
        <Row>
            <Stage
                width={vgaCameradot3mpResolution.width * scalingFactor}
                height={vgaCameradot3mpResolution.height * scalingFactor}
                onClick={handleClick}>
                <Layer>
                    {image && (
                        <Image
                            image={image}
                            width={vgaCameradot3mpResolution.width * scalingFactor}
                            height={vgaCameradot3mpResolution.height * scalingFactor}
                        />
                    )}
                    {points.length === 4 && (
                        <Line
                            points={points.flatMap((point) => [point.x, point.y])} // Flatten the points array into [x1, y1, x2, y2, ...]
                            closed={true} // Close the shape to form a quadrilateral
                            fill="rgba(0, 0, 10, 0.5)" // Optional: Add a semi-transparent fill color
                            stroke="green" // Outline color
                            strokeWidth={1} // Outline thickness
                        />
                    )}
                    {points.map((point: { x: number | undefined; y: number | undefined }, index: number) => (
                        <Circle
                            key={index}
                            x={point.x}
                            y={point.y}
                            radius={9}
                            fill="red"
                            draggable
                            onDragMove={(e) => handleDragMove(index, e)}
                        />
                    ))}
                </Layer>
            </Stage>{' '}
            <Row className="d-flex justify-content-start align-items-center mt-2">
                <Col xs={3}>
                    <Button className="bg-secondary" onClick={handleRefresh}>
                        Reset
                    </Button>
                </Col>
            </Row>
        </Row>
    );
};

export default QuadrantPlotting;
