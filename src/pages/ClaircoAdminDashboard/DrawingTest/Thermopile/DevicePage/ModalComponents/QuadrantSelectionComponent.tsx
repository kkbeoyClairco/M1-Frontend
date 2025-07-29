import { conforms } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Stage, Layer, Image, Circle } from 'react-konva';

interface QuadrantSelectiontInterface {
    imageURL: string;
}
const QuadrantSelectionComponent: React.FC<QuadrantSelectiontInterface> = ({ imageURL }) => {
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
        newPoints[index] = { x: e.target.x(), y: e.target.y() };
        setPoints(newPoints);
    };

    React.useEffect(() => {
        const img = new window.Image();
        img.src = imageURL;
        img.onload = () => setImage(img);
    }, [imageURL]);
    // useEffect(() => {
    //     console.log('Points', points);
    // }, [points]);
    return (
        <>
            {' '}
            <Stage width={400} height={400} onClick={handleClick}>
                <Layer>
                    {image && <Image image={image} width={400} height={400} />}
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
            </Stage>
        </>
    );
};

export default QuadrantSelectionComponent;
