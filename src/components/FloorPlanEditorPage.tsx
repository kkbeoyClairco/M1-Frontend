import React from 'react';
import { Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import KonvaLayerRedux from './ClaircoWhiteBoard/KonvaLayerRedux';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
    selectShapes,
    selectSelectedShape,
    selectShape,
    deleteShape,
    updateShape,
    loadFloorPlan,
    resetFloorPlan,
} from '../redux/floorPlan/floorPlanSlice';

interface FloorPlanEditorPageProps {
    floorPlanImageUrl?: string;
}

export const FloorPlanEditorPage: React.FC<FloorPlanEditorPageProps> = ({
    floorPlanImageUrl = '/path/to/your/floor-plan.jpg', // Replace with actual path
}) => {
    const dispatch = useAppDispatch();
    const shapes = useAppSelector(selectShapes);
    const selectedShape = useAppSelector(selectSelectedShape);

    // Handle saving the floor plan data
    const handleSave = () => {
        const floorPlanData = {
            shapes,
            floorPlanImage: floorPlanImageUrl,
            savedAt: new Date().toISOString(),
        };

        // Save to localStorage for demo (replace with actual API call)
        localStorage.setItem('clairco-floor-plan', JSON.stringify(floorPlanData));

        // Or make API call:
        // await saveFloorPlanAPI(floorPlanData);

        alert('Floor plan saved successfully!');
        console.log('Saved floor plan data:', floorPlanData);
    };

    // Handle loading saved floor plan data
    const handleLoad = () => {
        try {
            const savedData = localStorage.getItem('clairco-floor-plan');
            if (savedData) {
                // const floorPlanData = JSON.parse(savedData);
                // dispatch(
                //     loadFloorPlan({
                //         shapes: floorPlanData.shapes || [],
                //         floorPlanImage: floorPlanData.floorPlanImage,
                //     })
                // );
                alert('Floor plan loaded successfully!');
            } else {
                alert('No saved floor plan found!');
            }
        } catch (error) {
            console.error('Error loading floor plan:', error);
            alert('Error loading floor plan!');
        }
    };

    // Handle shape property updates
    const handleShapePropertyChange = (property: string, value: any) => {
        if (selectedShape) {
            dispatch(
                updateShape({
                    id: selectedShape.id,
                    updates: { [property]: value },
                })
            );
        }
    };

    return (
        <div className="floor-plan-editor-page">
            <Row>
                <Col xs={12}>
                    {/* Main drawing area */}
                    <KonvaLayerRedux floorPlanImageUrl={floorPlanImageUrl} className="mb-3" />

                    {/* Action buttons */}
                    <Card>
                        <Card.Body>
                            <div className="d-flex gap-2 justify-content-center">
                                <Button variant="success" onClick={handleSave}>
                                    <i className="fas fa-save me-2" />
                                    Save Floor Plan
                                </Button>
                                <Button variant="info" onClick={handleLoad}>
                                    <i className="fas fa-folder-open me-2" />
                                    Load Floor Plan
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={() => {
                                        if (window.confirm('Reset everything? This cannot be undone.')) {
                                            dispatch(resetFloorPlan());
                                        }
                                    }}>
                                    <i className="fas fa-trash-alt me-2" />
                                    Reset All
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    {/* Shape list and properties panel */}
                    <Card className="mb-3">
                        <Card.Header>
                            <h6 className="mb-0">Shapes ({shapes.length})</h6>
                        </Card.Header>
                        <Card.Body className="p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {shapes.length === 0 ? (
                                <div className="text-center text-muted p-3">No shapes yet. Start drawing!</div>
                            ) : (
                                <ListGroup variant="flush">
                                    {shapes.map((shape) => (
                                        <ListGroup.Item
                                            key={shape.id}
                                            active={selectedShape?.id === shape.id}
                                            action
                                            onClick={() => dispatch(selectShape(shape.id))}
                                            className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold">
                                                    {shape.name || `${shape.type} ${shape.id.slice(-4)}`}
                                                </div>
                                                <small className="text-muted">
                                                    {shape.deviceId || shape.sensorType}
                                                </small>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Delete this shape?')) {
                                                            dispatch(deleteShape(shape.id));
                                                        }
                                                    }}>
                                                    <i className="fas fa-trash" />
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Properties panel for selected shape */}
                    {selectedShape && (
                        <Card>
                            <Card.Header>
                                <h6 className="mb-0">Shape Properties</h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedShape.name || ''}
                                        onChange={(e) => handleShapePropertyChange('name', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Device Type</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={selectedShape.deviceId || ''}
                                        onChange={(e) => handleShapePropertyChange('deviceId', e.target.value)}
                                    />
                                </div>

                                <Row>
                                    <Col>
                                        <div className="mb-3">
                                            <label className="form-label">X</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={Math.round(selectedShape.x)}
                                                onChange={(e) =>
                                                    handleShapePropertyChange('x', parseInt(e.target.value))
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="mb-3">
                                            <label className="form-label">Y</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={Math.round(selectedShape.y)}
                                                onChange={(e) =>
                                                    handleShapePropertyChange('y', parseInt(e.target.value))
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                {selectedShape.type === 'rectangle' && (
                                    <Row>
                                        <Col>
                                            <div className="mb-3">
                                                <label className="form-label">Width</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={Math.round(selectedShape.width || 0)}
                                                    onChange={(e) =>
                                                        handleShapePropertyChange('width', parseInt(e.target.value))
                                                    }
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="mb-3">
                                                <label className="form-label">Height</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={Math.round(selectedShape.height || 0)}
                                                    onChange={(e) =>
                                                        handleShapePropertyChange('height', parseInt(e.target.value))
                                                    }
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                )}

                                {selectedShape.type === 'circle' && (
                                    <div className="mb-3">
                                        <label className="form-label">Radius</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={Math.round(selectedShape.radius || 0)}
                                            onChange={(e) =>
                                                handleShapePropertyChange('radius', parseInt(e.target.value))
                                            }
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Fill Color</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color form-control-sm"
                                        value={selectedShape.fill || '#007bff'}
                                        onChange={(e) => handleShapePropertyChange('fill', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Opacity</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={selectedShape.opacity || 1}
                                        onChange={(e) =>
                                            handleShapePropertyChange('opacity', parseFloat(e.target.value))
                                        }
                                    />
                                    <small className="text-muted">
                                        {Math.round((selectedShape.opacity || 1) * 100)}%
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Instructions */}
                    <Card className="mt-3">
                        <Card.Header>
                            <h6 className="mb-0">Instructions</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled mb-0 small">
                                <li>• Select device type first</li>
                                <li>• Choose rectangle or circle tool</li>
                                <li>• Click and drag to draw shapes</li>
                                <li>• Use select tool to move/resize</li>
                                <li>• Ctrl+Z/Y for undo/redo</li>
                                <li>• Delete key to remove selected shape</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FloorPlanEditorPage;
