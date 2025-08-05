import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { KonvaLayer } from './KonvaLayer';
import { KonvaErrorBoundary } from './KonvaErrorBoundary';
import KonvaLayerRedux from './KonvaLayerRedux';
import { Shape, Point } from 'types/whiteBoard/shapes';
import ShapePropertiesEditor from './Modals/ShapePropertiesEditor';
import { FloorPlan } from 'types/whiteBoard/entity';
import { useAppSelector } from 'redux/hooks';
import { roundToOneDecimal } from 'utils/maths';

// Types for the system
// interface Point {
//     x: number;
//     y: number;
// }

// interface Shape {
//     id: string;
//     type: 'rectangle' | 'circle' | 'polygon';
//     points: Point[];
//     deviceType: string;

//     properties: {
//         name: string;
//         color: string;
//         strokeWidth: number;
//         opacity: number;
//     };
// }

// interface FloorPlan {
//     id: string;
//     name: string;
//     imageUrl: string;
//     deviceTypes: {
//         [key: string, shapes: Shape[]];
//     };
//     metadata: {
//         building: string;
//         floor: string;
//         createdAt: string;
//         updatedAt: string;
//     };
// }

// Mock data for demonstration
const sampleFloorPlan: FloorPlan = {
    id: 'fp_001',
    name: 'Office Floor 1',
    imageUrl: 'https://via.placeholder.com/800x600/f0f0f0/999999?text=Floor+Plan+Image',

    deviceTypes: {
        AHU: { shapes: [] },
    },
    originalImageDimensions: {
        width: 0,
        height: 0,
    },
};

export const FloorPlanEditor: React.FC = () => {
    const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
    const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const floorPlanData = useAppSelector((state) => state?.floorPlan);
    console.log('Floor Plan', floorPlanData);
    // Handle shape changes from KonvaLayer
    // const handleShapesChange = useCallback((shapes: Shape[]) => {
    //     setFloorPlan((prev) => ({
    //         ...prev,
    //         shapes,
    //         metadata: {
    //             ...prev.metadata,
    //             updatedAt: new Date().toISOString(),
    //         },
    //     }));
    // }, []);

    useEffect(() => {
        setFloorPlan(floorPlanData);
    }, [floorPlanData]);
    // Save floor plan to backend
    const saveFloorPlan = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Here you would call your actual API
            // await floorPlanAPI.save(floorPlan);

            console.log('Floor plan saved:', floorPlan);
            alert('Floor plan saved successfully!');
        } catch (error) {
            console.error('Failed to save floor plan:', error);
            alert('Failed to save floor plan');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle shape selection for property editing
    const handleShapeSelect = (shapeId: string) => {
        // const shape = floorPlan.shapes.find((s) => s.id === shapeId);
        // setSelectedShape(shape || null);
    };

    // Update shape properties
    // const updateShapeProperties = (updatedShape: Shape) => {
    //     const updatedShapes = floorPlan.deviceType.shapes.map((shape) =>
    //         shape.id === updatedShape.id ? updatedShape : shape
    //     );

    //     setFloorPlan((prev) => ({
    //         ...prev,
    //         shapes: updatedShapes,
    //         metadata: {
    //             ...prev.metadata,
    //             updatedAt: new Date().toISOString(),
    //         },
    //     }));

    //     setSelectedShape(updatedShape);
    // };

    return (
        <Container fluid className="floor-plan-editor-container">
            <Row className="h-100">
                {/* Main Canvas Area */}
                <Col lg={12} className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h3 className="mb-1">{floorPlan?.name}</h3>
                            <small className="text-muted">
                                {/* {floorPlan?.metadata?.building ?? ''} - {floorPlan.metadata.floor} */}
                            </small>
                        </div>
                        <Button variant="success" onClick={saveFloorPlan} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Floor Plan'}
                        </Button>
                    </div>

                    <KonvaErrorBoundary>
                        <KonvaLayerRedux
                            floorPlanImageUrl="https://res.cloudinary.com/dlulq6hny/image/upload/v1745837864/HCLlayout_4_k7jefr.svg"
                            // floorPlanImage={floorPlan.imageUrl}
                            // onShapesChange={handleShapesChange}
                            // initialShapes={floorPlan.shapes}
                        />
                    </KonvaErrorBoundary>
                </Col>

                {/* Properties Panel */}
                <Col lg={12} className="p-3 border-start">
                    <Card className="h-100">
                        <Card.Header>
                            <h5 className="mb-0">Zones List</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* <h6>Zones List</h6> */}
                            <ListGroup variant="flush">
                                {Object.entries(floorPlan?.deviceTypes ?? {}).flatMap(([deviceType, deviceTypeObj]) =>
                                    deviceTypeObj?.shapes?.map((shape: Shape) => (
                                        <ListGroup.Item
                                            key={shape?.id}
                                            action
                                            onClick={() => handleShapeSelect(shape.id)}
                                            className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-medium">{shape?.name}</div>{' '}
                                                <small className="text-muted">
                                                    Device Type: &nbsp;{deviceType ?? ''}
                                                </small>{' '}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <small className="text-muted">
                                                    Zone Shape Type: &nbsp;{shape.type}
                                                </small>{' '}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <small className="text-muted">
                                                    X: {shape?.x ? roundToOneDecimal(shape?.x) : 'N/A'}&nbsp;
                                                </small>
                                                <small className="text-muted">
                                                    Y: {shape?.y ? roundToOneDecimal(shape?.y) : 'N/A'}&nbsp;
                                                </small>
                                                {/* <small className="text-muted">Type: {shape.type}</small>
                                                <small className="text-muted">Type: {shape.type}</small>
                                                <small className="text-muted">Type: {shape.type}</small>
                                                <small className="text-muted">Type: {shape.type}</small> */}
                                            </div>
                                            {/* <Badge style={{ backgroundColor: shape?.properties?.color }}>&nbsp;</Badge> */}
                                        </ListGroup.Item>
                                    ))
                                )}
                                {Object.keys(floorPlan?.deviceTypes ?? {})?.length === 0 && (
                                    <ListGroup.Item className="text-muted text-center">
                                        No shapes created yet
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
