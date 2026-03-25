import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { Shape } from 'types/whiteBoard/shapes';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { selectShape } from 'redux/floorPlan/floorPlanSlice';
import { roundToOneDecimal } from 'utils/maths';

interface ShapesListModalProps {
    show: boolean;
    onClose: () => void;
    floorPlan: any; // FloorPlan type
}

interface ShapeTableRow {
    id: string;
    name: string;
    deviceType: string;
    shapeType: string;
    x: number;
    y: number;
    fill?: string;
    shape: Shape;
}

interface Position {
    x: number;
    y: number;
}

const ShapesListModal: React.FC<ShapesListModalProps> = ({ show, onClose, floorPlan }) => {
    const dispatch = useAppDispatch();
    const selectedShapeId = useAppSelector((state) => state.floorPlan.selectedShapeId);

    // Draggable functionality
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset position when modal is opened
    useEffect(() => {
        if (show) {
            setPosition({ x: 0, y: 0 });
        }
    }, [show]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start dragging if clicking on the header
        const target = e.target as HTMLElement;
        if (target.closest('.modal-header') && !target.closest('.btn-close')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging, dragStart]);

    // Flatten all shapes from all device types into a table-friendly format
    const shapesData: ShapeTableRow[] = useMemo(() => {
        if (!floorPlan?.deviceTypes) return [];

        const rows: ShapeTableRow[] = [];

        Object.entries(floorPlan.deviceTypes).forEach(([deviceType, deviceTypeObj]: [string, any]) => {
            if (deviceTypeObj?.shapes && Array.isArray(deviceTypeObj.shapes)) {
                deviceTypeObj.shapes.forEach((shape: Shape) => {
                    rows.push({
                        id: shape.id,
                        name: shape.name || 'Unnamed Zone',
                        deviceType: deviceType,
                        shapeType: shape.type,
                        x: shape.x,
                        y: shape.y,
                        fill: shape.fill,
                        shape: shape,
                    });
                });
            }
        });

        return rows;
    }, [floorPlan]);

    const handleRowClick = (shapeData: ShapeTableRow) => {
        // Dispatch action to select the shape
        dispatch(selectShape(shapeData.id));

        // Optional: Close modal after selection
        // onClose();
    };

    const getShapeTypeIcon = (type: string) => {
        switch (type) {
            case 'rectangle':
                return '▭';
            case 'circle':
                return '●';
            case 'polygon':
                return '⬡';
            default:
                return '◆';
        }
    };

    return (
        <>
            <style>{`
                .shapes-modal-backdrop {
                    background-color: rgba(0, 0, 0, 0.3) !important;
                    backdrop-filter: blur(5px);
                }
                
                .draggable-modal .modal-content {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                }
                
                .draggable-modal .modal-header {
                    user-select: none;
                }
                
                .draggable-modal .modal-header:active {
                    cursor: grabbing !important;
                }
                
                .shapes-modal-table {
                    background: transparent;
                }
                
                .shapes-modal-table tbody tr {
                    border-color: rgba(0, 0, 0, 0.1);
                }
                
                .shapes-modal-table thead th {
                    border-color: rgba(0, 0, 0, 0.15);
                    color: #008675;
                    font-weight: 600;
                }
            `}</style>
            <Modal
                show={show}
                onHide={onClose}
                size="xl"
                centered
                backdrop={true}
                backdropClassName="shapes-modal-backdrop"
                dialogClassName="draggable-modal"
                style={{
                    pointerEvents: show ? 'auto' : 'none',
                }}>
                <div
                    ref={modalRef}
                    onMouseDown={handleMouseDown}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        cursor: isDragging ? 'grabbing' : 'default',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}>
                    <Modal.Header
                        closeButton
                        style={{
                            background: 'rgba(0, 134, 117, 0.85)',
                            backdropFilter: 'blur(10px)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'grab',
                        }}
                        className="text-white">
                        <Modal.Title className="d-flex align-items-center">
                            <i className="mdi mdi-drag-vertical me-2"></i>
                            Shapes List
                            <small className="ms-2 opacity-75" style={{ fontSize: '0.7em', fontWeight: 'normal' }}>
                                (Drag to move)
                            </small>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            maxHeight: '70vh',
                            overflowY: 'auto',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}>
                        {shapesData.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <p className="mb-0">No shapes added yet</p>
                                <small>Start drawing shapes on the floor plan</small>
                            </div>
                        ) : (
                            <Table striped bordered hover responsive className="shapes-modal-table">
                                <thead
                                    style={{
                                        background: 'rgba(0, 134, 117, 0.1)',
                                        backdropFilter: 'blur(5px)',
                                    }}>
                                    <tr>
                                        <th style={{ width: '5%' }}>#</th>
                                        <th style={{ width: '25%' }}>Zone Name</th>
                                        <th style={{ width: '20%' }}>Device Type</th>
                                        <th style={{ width: '15%' }}>Shape Type</th>
                                        <th style={{ width: '10%' }}>Position X</th>
                                        <th style={{ width: '10%' }}>Position Y</th>
                                        <th style={{ width: '10%' }}>Color</th>
                                        <th style={{ width: '5%' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shapesData.map((shapeData, index) => (
                                        <tr
                                            key={shapeData.id}
                                            onClick={() => handleRowClick(shapeData)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor:
                                                    selectedShapeId === shapeData.id
                                                        ? 'rgba(0, 134, 117, 0.15)'
                                                        : 'rgba(255, 255, 255, 0.5)',
                                                transition: 'all 0.2s',
                                                backdropFilter: 'blur(5px)',
                                            }}
                                            className={selectedShapeId === shapeData.id ? 'table-active' : ''}
                                            onMouseEnter={(e) => {
                                                if (selectedShapeId !== shapeData.id) {
                                                    e.currentTarget.style.backgroundColor = 'rgba(0, 134, 117, 0.08)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedShapeId !== shapeData.id) {
                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                                                }
                                            }}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{shapeData.name}</strong>
                                                <br />
                                                <small className="text-muted">ID: {shapeData.id.slice(0, 8)}...</small>
                                            </td>
                                            <td>
                                                <Badge bg="primary" className="me-1">
                                                    {shapeData.deviceType}
                                                </Badge>
                                            </td>
                                            <td>
                                                <span className="me-2">{getShapeTypeIcon(shapeData.shapeType)}</span>
                                                {shapeData.shapeType.charAt(0).toUpperCase() +
                                                    shapeData.shapeType.slice(1)}
                                            </td>
                                            <td>{roundToOneDecimal(shapeData.x)}</td>
                                            <td>{roundToOneDecimal(shapeData.y)}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            backgroundColor: shapeData.fill || '#cccccc',
                                                            border: '1px solid #999',
                                                            borderRadius: '3px',
                                                            marginRight: '8px',
                                                        }}
                                                    />
                                                    <small>{shapeData.fill || 'N/A'}</small>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {selectedShapeId === shapeData.id ? (
                                                    <Badge bg="success">Selected</Badge>
                                                ) : (
                                                    <Badge bg="secondary">-</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            background: 'rgba(248, 249, 250, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                        }}>
                        <div className="d-flex justify-content-between w-100 align-items-center">
                            <div className="text-muted">
                                <small>
                                    Total Shapes: <strong>{shapesData.length}</strong>
                                </small>
                            </div>
                            <div>
                                <Button variant="secondary" onClick={onClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

export default ShapesListModal;
