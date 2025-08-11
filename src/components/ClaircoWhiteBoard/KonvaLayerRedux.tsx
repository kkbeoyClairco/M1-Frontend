import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import { Layer, Rect, Stage, Transformer, Circle, Image, Line } from 'react-konva';
import Konva from 'konva';
import Select, { SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';
import { Shape } from 'types/whiteBoard/shapes';

// Redux Toolkit imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    addShape,
    updateShape,
    deleteShape,
    selectShape,
    setDrawingTool,
    setIsDrawing,
    setFloorPlanImage,
    setActiveDeviceType,
    undo,
    redo,
    clearShapes,
    selectShapes,
    selectSelectedShapeId,
    selectSelectedShape,
    selectDrawingTool,
    selectIsDrawing,
    selectFloorPlanImage,
    selectScale,
    selectOffset,
    selectCanUndo,
    selectCanRedo,
    selectActiveDeviceType,
    selectDeviceTypes,
    selectDeviceTypeShapeCount,
    // Shape,
} from '../../redux/floorPlan/floorPlanSlice';
import ZoneEditor from './Modals/ZoneEditor';

interface KonvaLayerReduxProps {
    floorPlanImageUrl?: string;
    className?: string;
    style?: React.CSSProperties;
}

const deviceTypes = [
    { label: 'VRV/VRF', value: 'VRV/VRF' },
    { label: 'AHU', value: 'AHU' },
    { label: 'Occupancy', value: 'Occupancy' },
];

