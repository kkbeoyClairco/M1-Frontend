// // Types for Floor Plan Management System
// // This file defines the complete data structure for your IoT floor plan system
// import { Shape, Point } from 'types/whiteBoard/shapes';

// // export interface Point {
// //     x: number;
// //     y: number;
// // }

// // export interface Shape {
// //     id: string;
// //     type: 'rectangle' | 'circle' | 'polygon';
// //     points: Point[];
// //     properties: {
// //         name: string;
// //         color: string;
// //         strokeWidth: number;
// //         opacity: number;
// //         // IoT-specific properties
// //         sensorType?: 'temperature' | 'occupancy' | 'humidity' | 'air_quality' | 'motion';
// //         deviceId?: string;
// //         alertThresholds?: {
// //             min?: number;
// //             max?: number;
// //         };
// //         dataMapping?: {
// //             property: string; // e.g., 'temperature', 'count', 'humidity'
// //             unit: string; // e.g., '°C', 'people', '%'
// //         };
// //     };
// //     // Normalized coordinates for backend (0-1 scale)
// //     normalizedPoints?: Point[];
// // }

// export interface FloorPlan {
//     id: string;
//     name: string;
//     imageUrl: string;
//     originalImageDimensions: {
//         width: number;
//         height: number;
//     };
//     shapes: Shape[];
//     metadata: {
//         buildingId: string;
//         floorId: string;
//         createdAt: string;
//         updatedAt: string;
//         createdBy: string;
//         version: number;
//     };
// }

// export interface Building {
//     id: string;
//     name: string;
//     address: string;
//     floors: Floor[];
// }

// export interface Floor {
//     id: string;
//     name: string;
//     level: number;
//     floorPlan: FloorPlan | null;
// }

// // IoT Data Structures for Live Visualization
// export interface SensorReading {
//     deviceId: string;
//     timestamp: string;
//     value: number;
//     unit: string;
//     sensorType: 'temperature' | 'occupancy' | 'humidity' | 'air_quality' | 'motion';
//     status: 'online' | 'offline' | 'error';
// }

// export interface LiveData {
//     floorPlanId: string;
//     lastUpdated: string;
//     sensorReadings: SensorReading[];
// }

// // API Response Types
// export interface FloorPlanListResponse {
//     floorPlans: FloorPlan[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export interface SaveFloorPlanRequest {
//     floorPlan: Omit<FloorPlan, 'id' | 'metadata'>;
//     metadata: Pick<FloorPlan['metadata'], 'buildingId' | 'floorId'>;
// }

// export interface SaveFloorPlanResponse {
//     success: boolean;
//     floorPlan: FloorPlan;
//     message: string;
// }

// // Utility Types
// export type DrawingTool = 'select' | 'rectangle' | 'circle' | 'polygon';

// export interface VisualizationSettings {
//     showGrid: boolean;
//     snapToGrid: boolean;
//     gridSize: number;
//     showLabels: boolean;
//     showAlerts: boolean;
//     refreshInterval: number; // seconds
// }

// // Data transformation utilities
// export class FloorPlanUtils {
//     /**
//      * Convert canvas coordinates to normalized coordinates (0-1)
//      */
//     static normalizePoints(points: Point[], imageWidth: number, imageHeight: number): Point[] {
//         return points.map((point) => ({
//             x: point.x / imageWidth,
//             y: point.y / imageHeight,
//         }));
//     }

//     /**
//      * Convert normalized coordinates back to canvas coordinates
//      */
//     static denormalizePoints(normalizedPoints: Point[], imageWidth: number, imageHeight: number): Point[] {
//         return normalizedPoints.map((point) => ({
//             x: point.x * imageWidth,
//             y: point.y * imageHeight,
//         }));
//     }

//     /**
//      * Validate shape data before saving
//      */
//     static validateShape(shape: Shape): boolean {
//         if (!shape.id || !shape.type || !shape.points || shape.points.length === 0) {
//             return false;
//         }

//         switch (shape.type) {
//             case 'rectangle':
//             case 'circle':
//                 return shape.points.length >= 2;
//             case 'polygon':
//                 return shape.points.length >= 3;
//             default:
//                 return false;
//         }
//     }

//     /**
//      * Calculate shape area (useful for sensor density calculations)
//      */
//     static calculateShapeArea(shape: Shape, imageWidth: number, imageHeight: number): number {
//         const { points, type } = shape;

//         if (type === 'rectangle' && points.length >= 2) {
//             const [start, end] = points;
//             return Math.abs(end.x - start.x) * Math.abs(end.y - start.y);
//         }

//         if (type === 'circle' && points.length >= 2) {
//             const [center, edge] = points;
//             const radius = Math.sqrt(Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2));
//             return Math.PI * radius * radius;
//         }

//         if (type === 'polygon' && points.length >= 3) {
//             // Shoelace formula for polygon area
//             let area = 0;
//             for (let i = 0; i < points.length; i++) {
//                 const j = (i + 1) % points.length;
//                 area += points[i].x * points[j].y;
//                 area -= points[j].x * points[i].y;
//             }
//             return Math.abs(area) / 2;
//         }

//         return 0;
//     }
// }

// // API Service Interface
// export interface FloorPlanAPI {
//     // Floor Plan Management
//     getFloorPlans(buildingId: string, floorId?: string): Promise<FloorPlanListResponse>;
//     getFloorPlan(id: string): Promise<FloorPlan>;
//     saveFloorPlan(request: SaveFloorPlanRequest): Promise<SaveFloorPlanResponse>;
//     deleteFloorPlan(id: string): Promise<{ success: boolean }>;

//     // Live Data
//     getLiveData(floorPlanId: string): Promise<LiveData>;
//     subscribeLiveData(floorPlanId: string, callback: (data: LiveData) => void): () => void;

//     // File Upload
//     uploadFloorPlanImage(file: File): Promise<{ imageUrl: string; dimensions: { width: number; height: number } }>;
// }

// // Redux State Structure (if using Redux)
// export interface FloorPlanState {
//     currentFloorPlan: FloorPlan | null;
//     floorPlans: FloorPlan[];
//     liveData: LiveData | null;
//     visualizationSettings: VisualizationSettings;
//     isLoading: boolean;
//     error: string | null;
// }

// // WebSocket Message Types for Real-time Updates
// export interface WebSocketMessage {
//     type: 'SENSOR_UPDATE' | 'FLOOR_PLAN_UPDATED' | 'DEVICE_STATUS_CHANGE';
//     payload: any;
//     timestamp: string;
// }

// export interface SensorUpdateMessage extends WebSocketMessage {
//     type: 'SENSOR_UPDATE';
//     payload: {
//         floorPlanId: string;
//         sensorReading: SensorReading;
//     };
// }

// export interface FloorPlanUpdatedMessage extends WebSocketMessage {
//     type: 'FLOOR_PLAN_UPDATED';
//     payload: {
//         floorPlanId: string;
//         updatedBy: string;
//     };
// }
export {};
