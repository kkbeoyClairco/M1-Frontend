import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import React, { Fragment, LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Image, Circle, Line, Group, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { vgaCameradot3mpResolution } from 'appConstants/DeviceConstants';
import { toast } from 'sonner';
// import { v4 as uuidv4 } from 'uuid';
// import { raw_data, raw_data2 } from 'pages/ClaircoAdminDashboard/DrawingTest/Thermopile/DevicePage/constant';
import {
    formatTemperatureInput,
    formatTemperatureInput2,
    getTemperatureColorChroma,
} from 'pages/ClaircoAdminDashboard/DrawingTest/Thermopile/DevicePage/KonvaThermalImage/thermalImage';
import { getNormalizedRectangles } from 'utils/quadrantSelector';

interface QuadrantPlottingInterface {
    // imageURL: string;
    selectedQuadrant: number | null;
    changeZonetFn: (zones: { name: string; tTemp?: number | null; points: PointInterface[] }[]) => void;
    scalingFactor: number;
    setSelectedQuadrants: React.Dispatch<React.SetStateAction<number | null>>;
    zonesList: { name: string; points: PointInterface[]; tTemp?: number | null }[];
    temperatureInput: number[];
    sendDataFn: any;
}

interface PointInterface {
    x: number;
    y: number;
}

const QuadrantRectanglePlotting2: React.FC<QuadrantPlottingInterface> = ({
    // imageURL,
    changeZonetFn,
    scalingFactor,
    selectedQuadrant,
    setSelectedQuadrants,
    zonesList,
    sendDataFn,
    temperatureInput,
}) => {
    // console.log('render');
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);
    // const [points, setPoints] = useState<PointInterface[]>([]);
    const [stageSize, setStageSize] = useState({
        width: vgaCameradot3mpResolution.width * scalingFactor,
        height: vgaCameradot3mpResolution.height * scalingFactor,
    });
    const [thermalData, setThermalData] = useState<[number, number, number][]>([]);
    const [limits, setLimits] = useState({ min: 18, max: 40 });

    // const [draggingEdge, setDraggingEdge] = useState<{ zone: number; edge: string } | null>(null);
    // const [draggingZoneIndex, setDraggingZoneIndex] = useState<number | null>(null);
    const [drawingRect, setDrawingRect] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const numRows = 32;
    const numCols = 32;
    const cellWidth = stageSize.width / numCols;
    const cellHeight = stageSize.height / numRows;

    const rectRefs = useRef<(Konva.Rect | null)[]>([]);
    const trRef = useRef<Konva.Transformer>(null);

    // Thermal Rect Component
    const thermalRects = useMemo(
        () =>
            thermalData.map(([x, y, temp], index) => (
                <Rect
                    listening={false}
                    key={index}
                    x={x * cellWidth}
                    y={y * cellHeight}
                    width={cellWidth}
                    height={cellHeight}
                    fill={getTemperatureColorChroma(temp, limits.min, limits.max)}
                    opacity={0.5}
                    draggable={true}
                />
            )),
        [thermalData, cellWidth, cellHeight, limits]
    );

    const handleStageMouseDown = useCallback(
        (event: any) => {
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
                                name: `Zone ${zonesList.length + 1}`,
                                tTemp: 5,
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
        },
        [changeZonetFn, drawingRect, isDrawing, zonesList]
    );

    const handleStageMouseUp = useCallback(
        (event: any) => {
            if (isDrawing && drawingRect && drawingRect.width !== 0 && drawingRect.height !== 0) {
                const newZone = [
                    ...zonesList,
                    {
                        name: `Zone ${zonesList.length + 1}`,
                        tTemp: 5,
                        points: [
                            { x: drawingRect.x, y: drawingRect.y },
                            { x: drawingRect.x + drawingRect.width, y: drawingRect.y },
                            { x: drawingRect.x + drawingRect.width, y: drawingRect.y + drawingRect.height },
                            { x: drawingRect.x, y: drawingRect.y + drawingRect.height },
                        ],
                    },
                ];
                changeZonetFn(newZone);
                // const normalizedCoOrdinates = [
                //     drawingRect.x,
                //     drawingRect.y,
                //     drawingRect.x + drawingRect.width,
                //     drawingRect.y + drawingRect.height,
                // ];

                const normalized = getNormalizedRectangles(newZone, scalingFactor);
                // console.log('Zone', normalized);
                sendDataFn({ type: 'quadrants', quadrants: normalized });
            }
            setDrawingRect(null);
            setIsDrawing(false);
        },
        [isDrawing, drawingRect, zonesList, changeZonetFn, scalingFactor, sendDataFn]
    );

    const handleStageMouseMove = useCallback(
        (event: any) => {
            if (!isDrawing || !drawingRect) return;
            const stage = event.target.getStage();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            setDrawingRect({
                ...drawingRect,
                width: pointer.x - drawingRect.x,
                height: pointer.y - drawingRect.y,
            });

            // event.rect.scaleX(1);
            // event.rect.scaleY(1);
        },
        [drawingRect, isDrawing]
    );
    const handleSelection = useCallback(
        async (index: number) => {
            if (setSelectedQuadrants) setSelectedQuadrants(index);
        },
        [setSelectedQuadrants]
    );
    const updateZoneFromRect = useCallback(
        (zoneIndex: number, rect: Konva.Rect, zonesList: any[], changeZonetFn: Function) => {
            const x = rect.x();
            const y = rect.y();
            const width = rect.width() * rect.scaleX();
            const height = rect.height() * rect.scaleY();

            const newPoints = [
                { x: x, y: y }, // top-left
                { x: x + width, y: y }, // top-right
                { x: x + width, y: y + height }, // bottom-right
                { x: x, y: y + height }, // bottom-left
            ];
            // Bounds
            const maxX = vgaCameradot3mpResolution.width * scalingFactor;
            const maxY = vgaCameradot3mpResolution.height * scalingFactor;

            const outOfBounds = newPoints.some((pt) => pt.x < 0 || pt.x > maxX || pt.y < 0 || pt.y > maxY);
            if (outOfBounds) {
                // Reset rect to previous zone position/size
                const prevPoints = zonesList[zoneIndex].points;
                const prevX = Math.min(...prevPoints.map((p: { x: any }) => p.x));
                const prevY = Math.min(...prevPoints.map((p: { y: any }) => p.y));
                const prevWidth = Math.max(...prevPoints.map((p: { x: any }) => p.x)) - prevX;
                const prevHeight = Math.max(...prevPoints.map((p: { y: any }) => p.y)) - prevY;

                rect.x(prevX);
                rect.y(prevY);
                rect.width(prevWidth);
                rect.height(prevHeight);
                rect.scaleX(1);
                rect.scaleY(1);

                toast.warning('Zone cannot go out of bounds!');
                return;
            }

            rect.scaleX(1);
            rect.scaleY(1);
            const newZones = zonesList.map((z, i) => (i === zoneIndex ? { ...z, points: newPoints } : z));
            const normalized = getNormalizedRectangles(newZones, scalingFactor);
            // console.log('Zone', normalized);
            changeZonetFn(newZones);
            sendDataFn({ type: 'quadrants', quadrants: normalized });
        },
        [scalingFactor, sendDataFn]
    );
    // useEffect(
    //     function setRawImageEffect() {
    //         // const image = new window.Image();
    //         // image.src = imageURL;
    //         // image.onload = () => setRawImage(image);
    //         const img = new window.Image();
    //         img.src = `data:image/jpeg;base64,${imageURL}`;
    //         img.onload = () => setImage(img);
    //         // console.log('Image Width and height', img.src);
    //     },
    //     [imageURL]
    // );
    useEffect(
        function setTemperatureData() {
            // const temp = t;
            const formattedTemp = formatTemperatureInput2(temperatureInput);
            // console.log('Tempereature', formattedTemp, temperatureInput);
            setThermalData(formattedTemp);
        },
        [temperatureInput]
    );

    return (
        <Card className="w-100 m-3 mx-0 d-flex justify-content align-items-center">
            <Card.Body className="w-100">
                {/* <Card.Header>
                    <h4> Zone</h4>{' '}
                </Card.Header> */}
                <Stage
                    width={vgaCameradot3mpResolution.width * scalingFactor}
                    height={vgaCameradot3mpResolution.height * scalingFactor}
                    // onDblClick={handleClick}
                    onMouseDown={(e: any) => {
                        handleStageMouseDown(e);
                        e.cancelBubble = true;
                    }}
                    onMouseMove={handleStageMouseMove}
                    onMouseUp={handleStageMouseUp}>
                    <Layer>
                        {/* {showImage && image && (
                            <Image
                                image={image}
                                width={vgaCameradot3mpResolution.width * scalingFactor}
                                height={vgaCameradot3mpResolution.height * scalingFactor}
                            />
                        )} */}

                        {/* //Render when the temp array is of 32*32 size */}
                        {/* {thermalData.map(([x, y, temp], index) => (
                            <Rect
                                listening={false}
                                key={index}
                                x={x * cellWidth}
                                y={y * cellHeight}
                                width={cellWidth}
                                height={cellHeight}
                                fill={getTemperatureColorChroma(temp, limits.min, limits.max)}
                                opacity={0.9}
                                draggable={false} // usually not needed for heatmap
                            />
                        ))} */}

                        {thermalRects}

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
                            <Fragment>
                                <Rect
                                    ref={(node: any) => (rectRefs.current[i] = node)}
                                    draggable={selectedQuadrant === i}
                                    x={Math.min(...zone.points.map((p) => p.x))}
                                    y={Math.min(...zone.points.map((p) => p.y))}
                                    width={
                                        Math.max(...zone.points.map((p) => p.x)) -
                                        Math.min(...zone.points.map((p) => p.x))
                                    }
                                    height={
                                        Math.max(...zone.points.map((p) => p.y)) -
                                        Math.min(...zone.points.map((p) => p.y))
                                    }
                                    fill={selectedQuadrant === i ? 'rgba(0,123,255,0.2)' : 'rgba(0,0,10,0.2)'}
                                    stroke={selectedQuadrant === i ? '#007bff' : 'green'}
                                    strokeWidth={selectedQuadrant === i ? 3 : 1}
                                    onClick={(e: any) => {
                                        handleSelection(i);
                                        e.cancelBubble = true;
                                    }}
                                    rotation={0}
                                    rotationEnabled={false}
                                    onDragEnd={(e: any) => {
                                        updateZoneFromRect(i, e.target as Konva.Rect, zonesList, changeZonetFn);
                                    }}
                                    onTransformEnd={(e: any) => {
                                        const node = e.target;
                                        node.rotation(0); // Force rotation to 0
                                        updateZoneFromRect(i, e.target as Konva.Rect, zonesList, changeZonetFn);
                                    }}
                                />
                                {selectedQuadrant === i && (
                                    <Transformer
                                        ref={trRef}
                                        nodes={[rectRefs?.current[i]]}
                                        enabledAnchors={[
                                            'top-left',
                                            'top-right',
                                            'bottom-left',
                                            'bottom-right',
                                            'top-center',
                                            'bottom-center',
                                            'middle-left',
                                            'middle-right',
                                        ]}
                                        rotationEnabled={false}
                                        boundBoxFunc={(oldBox: any, newBox: { width: number; height: number }) => {
                                            // Optionally restrict min size, etc.
                                            if (newBox.width < 10 || newBox.height < 10) {
                                                return oldBox;
                                            }
                                            return newBox;
                                        }}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </Layer>
                </Stage>
            </Card.Body>
        </Card>
    );
};

export default QuadrantRectanglePlotting2;
