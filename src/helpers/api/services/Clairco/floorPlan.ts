import { APICore } from 'helpers/api/apiCore';
import { PersistedShape, serializeShapesForAPI, deserializeShapesFromAPI } from 'utils/floorPlan/shapeTransform';

const api = new APICore();

/**
 * Floor plan data structure for API
 */
export interface FloorPlanAPIPayload {
    floorId: string;
    deviceType: string;
    shapes: PersistedShape[];
    floorPlanImage?: string;
    metadata?: Record<string, any>;
}

export interface FloorPlanAPIResponse {
    floorId: string;
    deviceType: string;
    shapes: PersistedShape[];
    floorPlanImage?: string;
    metadata?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Save floor plan shapes to the backend
 * Automatically strips UI-only properties
 */
export const saveFloorPlan = async (
    floorId: string,
    deviceType: string,
    shapes: any[], // Can accept Shape[] with UI properties
    floorPlanImage?: string,
    metadata?: Record<string, any>
): Promise<FloorPlanAPIResponse> => {
    // Serialize shapes (remove UI properties)
    const persistedShapes = serializeShapesForAPI(shapes);

    const payload: FloorPlanAPIPayload = {
        floorId,
        deviceType,
        shapes: persistedShapes,
        floorPlanImage,
        metadata,
    };
    console.log('Floor Plan data str', payload);
    try {
        const response = await api.create('/api/floor-plans', payload);
        return response.data;
    } catch (error) {
        console.error('Failed to save floor plan:', error);
        throw error;
    }
};

/**
 * Update existing floor plan
 */
export const updateFloorPlan = async (
    floorId: string,
    deviceType: string,
    shapes: any[],
    floorPlanImage?: string,
    metadata?: Record<string, any>
): Promise<FloorPlanAPIResponse> => {
    const persistedShapes = serializeShapesForAPI(shapes);

    const payload: FloorPlanAPIPayload = {
        floorId,
        deviceType,
        shapes: persistedShapes,
        floorPlanImage,
        metadata,
    };

    try {
        const response = await api.update(`/api/floor-plans/${floorId}/${deviceType}`, payload);
        return response.data;
    } catch (error) {
        console.error('Failed to update floor plan:', error);
        throw error;
    }
};

/**
 * Load floor plan from backend
 * Automatically adds default UI properties to shapes
 */
export const loadFloorPlan = async (
    floorId: string,
    deviceType: string
): Promise<{ shapes: any[]; floorPlanImage?: string; metadata?: Record<string, any> }> => {
    try {
        const response = await api.get(`/api/floor-plans/${floorId}/${deviceType}`, null);
        const data: FloorPlanAPIResponse = response.data;

        // Deserialize shapes (add UI properties)
        const shapesWithUI = deserializeShapesFromAPI(data.shapes);

        return {
            shapes: shapesWithUI,
            floorPlanImage: data.floorPlanImage,
            metadata: data.metadata,
        };
    } catch (error) {
        console.error('Failed to load floor plan:', error);
        throw error;
    }
};

/**
 * Delete floor plan
 */
export const deleteFloorPlan = async (floorId: string, deviceType: string): Promise<void> => {
    try {
        await api.delete(`/api/floor-plans/${floorId}/${deviceType}`);
    } catch (error) {
        console.error('Failed to delete floor plan:', error);
        throw error;
    }
};

/**
 * Get all floor plans for a floor (all device types)
 */
export const getAllFloorPlans = async (floorId: string): Promise<FloorPlanAPIResponse[]> => {
    try {
        const response = await api.get(`/api/floor-plans/${floorId}`, null);
        return response.data;
    } catch (error) {
        console.error('Failed to get floor plans:', error);
        throw error;
    }
};
