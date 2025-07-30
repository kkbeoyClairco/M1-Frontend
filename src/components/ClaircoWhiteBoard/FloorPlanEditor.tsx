import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { KonvaLayer } from './KonvaLayer';
import { KonvaErrorBoundary } from './KonvaErrorBoundary';

// Types for the system
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

interface FloorPlan {
    id: string;
    name: string;
    imageUrl: string;
    shapes: Shape[];
    metadata: {
        building: string;
        floor: string;
        createdAt: string;
        updatedAt: string;
    };
}

// Mock data for demonstration
const sampleFloorPlan: FloorPlan = {
    id: 'fp_001',
    name: 'Office Floor 1',
    imageUrl: 'https://via.placeholder.com/800x600/f0f0f0/999999?text=Floor+Plan+Image',
    shapes: [],
    metadata: {
        building: 'Main Building',
        floor: '1st Floor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
};

export const FloorPlanEditor: React.FC = () => {
    const [floorPlan, setFloorPlan] = useState<FloorPlan>(sampleFloorPlan);
    const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Handle shape changes from KonvaLayer
    const handleShapesChange = useCallback((shapes: Shape[]) => {
        setFloorPlan((prev) => ({
            ...prev,
            shapes,
            metadata: {
                ...prev.metadata,
                updatedAt: new Date().toISOString(),
            },
        }));
    }, []);

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
        const shape = floorPlan.shapes.find((s) => s.id === shapeId);
        setSelectedShape(shape || null);
    };

    // Update shape properties
    const updateShapeProperties = (updatedShape: Shape) => {
        const updatedShapes = floorPlan.shapes.map((shape) => (shape.id === updatedShape.id ? updatedShape : shape));

        setFloorPlan((prev) => ({
            ...prev,
            shapes: updatedShapes,
            metadata: {
                ...prev.metadata,
                updatedAt: new Date().toISOString(),
            },
        }));

        setSelectedShape(updatedShape);
    };

    return (
        <Container fluid className="floor-plan-editor-container">
            <Row className="h-100">
                {/* Main Canvas Area */}
                <Col lg={8} className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h3 className="mb-1">{floorPlan.name}</h3>
                            <small className="text-muted">
                                {floorPlan.metadata.building} - {floorPlan.metadata.floor}
                            </small>
                        </div>
                        <Button variant="success" onClick={saveFloorPlan} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Floor Plan'}
                        </Button>
                    </div>

                    <KonvaErrorBoundary>
                        <KonvaLayer
                            floorPlanImage={floorPlan.imageUrl}
                            onShapesChange={handleShapesChange}
                            initialShapes={floorPlan.shapes}
                        />
                    </KonvaErrorBoundary>
                </Col>

                {/* Properties Panel */}
                <Col lg={4} className="p-3 border-start">
                    <Card className="h-100">
                        <Card.Header>
                            <h5 className="mb-0">Shape Properties</h5>
                        </Card.Header>
                        <Card.Body>
                            {selectedShape ? (
                                <ShapePropertiesEditor shape={selectedShape} onUpdate={updateShapeProperties} />
                            ) : (
                                <div className="text-center text-muted py-5">
                                    <p>Select a shape to edit its properties</p>
                                </div>
                            )}

                            <hr />

                            <h6>Shapes List</h6>
                            <ListGroup variant="flush">
                                {floorPlan.shapes.map((shape) => (
                                    <ListGroup.Item
                                        key={shape.id}
                                        action
                                        onClick={() => handleShapeSelect(shape.id)}
                                        className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-medium">{shape.properties.name}</div>
                                            <small className="text-muted">Type: {shape.type}</small>
                                        </div>
                                        <Badge style={{ backgroundColor: shape.properties.color }}>&nbsp;</Badge>
                                    </ListGroup.Item>
                                ))}
                                {floorPlan.shapes.length === 0 && (
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

// Component for editing shape properties
interface ShapePropertiesEditorProps {
    shape: Shape;
    onUpdate: (shape: Shape) => void;
}

const ShapePropertiesEditor: React.FC<ShapePropertiesEditorProps> = ({ shape, onUpdate }) => {
    const handlePropertyChange = (key: keyof Shape['properties'], value: any) => {
        const updatedShape = {
            ...shape,
            properties: {
                ...shape.properties,
                [key]: value,
            },
        };
        onUpdate(updatedShape);
    };

    return (
        <div>
            <h6 className="mb-3">Editing: {shape.properties.name}</h6>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={shape.properties.name}
                        onChange={(e) => handlePropertyChange('name', e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                        type="color"
                        value={shape.properties.color}
                        onChange={(e) => handlePropertyChange('color', e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Stroke Width: {shape.properties.strokeWidth}px</Form.Label>
                    <Form.Range
                        min={1}
                        max={10}
                        value={shape.properties.strokeWidth}
                        onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value))}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Opacity: {Math.round(shape.properties.opacity * 100)}%</Form.Label>
                    <Form.Range
                        min={10}
                        max={100}
                        value={shape.properties.opacity * 100}
                        onChange={(e) => handlePropertyChange('opacity', parseInt(e.target.value) / 100)}
                    />
                </Form.Group>

                <div className="mt-4">
                    <h6>Shape Info</h6>
                    <small className="text-muted">
                        <div>Type: {shape.type}</div>
                        <div>ID: {shape.id}</div>
                        <div>Points: {shape.points.length}</div>
                    </small>
                </div>
            </Form>
        </div>
    );
};
