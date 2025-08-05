import { Container, Row, Col, Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { updateShape } from 'redux/floorPlan/floorPlanSlice';
import { useAppDispatch } from 'redux/hooks';
// import { Shape } from './types';s
import { Shape } from 'types/whiteBoard/shapes';
import { roundToOneDecimal } from 'utils/maths';
// Component for editing shape properties
interface ShapePropertiesEditorProps {
    shape?: Shape | null;
    onUpdate: (key: keyof Shape, value: any) => void;
}

const ShapePropertiesEditor: React.FC<ShapePropertiesEditorProps> = ({ shape, onUpdate }) => {
    const dispatch = useAppDispatch();
    // const handlePropertyChange =

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Zone Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={shape?.name ?? ''}
                        onChange={(e) => {
                            e.preventDefault();
                            onUpdate('name', e.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Device Type</Form.Label>
                    <Form.Control
                        disabled
                        type="text"
                        value={shape?.sensorType ?? ''}
                        // onChange={(e) => handlePropertyChange('name', e.target.value)}
                    />
                </Form.Group>

                <div className="mt-4">
                    <h6>Shape Info</h6>
                    <small className="text-muted">
                        <div>Type: {shape?.type ?? ''}</div>
                        <div>ID: {shape?.id ?? ''}</div>
                        <div>
                            Points: X-{shape?.x ? roundToOneDecimal(shape?.x) : 'n/a'}, y-{' '}
                            {shape?.y ? roundToOneDecimal(shape?.y) : 'n/a'}
                        </div>
                    </small>
                </div>
            </Form>
        </div>
    );
};
export default ShapePropertiesEditor;
