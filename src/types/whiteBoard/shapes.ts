export interface Point {
    x: number;
    y: number;
}

export interface Shape {
    // Core identification
    id: string;
    type: 'rectangle' | 'circle' | 'polygon';

    // Position and dimensions
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;

    // Points for polygons (use Point[] for better type safety)
    points?: Point[];

    // Visual properties (direct for Konva compatibility)
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    draggable?: boolean;

    // Business properties
    name?: string;
    deviceType: string;
    deviceId?: string;
    sensorType?: string;

    // Additional data
    metadata?: Record<string, any>;
}

// export interface Shape {
//     id: string;
//     type: 'rectangle' | 'circle' | 'polygon';
//     points: Point[];
//     deviceType: string;
//     name?: string;
//     sensorType?: string;
//     x: number;
//     y: number;
//     properties?: {
//         name: string;
//         color: string;
//         strokeWidth: number;
//         opacity: number;
//     };
// }

// export interface Shape {
//     id: string;
//     type: 'rectangle' | 'circle' | 'polygon';
//     x: number;
//     y: number;
//     width?: number;
//     height?: number;
//     radius?: number;
//     points?: number[];
//     fill?: string;
//     stroke?: string;
//     strokeWidth?: number;
//     opacity?: number;
//     draggable?: boolean;
//     name?: string;
//     deviceType: string;
//     // IoT-specific properties
//     deviceId?: string;
//     sensorType?: string;
//     metadata?: Record<string, any>;
// }
