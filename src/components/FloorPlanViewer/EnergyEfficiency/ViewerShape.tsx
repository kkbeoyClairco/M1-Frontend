import React from 'react';
import { Rect, Circle, Line } from 'react-konva';
import Konva from 'konva';
import { Shape } from 'types/whiteBoard/shapes';
import { denormalizeShape } from 'utils/floorPlan/shapeTransform';
import { ShapeMetricData } from './types';

export interface ViewerShapeProps {
    shape: Shape;
    displayColor: string;
    sensorData: ShapeMetricData | null;
    stageWidth: number;
    stageHeight: number;
    isHovered: boolean;
    onClick?: (shapeId: string, shape: Shape, sensorData: ShapeMetricData | null) => void;
    onMouseEnter?: (shapeId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
    onMouseLeave?: (shapeId: string) => void;
}

/**
 * Read-only Konva shape rendered on top of the floor plan image.
 * Receives a pre-computed `displayColor` so color-mapping logic stays
 * outside the canvas layer. No drag, no Transformer, no drawing.
 */
export const ViewerShape: React.FC<ViewerShapeProps> = ({
    shape,
    displayColor,
    sensorData,
    stageWidth,
    stageHeight,
    isHovered,
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    const ds = denormalizeShape(shape, stageWidth, stageHeight);

    const fillColor = isHovered ? `${displayColor}cc` : `${displayColor}99`;
    const strokeColor = isHovered ? displayColor : `${displayColor}bb`;

    const commonProps = {
        id: shape.id,
        x: ds.x,
        y: ds.y,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: isHovered ? 3 : 2,
        opacity: shape.opacity ?? 0.85,
        shadowColor: isHovered ? displayColor : undefined,
        shadowBlur: isHovered ? 12 : 0,
        shadowOpacity: isHovered ? 0.55 : 0,
        listening: true,
        perfectDrawEnabled: false,
        onClick: () => onClick?.(shape.id, shape, sensorData),
        onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>) => onMouseEnter?.(shape.id, e),
        onMouseLeave: () => onMouseLeave?.(shape.id),
    };

    if (shape.type === 'rectangle') {
        return <Rect {...commonProps} width={ds.width ?? 0} height={ds.height ?? 0} />;
    }

    if (shape.type === 'circle') {
        return <Circle {...commonProps} radius={ds.radius ?? 0} />;
    }

    if (shape.type === 'polygon' && ds.points && ds.points.length > 0) {
        const flatPoints = ds.points.flatMap((p) => [p.x, p.y]);
        return <Line {...commonProps} points={flatPoints} closed tension={0} />;
    }

    return null;
};

export default ViewerShape;
