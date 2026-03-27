import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { KonvaErrorBoundary } from './KonvaErrorBoundary';
import KonvaLayerRedux from './KonvaLayerRedux';
import ShapesListModal from './Modals/ShapesListModal';
import { Shape } from 'types/whiteBoard/shapes';
import { FloorPlan } from 'types/whiteBoard/entity';
// import { useAppSelector } from 'redux/hooks';
import { roundToOneDecimal } from 'utils/maths';
import { saveFloorPlan, loadFloorPlan as loadFloorPlanAPI } from 'helpers/api/services/Clairco/floorPlan';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
    selectShapes,
    selectActiveDeviceType,
    selectImageDimensions,
    loadFloorPlan,
} from 'redux/floorPlan/floorPlanSlice';
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
// const sampleFloorPlan: FloorPlan = {
//     id: 'fp_001',
//     name: 'Office Floor 1',
//     imageUrl: 'https://via.placeholder.com/800x600/f0f0f0/999999?text=Floor+Plan+Image',

//     deviceTypes: {
//         AHU: { shapes: [] },
//     },
//     originalImageDimensions: {
//         width: 0,
//         height: 0,
//     },
// };
interface FloorPlanEditorInterface {
    siteData?: {
        customer?: Record<string, any> | null;
        building?: object | null;
        floor?: object | null;
    };
    floorPlanImageUrl?: string;
}
export const FloorPlanEditor: React.FC<FloorPlanEditorInterface> = ({ floorPlanImageUrl }) => {
    const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
    // const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showShapesModal, setShowShapesModal] = useState(false);
    const floorPlanData = useAppSelector((state) => state?.floorPlan);
    // console.log('Floor Plan', floorPlanData);
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
    const dispatch = useAppDispatch();
    const shapes = useAppSelector(selectShapes);
    const activeDeviceType = useAppSelector(selectActiveDeviceType);
    const imageDimensions = useAppSelector(selectImageDimensions);

    // Save floor plan to backend
    const handleSaveFloorPlan = async () => {
        try {
            setIsSaving(true);
            const floorId = 'floor-123'; // Get from props or context

            // Shapes will be automatically filtered (UI properties removed)
            const response = await saveFloorPlan(
                floorId,
                activeDeviceType,
                shapes, // Pass shapes with UI properties - they'll be stripped automatically
                floorPlanImageUrl ?? undefined,
                imageDimensions
            );

            console.log('Saved to DB (without UI props):', response);
            alert('Floor plan saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save floor plan');
        } finally {
            setIsSaving(false);
        }
    };

    // Load floor plan from backend
    const handleLoadFloorPlan = async () => {
        try {
            const floorId = 'floor-123'; // Get from props or context
            const deviceType = 'VRV/VRF';

            // Shapes will be automatically enriched with default UI properties
            const { shapes: loadedShapes, floorPlanImage, metadata } = await loadFloorPlanAPI(floorId, deviceType);

            console.log('Loaded from DB (with UI props added):', loadedShapes);

            // Dispatch to Redux
            dispatch(
                loadFloorPlan({
                    deviceType,
                    shapes: loadedShapes,
                    floorPlanImage,
                })
            );

            alert('Floor plan loaded successfully!');
        } catch (error) {
            console.error('Load failed:', error);
            alert('Failed to load floor plan');
        }
    };
    useEffect(() => {
        console.log('Floor plan data', floorPlanData);
        setFloorPlan(floorPlanData);
    }, [floorPlanData]);
    // Save floor plan to backend
    // const saveFloorPlan = async () => {
    //     setIsSaving(true);
    //     try {
    //         // Simulate API call
    //         await new Promise((resolve) => setTimeout(resolve, 1000));

    //         // Here you would call your actual API
    //         // await floorPlanAPI.save(floorPlan);

    //         console.log('Floor plan saved:', floorPlan);
    //         alert('Floor plan saved successfully!');
    //     } catch (error) {
    //         console.error('Failed to save floor plan:', error);
    //         alert('Failed to save floor plan');
    //     } finally {
    //         setIsSaving(false);
    //     }
    // };

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
                        {/* {typeof floorPlanImageUrl === 'string' && floorPlanImageUrl !== '' && (
                            <Button variant="success" onClick={handleSaveFloorPlan} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Floor Plan'}
                            </Button>
                        )} */}
                    </div>

                    <KonvaErrorBoundary>
                        {typeof floorPlanImageUrl === 'string' && floorPlanImageUrl !== '' ? (
                            <KonvaLayerRedux
                                handleSaveFloorPlan={handleSaveFloorPlan}
                                floorPlanImageUrl={floorPlanImageUrl}
                                // "https://res.cloudinary.com/dlulq6hny/image/upload/v1767861534/BCG_qvqk8x.png"
                                // "https://res.cloudinary.com/dlulq6hny/image/upload/v1745837864/HCLlayout_4_k7jefr.svg"
                                // floorPlanImage={floorPlan.imageUrl}
                                // onShapesChange={handleShapesChange}
                                // initialShapes={floorPlan.shapes}
                            />
                        ) : (
                            <p>Floor Image is not available. Please select a floor image</p>
                        )}
                    </KonvaErrorBoundary>
                </Col>

                {/* Properties Panel */}
                <Col lg={12} className="p-3 border-start">
                    <Card className="h-100">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Zones List</h5>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setShowShapesModal(true)}
                                disabled={Object.keys(floorPlan?.deviceTypes ?? {}).length === 0}>
                                <i className="mdi mdi-table-large me-1"></i>
                                View All in Table
                            </Button>
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
                                                    X:{' '}
                                                    {shape?.x != null
                                                        ? roundToOneDecimal(shape.x * imageDimensions.width)
                                                        : 'N/A'}
                                                    &nbsp;
                                                </small>
                                                <small className="text-muted">
                                                    Y:{' '}
                                                    {shape?.y != null
                                                        ? roundToOneDecimal(shape.y * imageDimensions.height)
                                                        : 'N/A'}
                                                    &nbsp;
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

            {/* Shapes List Modal */}
            <ShapesListModal show={showShapesModal} onClose={() => setShowShapesModal(false)} floorPlan={floorPlan} />
        </Container>
    );
};
