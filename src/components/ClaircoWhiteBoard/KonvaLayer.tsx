import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import { Layer, Rect, Stage, Transformer, Circle, Line, Image } from 'react-konva';
import Konva from 'konva';

// Types for drawing shapes
interface Point {
    x: number;
    y: number;
}

interface Shape {
    id: string;
    type: 'rectangle' | 'circle' | 'polygon';
    points: Point[];
    properties: {
        name: string;
        color: string;
        strokeWidth: number;
        opacity: number;
    };
}

type DrawingTool = 'select' | 'rectangle' | 'circle' | 'polygon';

interface KonvaLayerProps {
    floorPlanImage?: string;
    onShapesChange?: (shapes: Shape[]) => void;
    initialShapes?: Shape[];
}

export const KonvaLayer: React.FC<KonvaLayerProps> = ({ floorPlanImage, onShapesChange, initialShapes = [] }) => {
    // State management
    const [shapes, setShapes] = useState<Shape[]>(initialShapes);
    const [selectedTool, setSelectedTool] = useState<DrawingTool>('select');
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState<Partial<Shape> | null>(null);
    const [floorPlanImg, setFloorPlanImg] = useState<HTMLImageElement | null>(null);

    // Refs
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    // Stage dimensions - make responsive
    const [stageSize, setStageSize] = useState({
        width: 800,
        height: 600,
    });

    // Load floor plan image
    useEffect(() => {
        if (floorPlanImage) {
            const img = new window.Image();
            img.crossOrigin = 'anonymous'; // Handle CORS if needed
            img.onload = () => {
                setFloorPlanImg(img);
                // Auto-resize stage to image dimensions (with max limits)
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
            img.src = floorPlanImage;
        } else {
            setFloorPlanImg(null);
        }
    }, [floorPlanImage]);

    // Notify parent component of shape changes
    useEffect(() => {
        onShapesChange?.(shapes);
    }, [shapes, onShapesChange]);

    // Generate unique ID for shapes
    const generateId = () => `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mouse event handlers
    const handleStageMouseDown = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (selectedTool === 'select') {
                // Handle selection
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                    setSelectedShapeId(null);
                }
                return;
            }

            // Start drawing
            const stage = stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            setIsDrawing(true);

            const newShape: Partial<Shape> = {
                id: generateId(),
                type: selectedTool as 'rectangle' | 'circle' | 'polygon',
                points: [pointer],
                properties: {
                    name: `${selectedTool} ${shapes.length + 1}`,
                    color: '#007bff',
                    strokeWidth: 2,
                    opacity: 0.7,
                },
            };

            setCurrentShape(newShape);
        },
        [selectedTool, shapes.length]
    );

    const handleStageMouseMove = useCallback(
        (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!isDrawing || !currentShape || selectedTool === 'select') return;

            const stage = stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            if (selectedTool === 'rectangle' || selectedTool === 'circle') {
                // Update the second point for rectangle/circle
                setCurrentShape({
                    ...currentShape,
                    points: [currentShape.points![0], pointer],
                });
            } else if (selectedTool === 'polygon') {
                // For polygon, we'll handle this differently - add points on click
            }
        },
        [isDrawing, currentShape, selectedTool]
    );

    const handleStageMouseUp = useCallback(() => {
        if (!isDrawing || !currentShape) return;

        if (selectedTool === 'polygon') {
            // For polygon, don't finish on mouse up - finish on double click or specific action
            return;
        }

        // Finish drawing rectangle or circle
        if (currentShape.points && currentShape.points.length >= 2) {
            const newShape = currentShape as Shape;
            setShapes((prev) => [...prev, newShape]);
        }

        setIsDrawing(false);
        setCurrentShape(null);
        setSelectedTool('select');
    }, [isDrawing, currentShape, selectedTool]);

    // Handle shape selection
    const handleShapeClick = useCallback((shapeId: string) => {
        setSelectedShapeId(shapeId);
    }, []);

    // Delete selected shape
    const deleteSelectedShape = useCallback(() => {
        if (selectedShapeId) {
            setShapes((prev) => prev.filter((shape) => shape.id !== selectedShapeId));
            setSelectedShapeId(null);
        }
    }, [selectedShapeId]);

    // Render shapes
    const renderShape = (shape: Shape, index: number) => {
        const { points, properties } = shape;

        // Safety check for points
        if (!points || points.length === 0) return null;

        const commonProps = {
            key: `${shape.id}-${index}`,
            stroke: properties.color,
            strokeWidth: properties.strokeWidth,
            opacity: properties.opacity,
            onClick: () => handleShapeClick(shape.id),
            draggable: selectedTool === 'select',
        };

        if (shape.type === 'rectangle' && points.length >= 2) {
            const [start, end] = points;
            const width = Math.abs(end.x - start.x);
            const height = Math.abs(end.y - start.y);

            // Don't render shapes that are too small
            if (width < 1 || height < 1) return null;

            return (
                <Rect
                    {...commonProps}
                    x={Math.min(start.x, end.x)}
                    y={Math.min(start.y, end.y)}
                    width={width}
                    height={height}
                    fill={properties.color}
                    fillOpacity={0.3}
                />
            );
        }

        if (shape.type === 'circle' && points.length >= 2) {
            const [center, edge] = points;
            const radius = Math.sqrt(Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2));

            // Don't render circles that are too small
            if (radius < 1) return null;

            return (
                <Circle
                    {...commonProps}
                    x={center.x}
                    y={center.y}
                    radius={radius}
                    fill={properties.color}
                    fillOpacity={0.3}
                />
            );
        }

        if (shape.type === 'polygon' && points.length >= 3) {
            const flatPoints = points.flatMap((p) => [p.x, p.y]);
            return <Line {...commonProps} points={flatPoints} closed fill={properties.color} fillOpacity={0.3} />;
        }

        return null;
    };

    // Render current drawing shape
    const renderCurrentShape = () => {
        if (!isDrawing || !currentShape || !currentShape.points || currentShape.points.length === 0) return null;

        const tempShape = currentShape as Shape;
        return renderShape(tempShape, -1); // Use -1 as index for current shape
    };

    return (
        <div className="floor-plan-editor">
            {/* Drawing Tools */}
            <Card className="mb-3">
                <Card.Body className="py-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <ButtonGroup size="sm">
                            <Button
                                variant={selectedTool === 'select' ? 'primary' : 'outline-primary'}
                                onClick={() => setSelectedTool('select')}>
                                Select
                            </Button>
                            <Button
                                variant={selectedTool === 'rectangle' ? 'primary' : 'outline-primary'}
                                onClick={() => setSelectedTool('rectangle')}>
                                Rectangle
                            </Button>
                            <Button
                                variant={selectedTool === 'circle' ? 'primary' : 'outline-primary'}
                                onClick={() => setSelectedTool('circle')}>
                                Circle
                            </Button>
                            <Button
                                variant={selectedTool === 'polygon' ? 'primary' : 'outline-primary'}
                                onClick={() => setSelectedTool('polygon')}>
                                Polygon
                            </Button>
                        </ButtonGroup>

                        <div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={deleteSelectedShape}
                                disabled={!selectedShapeId}>
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Canvas */}
            <Card className="w-100">
                <Card.Body className="p-2">
                    <div style={{ overflow: 'auto', maxWidth: '100%' }}>
                        {stageSize.width > 0 && stageSize.height > 0 ? (
                            <Stage
                                ref={stageRef}
                                width={stageSize.width}
                                height={stageSize.height}
                                onMouseDown={handleStageMouseDown}
                                onMouseMove={handleStageMouseMove}
                                onMouseUp={handleStageMouseUp}
                                style={{
                                    border: '1px solid #ddd',
                                    cursor: selectedTool === 'select' ? 'default' : 'crosshair',
                                }}>
                                <Layer>
                                    {/* Floor Plan Background */}
                                    {floorPlanImg && (
                                        <Image
                                            image={floorPlanImg}
                                            width={stageSize.width}
                                            height={stageSize.height}
                                            opacity={0.8}
                                        />
                                    )}

                                    {/* Existing Shapes */}
                                    {shapes.map((shape, index) => renderShape(shape, index))}

                                    {/* Current Drawing Shape */}
                                    {renderCurrentShape()}
                                </Layer>

                                {/* Transformer for selected shapes */}
                                <Layer>
                                    <Transformer
                                        ref={transformerRef}
                                        boundBoxFunc={(oldBox, newBox) => {
                                            // Limit resize
                                            if (newBox.width < 5 || newBox.height < 5) {
                                                return oldBox;
                                            }
                                            return newBox;
                                        }}
                                    />
                                </Layer>
                            </Stage>
                        ) : (
                            <div
                                style={{
                                    width: 800,
                                    height: 600,
                                    border: '1px solid #ddd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f8f9fa',
                                }}>
                                <p className="text-muted">Loading canvas...</p>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};
