import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ShapePropertiesEditor from './ShapePropertiesEditor';
import { selectSelectedShape, updateShape } from 'redux/floorPlan/floorPlanSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Shape } from 'types/whiteBoard/shapes';

interface ZoneEditorProps {
    show: boolean;
    onHide: () => void;
}

const ZoneEditor: React.FC<ZoneEditorProps> = ({ show, onHide }) => {
    const selectedShape = useAppSelector(selectSelectedShape);
    const dispatch = useAppDispatch();

    const [newShape, setNewshape] = useState<Shape | null | undefined>(null);
    // console.log('Selected Zone', selectedShape);
    const handleStateChanges = (key: keyof Shape, value: any) => {
        if (!selectedShape) return;
        const updatedShape = {
            ...selectedShape,
            deviceType: selectedShape?.deviceType ?? '',
            [key]: value,
        };

        // Ensure required Shape properties are present and fix points type
        setNewshape({
            ...updatedShape,
            points: Array.isArray(updatedShape.points)
                ? (updatedShape.points as any[]).map((pt) =>
                      typeof pt === 'object' && pt !== null && 'x' in pt && 'y' in pt
                          ? pt
                          : typeof pt === 'number'
                          ? { x: pt, y: 0 }
                          : pt
                  )
                : [],
        });

        // onUpdate(updatedShape);
    };
    const handleSave = () => {
        console.log('Saving info');
        if (!selectedShape || !newShape) return;
        dispatch(
            updateShape({
                id: selectedShape?.id,
                updates: {
                    ...newShape,
                    points: Array.isArray(newShape?.points)
                        ? (newShape.points as any[]).map((pt) =>
                              typeof pt === 'object' && pt !== null && 'x' in pt && 'y' in pt
                                  ? pt.x // or pt.y, or any transformation to number[]
                                  : typeof pt === 'number'
                                  ? pt
                                  : 0
                          )
                        : [],
                },
            })
        );
        // Handle save logic here

        onHide();
    };
    useEffect(() => {
        if (selectedShape) {
            setNewshape(selectedShape as unknown as Shape);
        } else {
            setNewshape(null);
        }
    }, [selectedShape]);
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Zone Editor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedShape ? (
                    <ShapePropertiesEditor shape={newShape as unknown as Shape} onUpdate={handleStateChanges} />
                ) : (
                    <p>No shape selected</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ZoneEditor;
