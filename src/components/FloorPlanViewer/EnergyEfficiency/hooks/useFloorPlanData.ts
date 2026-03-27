import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shape } from 'types/whiteBoard/shapes';
import { deserializeShapesFromAPI, PersistedShape } from 'utils/floorPlan/shapeTransform';
import { normData1 } from 'components/ClaircoWhiteBoard/fakeData';

// ─── API response contracts ───────────────────────────────────────────────────

/** Raw shape as returned by GET /api/floor-plans/:id.
 *  Coordinates are already normalized [0–1] (matching the editor's save format). */
export interface ApiShape {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    deviceId: string;
    sensorType: string;
    radius?: number;
}

/** Full response body of GET /api/floor-plans/:id */
export interface FloorPlanApiResponse {
    floorId: string;
    deviceType: string;
    shapes: ApiShape[];
    floorPlanImage: string;
}

/** Normalised floor plan info used internally by the viewer */
export interface ViewerFloorPlan {
    floorId: string;
    imageUrl: string;
    /**
     * Original image dimensions are not included in the current API response.
     * Defaults to { width: 0, height: 0 }; `useStageSize` falls back to
     * 800 × 600 and adapts the stage width via ResizeObserver automatically.
     */
    originalImageDimensions: { width: number; height: number };
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

/**
 * Converts a flat ApiShape (no top-level deviceType field) into a PersistedShape
 * by injecting the response root's deviceType.
 * Also normalises zero-width/height values to undefined so optional fields in
 * the Shape interface behave correctly downstream.
 */
function apiShapeToPersistedShape(apiShape: ApiShape, deviceType: string): PersistedShape {
    return {
        id: apiShape.id,
        type: apiShape.type as 'rectangle' | 'circle' | 'polygon',
        x: apiShape.x,
        y: apiShape.y,
        width: apiShape.width > 0 ? apiShape.width : undefined,
        height: apiShape.height > 0 ? apiShape.height : undefined,
        radius: apiShape.radius,
        name: apiShape.name,
        deviceType,
        deviceId: apiShape.deviceId,
        sensorType: apiShape.sensorType,
    };
}

/**
 * Maps a raw API response to the viewer's internal data model:
 *  - Extracts image URL and floor ID into a ViewerFloorPlan
 *  - Deserializes and groups shapes under their deviceType key
 */
function mapApiResponse(data: FloorPlanApiResponse): {
    viewerFloorPlan: ViewerFloorPlan;
    shapesByDeviceType: Record<string, Shape[]>;
} {
    const viewerFloorPlan: ViewerFloorPlan = {
        floorId: data.floorId,
        imageUrl: data.floorPlanImage,
        originalImageDimensions: { width: 0, height: 0 },
    };

    const persistedShapes: PersistedShape[] = data.shapes.map((s) => apiShapeToPersistedShape(s, data.deviceType));

    return {
        viewerFloorPlan,
        shapesByDeviceType: {
            [data.deviceType]: deserializeShapesFromAPI(persistedShapes),
        },
    };
}

// ─── Hook result type ─────────────────────────────────────────────────────────

export interface UseFloorPlanDataResult {
    floorPlan: ViewerFloorPlan | null;
    shapesByDeviceType: Record<string, Shape[]>;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Fetches floor plan geometry (image URL + shapes) from the API.
 * Shapes are deserialized from the persisted API format into full Redux-compatible
 * Shape objects (with default UI properties applied).
 */
export function useFloorPlanData(floorPlanId: string): UseFloorPlanDataResult {
    const [floorPlan, setFloorPlan] = useState<ViewerFloorPlan | null>(null);
    const [shapesByDeviceType, setShapesByDeviceType] = useState<Record<string, Shape[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchKey, setFetchKey] = useState(0);

    useEffect(() => {
        if (!floorPlanId) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        axios
            .get<FloorPlanApiResponse>(`/api/floor-plans/${floorPlanId}`)
            .then((res) => {
                if (cancelled) return;
                const data = normData1;
                const { viewerFloorPlan, shapesByDeviceType: mapped } = mapApiResponse(res.data);
                setFloorPlan(viewerFloorPlan);
                setShapesByDeviceType(mapped);
            })
            .catch((err: any) => {
                if (cancelled) return;
                // Fall back to normData1 during development until the API is live
                console.warn('Floor plan API unavailable — using fallback data:', err?.message);
                const { viewerFloorPlan, shapesByDeviceType: mapped } = mapApiResponse(
                    normData1 as FloorPlanApiResponse
                );
                setFloorPlan(viewerFloorPlan);
                setShapesByDeviceType(mapped);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [floorPlanId, fetchKey]);

    return {
        floorPlan,
        shapesByDeviceType,
        loading,
        error,
        refetch: () => setFetchKey((k) => k + 1),
    };
}
