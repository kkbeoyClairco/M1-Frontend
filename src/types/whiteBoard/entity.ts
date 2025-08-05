import { Shape } from 'types/whiteBoard/shapes';

// Base device type structure (for API/persistence)
export interface DeviceTypeData {
    shapes: Shape[];
}
// Extended device type structure (for Redux state)
export interface DeviceTypeState extends DeviceTypeData {
    history: Shape[][];
    historyIndex: number;
}
// From Backend
export interface FloorPlan {
    id: string;
    name: string;
    imageUrl: string;
    originalImageDimensions: {
        width: number;
        height: number;
    };
    deviceTypes: {
        [key: string]: DeviceTypeData;
    };
    metadata?: {
        buildingId: string;
        floorId: string;
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        version: number;
    };
}

export interface FloorPlanState {
    deviceTypes: {
        [deviceType: string]: DeviceTypeState;
    };
    activeDeviceType: string;
    selectedShapeId: string | null;
    drawingTool: 'rectangle' | 'circle' | 'polygon' | null;
    isDrawing: boolean;
    floorPlanImage: string | null;
    scale: number;
    offset: { x: number; y: number };
}
