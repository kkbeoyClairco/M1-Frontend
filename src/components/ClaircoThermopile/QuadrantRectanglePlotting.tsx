import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image, Circle, Line, Group, Rect } from 'react-konva';
import Konva from 'konva';
import { vgaCameradot3mpResolution } from 'appConstants/DeviceConstants';
import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';

interface QuadrantPlottingInterface {
    imageURL: string;
    selectedQuadrant: number | null;
    changeZonetFn: (zones: { name: string; points: PointInterface[] }[]) => void;
    scalingFactor: number;
    setSelectedQuadrants: React.Dispatch<React.SetStateAction<number | null>>;
    zonesList: { name: string; points: PointInterface[] }[];
}

interface PointInterface {
    x: number;
    y: number;
}
const QuadrantRectanglePlotting: React.FC<QuadrantPlottingInterface> = ({
    imageURL,
    changeZonetFn,
    scalingFactor,
    selectedQuadrant,
    setSelectedQuadrants,
    zonesList,
}) => {
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);
    // const [points, setPoints] = useState<PointInterface[]>([]);

    const [draggingEdge, setDraggingEdge] = useState<{ zone: number; edge: string } | null>(null);
    const [draggingZoneIndex, setDraggingZoneIndex] = useState<number | null>(null);
    const [drawingRect, setDrawingRect] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const handleZoneDragMove = (zoneIndex: number, e: any) => {
        toast.warning(draggingEdge);

        if (draggingEdge === null && draggingZoneIndex) return;
        const { x, y } = e.target.position();
        const zone = zonesList[zoneIndex];
        // Calculate new positions for all points
        const movedPoints = zone.points.map((pt) => ({
            x: pt.x + x,
            y: pt.y + y,
        }));

        // Check bounds for all points
        const outOfBounds = movedPoints.some(
            (pt) =>
                pt.x < 0 ||
                pt.x > vgaCameradot3mpResolution.width * scalingFactor ||
                pt.y < 0 ||
                pt.y > vgaCameradot3mpResolution.height * scalingFactor
        );
        console.log('Out of bound', outOfBounds);
        if (outOfBounds) {
            toast.warning('Oops! The entire zone must remain inside the image.');
            // Revert group position
            e.target.position({ x: 0, y: 0 });
            return;
        }

        const newZones = zonesList.map((z, i) => (i === zoneIndex ? { ...z, points: movedPoints } : z));
        changeZonetFn(newZones);
        e.target.position({ x: 0, y: 0 });
    };

    const handleStageMouseDown = (event: any) => {
        const target = event.target;
        const isStage = target === target.getStage();
        const isBackgroundImage = target.className === 'Image';

        if (isStage || isBackgroundImage) {
            if (!isDrawing) {
                const stage = target.getStage();
                const pointer = stage.getPointerPosition();
                if (!pointer) return;
                setDrawingRect({ x: pointer.x, y: pointer.y, width: 0, height: 0 });
                setIsDrawing(true);
            } else {
                // Finish drawing
                if (drawingRect && drawingRect.width !== 0 && drawingRect.height !== 0) {
                    const newZone = [
                        ...zonesList,
                        {
                            name: `Rectangle ${zonesList.length + 1}`,
                            points: [
                                { x: drawingRect.x, y: drawingRect.y },
                                { x: drawingRect.x + drawingRect.width, y: drawingRect.y },
                                { x: drawingRect.x + drawingRect.width, y: drawingRect.y + drawingRect.height },
                                { x: drawingRect.x, y: drawingRect.y + drawingRect.height },
                            ],
                        },
                    ];
                    changeZonetFn(newZone);
                }
                setDrawingRect(null);
                setIsDrawing(false);
            }
        }
    };
    const handleRectEdgeDrag = (zoneIndex: number, edge: 'left' | 'right' | 'top' | 'bottom', e: any) => {
        const zone = zonesList[zoneIndex];
        if (!zone) return;

        const pointer = e.target.getStage().getPointerPosition();
        if (!pointer) return;

        let [tl, tr, br, bl] = zone.points.map((pt) => ({ ...pt }));

        const minWidth = 10;
        const minHeight = 10;

        let valid = true;

        if (edge === 'right') {
            const newX = Math.max(pointer.x, tl.x + minWidth);
            if (pointer.x < tl.x + minWidth || pointer.x > vgaCameradot3mpResolution.width * scalingFactor) {
                valid = false;
            }
            tr.x = newX;
            br.x = newX;
        } else if (edge === 'left') {
            const newX = Math.min(pointer.x, tr.x - minWidth);
            if (pointer.x > tr.x - minWidth || pointer.x < 0) {
                valid = false;
            }
            tl.x = newX;
            bl.x = newX;
        } else if (edge === 'top') {
            const newY = Math.min(pointer.y, bl.y - minHeight);
            if (pointer.y > bl.y - minHeight || pointer.y < 0) {
                valid = false;
            }
            tl.y = newY;
            tr.y = newY;
        } else if (edge === 'bottom') {
            const newY = Math.max(pointer.y, tr.y + minHeight);
            if (pointer.y < tr.y + minHeight || pointer.y > vgaCameradot3mpResolution.height * scalingFactor) {
                valid = false;
            }
            br.y = newY;
            bl.y = newY;
        }

        // If not valid, reset the handle's position visually
        if (!valid) {
            toast.warning("Oops! Flipping the rectangle's sides is not allowed.");

            // Reset the handle's position to the current edge center

            if (edge === 'right') {
                e.target.x(tr.x);
                e.target.y((tr.y + br.y) / 2);
            } else if (edge === 'left') {
                e.target.x(tl.x);
                e.target.y((tl.y + bl.y) / 2);
            } else if (edge === 'top') {
                e.target.x((tl.x + tr.x) / 2);
                e.target.y(tl.y);
            } else if (edge === 'bottom') {
                e.target.x((bl.x + br.x) / 2);
                e.target.y(br.y);
            }
            return;
        }
        // Always keep order: [top-left, top-right, bottom-right, bottom-left]
        const updatedPoints = [tl, tr, br, bl];

        const newZones = zonesList.map((z, i) => (i === zoneIndex ? { ...z, points: updatedPoints } : z));
        changeZonetFn(newZones);
    };
    const handleStageMouseUp = (event: any) => {
        if (isDrawing && drawingRect && drawingRect.width !== 0 && drawingRect.height !== 0) {
            const newZone = [
                ...zonesList,
                {
                    name: `Rectangle ${zonesList.length + 1}`,
                    points: [
                        { x: drawingRect.x, y: drawingRect.y },
                        { x: drawingRect.x + drawingRect.width, y: drawingRect.y },
                        { x: drawingRect.x + drawingRect.width, y: drawingRect.y + drawingRect.height },
                        { x: drawingRect.x, y: drawingRect.y + drawingRect.height },
                    ],
                },
            ];
            changeZonetFn(newZone);
        }
        setDrawingRect(null);
        setIsDrawing(false);
    };

    const handleStageMouseMove = (event: any) => {
        console.log('Mouse Move');

        if (!isDrawing || !drawingRect) return;
        const stage = event.target.getStage();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        setDrawingRect({
            ...drawingRect,
            width: pointer.x - drawingRect.x,
            height: pointer.y - drawingRect.y,
        });
    };
    const handleSelection = async (index: number) => {
        if (setSelectedQuadrants) setSelectedQuadrants(index);
    };

    useEffect(
        function setRawImageEffect() {
            // const image = new window.Image();
            // image.src = imageURL;
            // image.onload = () => setRawImage(image);
            const img = new window.Image();
            img.src = `data:image/jpeg;base64,${imageURL}`;
            img.onload = () => setImage(img);
            // console.log('Image Width and height', img.src);
        },
        [imageURL]
    );

    return (
        <Card className="w-100 m-3 d-flex justify-content align-items-center">
            <Card.Body className="">
                <Stage
                    width={vgaCameradot3mpResolution.width * scalingFactor}
                    height={vgaCameradot3mpResolution.height * scalingFactor}
                    // onDblClick={handleClick}
                    onMouseDown={(e) => {
                        handleStageMouseDown(e);
                        e.cancelBubble = true;
                    }}
                    onMouseMove={handleStageMouseMove}
                    onMouseUp={handleStageMouseUp}>
                    <Layer>
                        {image && (
                            <Image
                                image={image}
                                width={vgaCameradot3mpResolution.width * scalingFactor}
                                height={vgaCameradot3mpResolution.height * scalingFactor}
                            />
                        )}
                        {drawingRect && (
                            <Rect
                                x={drawingRect.x}
                                y={drawingRect.y}
                                width={drawingRect.width}
                                height={drawingRect.height}
                                stroke="#007bff"
                                // dash={[4, 4]}
                                resizeEnabled
                                fill="rgba(0,123,255,0.1)"
                            />
                        )}
                        {zonesList?.map((zone, i) => (
                            <Group
                                key={i}
                                // onDragStart={() => setDraggingZoneIndex(i)}
                                // onDragEnd={(e) => {
                                //     e.cancelBubble = true;

                                //     setDraggingZoneIndex(null);
                                //     handleZoneDragMove(i, e);
                                // }}
                                draggable={
                                    false

                                    // draggingEdge === null
                                }
                                onClick={() => {
                                    handleSelection(i);
                                }}>
                                <Line
                                    resizeEnabled
                                    key={i}
                                    points={zone.points.flatMap((point) => [point.x, point.y])} // Flatten the points array into [x1, y1, x2, y2, ...]
                                    closed={true} // Close the shape to form a quadrilateral
                                    fill={selectedQuadrant === i ? 'rgba(0,123,255,0.2)' : 'rgba(0,0,10,0.2)'}
                                    stroke={selectedQuadrant === i ? '#007bff' : 'green'}
                                    strokeWidth={selectedQuadrant === i ? 3 : 1}
                                />
                                {/* {zone.points.map((point, idx) => (
                                        <Circle
                                            key={idx}
                                            x={point.x}
                                            y={point.y}
                                            radius={5}
                                            fill="yellow"
                                            draggable={false}
                                            // {draggingZoneIndex === null}
                                            // onDragStart={(e) => {
                                            //     setDraggingPoint({ zone: i, point: idx });
                                            //     e.cancelBubble = true;
                                            // }}
                                            // onDragEnd={(e) => {
                                            //     handleQuadEdgeDragMove(i, idx, e);
                                            //     setDraggingPoint(null);
                                            //     e.cancelBubble = true;
                                            // }}
                                        />
                                    ))} */}

                                {/* Edge handles for resizing rectangle */}
                                {/* Top edge */}
                                <Circle
                                    key="top-edge"
                                    x={(zone.points[0].x + zone.points[1].x) / 2}
                                    y={zone.points[0].y}
                                    radius={7}
                                    fill="orange"
                                    draggable
                                    onDragStart={() => setDraggingEdge({ zone: i, edge: 'top' })}
                                    onDragMove={(e) => {
                                        e.cancelBubble = true;
                                        handleRectEdgeDrag(i, 'top', e);
                                    }}
                                    onDragEnd={() => setDraggingEdge(null)}
                                />
                                {/* Right edge */}
                                <Circle
                                    key="right-edge"
                                    x={zone.points[1].x}
                                    y={(zone.points[1].y + zone.points[2].y) / 2}
                                    radius={7}
                                    fill="orange"
                                    draggable
                                    onDragStart={() => setDraggingEdge({ zone: i, edge: 'right' })}
                                    onDragMove={(e) => {
                                        e.cancelBubble = true;
                                        handleRectEdgeDrag(i, 'right', e);
                                    }}
                                    onDragEnd={() => setDraggingEdge(null)}
                                />
                                {/* Bottom edge */}
                                <Circle
                                    key="bottom-edge"
                                    x={(zone.points[2].x + zone.points[3].x) / 2}
                                    y={zone.points[2].y}
                                    radius={7}
                                    fill="orange"
                                    draggable
                                    onDragStart={() => setDraggingEdge({ zone: i, edge: 'bottom' })}
                                    onDragMove={(e) => {
                                        e.cancelBubble = true;
                                        handleRectEdgeDrag(i, 'bottom', e);
                                    }}
                                    onDragEnd={() => setDraggingEdge(null)}
                                />
                                {/* Left edge */}
                                <Circle
                                    key="left-edge"
                                    x={zone.points[0].x}
                                    y={(zone.points[0].y + zone.points[3].y) / 2}
                                    radius={7}
                                    fill="orange"
                                    draggable
                                    onDragStart={() => setDraggingEdge({ zone: i, edge: 'left' })}
                                    onDragMove={(e) => {
                                        e.cancelBubble = true;
                                        handleRectEdgeDrag(i, 'left', e);
                                    }}
                                    onDragEnd={() => setDraggingEdge(null)}
                                />
                            </Group>
                        ))}
                        {/* {points.map((point: { x: number | undefined; y: number | undefined }, index: number) => (
                                <Circle
                                    key={index}
                                    x={point.x}
                                    y={point.y}
                                    radius={9}
                                    fill="green"
                                    draggable
                                    onDragEnd={(e) => handleDragMove(index, e)}
                                />
                            ))} */}
                    </Layer>
                </Stage>{' '}
            </Card.Body>
        </Card>
    );
};

export default QuadrantRectanglePlotting;
