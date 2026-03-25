import { Shape } from 'types/whiteBoard/shapes';

/**
 * Shape data that should be persisted to the database
 * (excludes UI-only properties)
 */
export interface PersistedShape {
    id: string;
    type: 'rectangle' | 'circle' | 'polygon';
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: { x: number; y: number }[];
    name?: string;
    deviceType: string;
    deviceId?: string;
    sensorType?: string;
    metadata?: Record<string, any>;
}

/**
 * Default UI properties for shapes
 */
export const DEFAULT_SHAPE_UI = {
    fill: '#007bff',
    stroke: '#0056b3',
    strokeWidth: 2,
    opacity: 0.7,
    draggable: true,
} as const;

/**
 * Serialize shape for API/database (strip UI-only fields)
 * Removes: fill, stroke, strokeWidth, opacity, draggable
 */
export const serializeShapeForAPI = (shape: Shape): PersistedShape => {
    const { fill, stroke, strokeWidth, opacity, draggable, ...persistedData } = shape;

    return persistedData as PersistedShape;
};

/**
 * Serialize multiple shapes for API
 */
export const serializeShapesForAPI = (shapes: Shape[]): PersistedShape[] => {
    return shapes.map(serializeShapeForAPI);
};

/**
 * Deserialize shape from API (add default UI properties)
 * Adds: fill, stroke, strokeWidth, opacity, draggable
 */
export const deserializeShapeFromAPI = (persistedShape: PersistedShape): Shape => {
    return {
        ...persistedShape,
        ...DEFAULT_SHAPE_UI,
    };
};

/**
 * Deserialize multiple shapes from API
 */
export const deserializeShapesFromAPI = (persistedShapes: PersistedShape[]): Shape[] => {
    return persistedShapes.map(deserializeShapeFromAPI);
};

/**
 * Merge custom UI properties with defaults
 * Useful if you want to override specific UI properties per shape
 */
export const deserializeShapeWithCustomUI = (
    persistedShape: PersistedShape,
    customUI?: Partial<Pick<Shape, 'fill' | 'stroke' | 'strokeWidth' | 'opacity' | 'draggable'>>
): Shape => {
    return {
        ...persistedShape,
        ...DEFAULT_SHAPE_UI,
        ...customUI,
    };
};

/**
 * Interface for fake data shape format (from fakeData.ts)
 */
export interface FakeDataShape {
    id: string;
    type: 'rectangle' | 'circle' | 'polygon';
    deviceType: string;
    points: Array<{ x: number; y: number }>;
    properties: {
        name: string;
        color: string;
        strokeWidth: number;
        opacity: number;
    };
}

/**
 * Transform fake data format to Redux Shape format
 * Converts from points-based format to x/y/width/height format
 */
export const transformFakeDataToShape = (fakeShape: FakeDataShape): Shape => {
    const { id, type, deviceType, points, properties } = fakeShape;

    // Calculate position and dimensions from points
    const x = points[0].x;
    const y = points[0].y;
    const width = type === 'rectangle' ? Math.abs(points[1].x - points[0].x) : undefined;
    const height = type === 'rectangle' ? Math.abs(points[1].y - points[0].y) : undefined;

    // For circles, calculate radius
    const radius =
        type === 'circle'
            ? Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2))
            : undefined;

    return {
        id,
        type,
        deviceType,
        x,
        y,
        width,
        height,
        radius,
        points: type === 'polygon' ? points : undefined,
        name: properties.name,
        fill: properties.color,
        stroke: properties.color,
        strokeWidth: properties.strokeWidth,
        opacity: properties.opacity,
        draggable: true,
    };
};

/**
 * Transform array of fake data shapes to Redux Shapes
 */
export const transformFakeDataArrayToShapes = (fakeShapes: FakeDataShape[]): Shape[] => {
    return fakeShapes.map(transformFakeDataToShape);
};