interface ModalsType {
    zoneEditModal: boolean;
}
export const KonvaLayerRedux: React.FC<KonvaLayerReduxProps> = ({ floorPlanImageUrl, className = '', style = {} }) => {
    // Redux state and dispatch
    const dispatch = useAppDispatch();
    const shapes = useAppSelector(selectShapes); // Now gets shapes for active device type
    const selectedShapeId = useAppSelector(selectSelectedShapeId);
    const selectedShape = useAppSelector(selectSelectedShape);
    const drawingTool = useAppSelector(selectDrawingTool);
    const isDrawing = useAppSelector(selectIsDrawing);
    const floorPlanImage = useAppSelector(selectFloorPlanImage);
    const scale = useAppSelector(selectScale);
    const offset = useAppSelector(selectOffset);
    const canUndo = useAppSelector(selectCanUndo);
    const canRedo = useAppSelector(selectCanRedo);
    const activeDeviceType = useAppSelector(selectActiveDeviceType);
    // const availableDeviceTypes = useAppSelector(selectDeviceTypes);

    // Local state for UI-specific concerns
    const [currentShape, setCurrentShape] = useState<Partial<Shape> | null>(null);
    const [floorPlanImg, setFloorPlanImg] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [isModalOpen, setIsModalOpen] = useState<ModalsType>({ zoneEditModal: false });
    // Refs
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    // Handle device type selection - now updates Redux state
    const handleDeviceTypeSelection = (e: SingleValue<selectTagType>) => {
        if (e?.value) {
            dispatch(setActiveDeviceType(e.value));
        }
    };

    // Load floor plan image
    useEffect(() => {
        if (floorPlanImageUrl && floorPlanImageUrl !== floorPlanImage) {
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                setFloorPlanImg(img);
                dispatch(setFloorPlanImage(floorPlanImageUrl));

                // Auto-resize stage to image dimensions
                const newWidth = Math.min(img.width || 800, 1200);
                const newHeight = Math.min(img.height || 600, 800);
                setStageSize({
                    width: newWidth > 0 ? newWidth : 800,
                    height: newHeight > 0 ? newHeight : 600,
                });
            };
            img.onerror = () => {
                console.error('Failed to load floor plan image');
                setFloorPlanImg(null);
            };
            img.src = floorPlanImageUrl;
        }
    }, [floorPlanImageUrl, floorPlanImage, dispatch]);

    // Generate unique ID for shapes
    const generateId = () => `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mouse event handlers
    const handleStageMouseDown = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!drawingTool || drawingTool === null) {
                // Handle selection
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                    dispatch(selectShape(null));
                }
                return;
            }

            // Start drawing
            const stage = stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            if (drawingTool === 'polygon') {
                // Handle polygon drawing (multi-click)
                if (!isDrawing) {
                    // Start new polygon
                    dispatch(setIsDrawing(true));
                    const newShape: Partial<Shape> = {
                        id: generateId(),
                        type: 'polygon',
                        x: 0,
                        y: 0,
                        points: [{ x: pointer.x, y: pointer.y }],
                        fill: '#007bff',
                        stroke: '#0056b3',
                        strokeWidth: 2,
                        opacity: 0.7,
                        draggable: true,
                        name: `polygon ${shapes.length + 1}`,
                        deviceId: activeDeviceType || 'unknown',
                        sensorType: activeDeviceType || 'unknown',
                    };
                    setCurrentShape(newShape);
                } else {
                    // Add point to existing polygon
                    if (currentShape && currentShape.points) {
                        const newPoints = [...currentShape.points, { x: pointer.x, y: pointer.y }];
                        setCurrentShape((prev) => ({
                            ...prev,
                            points: newPoints,
                        }));
                    }
                }
            } else {
                dispatch(setIsDrawing(true));

                const newShape: Partial<Shape> = {
                    id: generateId(),
                    type: drawingTool as 'rectangle' | 'circle' | 'polygon',
                    x: pointer.x,
                    y: pointer.y,
                    width: 0,
                    height: 0,
                    fill: '#007bff',
                    stroke: '#0056b3',
                    strokeWidth: 2,
                    opacity: 0.7,
                    draggable: true,
                    name: `${drawingTool} ${shapes.length + 1}`,
                    deviceId: activeDeviceType || 'unknown',
                    sensorType: activeDeviceType || 'unknown',
                };

                setCurrentShape(newShape);
            }
        },
        [drawingTool, shapes.length, activeDeviceType, dispatch, isDrawing, currentShape]
    );

    const handleStageMouseMove = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>) => {
            console.log('Mouse move');
            if (!isDrawing || !currentShape || !drawingTool) return;

            const stage = stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            if (drawingTool === 'rectangle') {
                const width = pointer.x - currentShape.x!;
                const height = pointer.y - currentShape.y!;
                setCurrentShape((prev: any) => ({
                    ...prev,
                    width: Math.abs(width),
                    height: Math.abs(height),
                    x: width < 0 ? pointer.x : currentShape.x,
                    y: height < 0 ? pointer.y : currentShape.y,
                }));
            }
            // else if (drawingTool === 'polygon') {
            //     if (!isDrawing) {
            //         console.log('Polygon shape');
            //         // Start new polygon
            //         dispatch(setIsDrawing(true));
            //         const newShape: Partial<Shape> = {
            //             id: generateId(),
            //             type: 'polygon',
            //             x: 0,
            //             y: 0,
            //             points: [{ x: pointer.x, y: pointer.y }],
            //             fill: '#007bff',
            //             stroke: '#0056b3',
            //             strokeWidth: 2,
            //             opacity: 0.7,
            //             draggable: true,
            //             name: `polygon ${shapes.length + 1}`,
            //             deviceId: activeDeviceType || 'unknown',
            //             sensorType: activeDeviceType || 'unknown',
            //         };
            //         console.log('Polygon shape', newShape);
            //         setCurrentShape(newShape);
            //     }
            //     else {
            //         // Add point to existing polygon
            //         if (currentShape && currentShape.points) {
            //             const newPoints = [...currentShape.points, { x: pointer.x, y: pointer.y }];
            //             setCurrentShape((prev) => ({
            //                 ...prev,
            //                 points: newPoints,
            //             }));
            //         }
            //     }
            // }
            else if (drawingTool === 'circle') {
                const radius = Math.sqrt(
                    Math.pow(pointer.x - currentShape.x!, 2) + Math.pow(pointer.y - currentShape.y!, 2)
                );
                setCurrentShape((prev: any) => ({
                    ...prev,
                    radius,
                }));
            }
        },
        [isDrawing, currentShape, drawingTool]
    );

    const handleStageMouseUp = useCallback(() => {
        if (!isDrawing || !currentShape) return;

        // For polygons, don't finish on mouse up - wait for double-click
        if (currentShape.type === 'polygon') {
            return; // Let polygon continue until double-click
        }

        dispatch(setIsDrawing(false));

        // Only add valid shapes for rectangle and circle
        if (currentShape.type === 'rectangle' && currentShape.width! > 5 && currentShape.height! > 5) {
            dispatch(addShape(currentShape as Shape));
        } else if (currentShape.type === 'circle' && currentShape.radius! > 5) {
            dispatch(addShape(currentShape as Shape));
        }

        setCurrentShape(null);
    }, [isDrawing, currentShape, dispatch]);

    // Handle shape selection
    const handleShapeClick = useCallback(
        (shapeId: string) => {
            dispatch(selectShape(shapeId));
        },
        [dispatch]
    );

    // Handle shape drag
    const handleShapeDragEnd = useCallback(
        (shapeId: string, newAttrs: { x: number; y: number }) => {
            dispatch(updateShape({ id: shapeId, updates: newAttrs }));
        },
        [dispatch]
    );

    const createPolygonWithRelativePoints = useCallback((absolutePoints: { x: number; y: number }[]) => {
        if (absolutePoints.length === 0) return { x: 0, y: 0, points: [] };

        const firstPoint = absolutePoints[0];
        const relativePoints = absolutePoints.map((point) => ({
            x: point.x - firstPoint.x,
            y: point.y - firstPoint.y,
        }));

        return {
            x: firstPoint.x, // Shape origin
            y: firstPoint.y, // Shape origin
            points: relativePoints, // Relative to origin
        };
    }, []);
    // Handle shape transform
    const handleShapeTransform = useCallback(
        (shapeId: string, newAttrs: Partial<Shape>) => {
            dispatch(updateShape({ id: shapeId, updates: newAttrs }));
        },
        [dispatch]
    );
    // Add polygon completion handler
    const handleStageDoubleClick = useCallback(() => {
        if (
            isDrawing &&
            currentShape &&
            currentShape.type === 'polygon' &&
            currentShape.points &&
            currentShape.points.length >= 3
        ) {
            const relativePolygon = createPolygonWithRelativePoints(currentShape?.points);
            const finalShape: Shape = {
                ...currentShape,
                x: relativePolygon.x,
                y: relativePolygon.y,
                points: relativePolygon.points,
            } as Shape;
            dispatch(setIsDrawing(false));
            dispatch(addShape(finalShape));

            // dispatch(addShape(currentShape as Shape));
            setCurrentShape(null);
        }
    }, [isDrawing, currentShape, dispatch, createPolygonWithRelativePoints]); // Helper function to create polygon with relative points

    // Update transformer when selection changes

    useEffect(() => {
        const transformer = transformerRef.current;
        const stage = stageRef.current;

        if (!transformer || !stage) return;

        if (selectedShapeId) {
            const selectedNode = stage.findOne(`#${selectedShapeId}`);
            const selectedShapeData = shapes.find((s) => s.id === selectedShapeId);

            if (selectedNode && selectedShapeData?.type !== 'polygon') {
                transformer.nodes([selectedNode]);
                transformer.getLayer()?.batchDraw();
            }
        } else {
            transformer.nodes([]);
            transformer.getLayer()?.batchDraw();
        }
    }, [selectedShapeId]);

    const handleShapeDoubleClick = useCallback(() => {
        try {
            console.log('Double CLicked');
            setIsModalOpen({ zoneEditModal: true });
        } catch (error) {
            console.log(error);
        }
    }, []);
    // Render individual shape
    const renderShape = (shape: Shape) => {
        const isSelected = selectedShapeId === shape.id;

        const commonProps = {
            id: shape.id,
            key: shape.id,
            x: shape.x,
            y: shape.y,
            // fill: shape.fill,
            // stroke: isSelected ? '#ff6b6b' : shape.stroke,
            fill: isSelected ? `${shape.fill}CC` : shape.fill, // Add transparency suffix
            stroke: isSelected ? '#ff6b6b' : shape.stroke,
            strokeWidth: isSelected ? 4 : shape.strokeWidth,
            opacity: isSelected ? 0.9 : shape.opacity,
            shadowColor: isSelected ? '#ff6b6b' : undefined,
            shadowBlur: isSelected ? 10 : 0,
            shadowOpacity: isSelected ? 0.6 : 0,
            // strokeWidth: shape.strokeWidth,
            // opacity: shape.opacity,
            draggable: shape.draggable,
            onDblClick: () => handleShapeDoubleClick(),
            onClick: () => handleShapeClick(shape.id),
            onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                handleShapeDragEnd(shape.id, { x: e.target.x(), y: e.target.y() });
            },
            onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.scaleX(1);
                node.scaleY(1);

                handleShapeTransform(shape.id, {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(5, node.height() * scaleY),
                });
            },
        };

        if (shape.type === 'rectangle') {
            return <Rect {...commonProps} width={shape.width} height={shape.height} />;
        } else if (shape.type === 'circle') {
            return <Circle {...commonProps} radius={shape.radius} />;
        } else if (shape.type === 'polygon' && shape.points) {
            // Convert Point[] to flat number array for Konva
            const flatPoints = shape.points.flatMap((point) => [point.x, point.y]);

            return <Line {...commonProps} points={flatPoints} closed={true} tension={0} />;
        }
        return null;
    };

    // Tool button handlers
    const handleToolChange = useCallback(
        (tool: typeof drawingTool) => {
            dispatch(setDrawingTool(tool));
            dispatch(selectShape(null)); // Deselect when changing tools
        },
        [dispatch]
    );

    const handleUndo = useCallback(() => dispatch(undo()), [dispatch]);
    const handleRedo = useCallback(() => dispatch(redo()), [dispatch]);
    const handleClearAll = useCallback(() => {
        if (window.confirm('Are you sure you want to clear all shapes?')) {
            dispatch(clearShapes());
        }
    }, [dispatch]);

    const handleDeleteSelected = useCallback(() => {
        if (selectedShapeId) {
            dispatch(deleteShape(selectedShapeId));
        }
    }, [selectedShapeId, dispatch]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    handleUndo();
                } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    handleRedo();
                }
            } else if (e.key === 'Delete' && selectedShapeId) {
                handleDeleteSelected();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo, handleDeleteSelected, selectedShapeId]);

    return (
        <>
            <ZoneEditor
                show={isModalOpen?.zoneEditModal ?? false}
                onHide={() => {
                    setIsModalOpen({ zoneEditModal: false });
                }}
            />
            <Card className={`konva-drawing-card ${className}`} style={style}>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h5 className="mb-0">Floor Plan Editor - {activeDeviceType}</h5>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            {/* Device Type Selection */}
                            <Select
                                value={deviceTypes.find((dt) => dt.value === activeDeviceType)}
                                onChange={handleDeviceTypeSelection}
                                options={deviceTypes}
                                placeholder="Select Device Type"
                                className="device-type-select"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        minWidth: '150px',
                                    }),
                                }}
                            />

                            {/* Drawing Tools */}
                            <ButtonGroup>
                                <Button
                                    variant={!drawingTool ? 'primary' : 'outline-primary'}
                                    onClick={() => handleToolChange(null)}
                                    title="Select Tool">
                                    <i className="fas fa-mouse-pointer" />
                                    Select{' '}
                                </Button>
                                <Button
                                    variant={drawingTool === 'rectangle' ? 'primary' : 'outline-primary'}
                                    onClick={() => handleToolChange('rectangle')}
                                    title="Rectangle Tool">
                                    <i className="fas fa-square" />
                                    Rectangle{' '}
                                </Button>
                                <Button
                                    variant={drawingTool === 'circle' ? 'primary' : 'outline-primary'}
                                    onClick={() => handleToolChange('circle')}
                                    title="Circle Tool">
                                    <i className="fas fa-circle" />
                                    Circle{' '}
                                </Button>
                                <Button
                                    variant={drawingTool === 'polygon' ? 'primary' : 'outline-primary'}
                                    onClick={() => handleToolChange('polygon')}
                                    title="Polygon Tool">
                                    <i className="fas fa-draw-polygon" />
                                    Polygon{' '}
                                </Button>
                            </ButtonGroup>

                            {/* Action Buttons */}
                            <ButtonGroup>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleUndo}
                                    disabled={!canUndo}
                                    title="Undo (Ctrl+Z)">
                                    <i className="fas fa-undo" />
                                    Undo{' '}
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleRedo}
                                    disabled={!canRedo}
                                    title="Redo (Ctrl+Y)">
                                    Redo <i className="fas fa-redo" />
                                </Button>
                            </ButtonGroup>

                            <ButtonGroup>
                                <Button
                                    variant="outline-danger"
                                    onClick={handleDeleteSelected}
                                    disabled={!selectedShapeId}
                                    title="Delete Selected (Delete)">
                                    <i className="fas fa-trash" />
                                    Delete Selected{' '}
                                </Button>
                                <Button variant="outline-warning" onClick={handleClearAll} title="Clear All">
                                    <i className="fas fa-broom" />
                                    Clear All{' '}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Card.Header>

                <Card.Body className="p-0">
                    <div className="konva-container" style={{ overflow: 'auto', border: '1px solid #dee2e6' }}>
                        <Stage
                            ref={stageRef}
                            width={stageSize.width}
                            height={stageSize.height}
                            scaleX={scale}
                            scaleY={scale}
                            x={offset.x}
                            y={offset.y}
                            onMouseDown={handleStageMouseDown}
                            onMouseMove={handleStageMouseMove}
                            onMouseUp={handleStageMouseUp}
                            onDblClick={handleStageDoubleClick}
                            style={{ cursor: !drawingTool ? 'default' : 'crosshair' }}>
                            <Layer>
                                {/* Floor plan background image */}
                                {floorPlanImg && (
                                    <Image image={floorPlanImg} width={stageSize.width} height={stageSize.height} />
                                )}

                                {/* Render existing shapes */}
                                {shapes.map(renderShape)}

                                {/* Render current drawing shape */}
                                {isDrawing && currentShape && drawingTool && (
                                    <>
                                        {currentShape.type === 'rectangle' && (
                                            <Rect
                                                x={currentShape.x}
                                                y={currentShape.y}
                                                width={currentShape.width || 0}
                                                height={currentShape.height || 0}
                                                fill={currentShape.fill}
                                                stroke={currentShape.stroke}
                                                strokeWidth={currentShape.strokeWidth}
                                                opacity={currentShape.opacity}
                                            />
                                        )}
                                        {currentShape.type === 'circle' && (
                                            <Circle
                                                x={currentShape.x}
                                                y={currentShape.y}
                                                radius={currentShape.radius || 0}
                                                fill={currentShape.fill}
                                                stroke={currentShape.stroke}
                                                strokeWidth={currentShape.strokeWidth}
                                                opacity={currentShape.opacity}
                                            />
                                        )}
                                        {currentShape?.type === 'polygon' &&
                                            currentShape?.points &&
                                            currentShape?.points?.length > 0 && (
                                                <Line
                                                    points={currentShape.points.flatMap((point) => [point.x, point.y])}
                                                    stroke={currentShape.stroke}
                                                    strokeWidth={currentShape.strokeWidth}
                                                    fill={
                                                        currentShape.points.length > 2
                                                            ? currentShape.fill
                                                            : 'transparent'
                                                    }
                                                    opacity={currentShape.opacity}
                                                    closed={currentShape.points.length > 2}
                                                    tension={0}
                                                />
                                            )}
                                    </>
                                )}

                                {/* Transformer for selected shapes */}
                                <Transformer
                                    ref={transformerRef}
                                    rotateEnabled={false}
                                    borderEnabled={true}
                                    borderStroke="#0066cc"
                                    borderStrokeWidth={2}
                                    anchorStroke="#0066cc"
                                    anchorStrokeWidth={2}
                                    anchorSize={8}
                                />
                            </Layer>
                        </Stage>
                    </div>

                    {/* Status bar */}
                    <div className="p-2 bg-light border-top d-flex justify-content-between align-items-center text-sm">
                        <div>
                            <span className="me-3">
                                {activeDeviceType} Shapes: {shapes.length}
                            </span>
                            {selectedShape && (
                                <span className="me-3">Selected: {selectedShape.name || selectedShape.id}</span>
                            )}
                        </div>
                        <div>
                            <span className="me-2">Scale: {Math.round(scale * 100)}%</span>
                            <span>Tool: {drawingTool || 'select'}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default KonvaLayerRedux;
