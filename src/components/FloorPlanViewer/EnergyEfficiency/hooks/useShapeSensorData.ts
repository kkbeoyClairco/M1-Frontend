import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { ShapeMetricData } from '../types';

interface SensorDataApiResponse {
    timestamp: string;
    data: Record<string, ShapeMetricData>;
}

export interface UseShapeSensorDataResult {
    /** Map of shapeId → latest metric data */
    sensorData: Record<string, ShapeMetricData>;
    lastUpdated: Date | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches sensor/energy values for all shapes on a floor plan and re-polls
 * on the given interval (default 30 s). The interval is cleared on unmount
 * or if `floorPlanId` / `deviceType` change.
 *
 * API contract expected:
 *   GET /api/sensor-data/:floorPlanId?deviceType=AHU
 *   → { timestamp: ISO string, data: { [shapeId]: ShapeMetricData } }
 */
export function useShapeSensorData(
    floorPlanId: string,
    deviceType: string,
    pollingInterval: number = 30_000
): UseShapeSensorDataResult {
    const [sensorData, setSensorData] = useState<Record<string, ShapeMetricData>>({});
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchData = useCallback(
        async (isInitial: boolean) => {
            if (!floorPlanId || !deviceType) return;
            if (isInitial) setLoading(true);

            try {
                const res = await axios.get<SensorDataApiResponse>(`/api/sensor-data/${floorPlanId}`, {
                    params: { deviceType },
                });
                setSensorData(res.data.data ?? {});
                setLastUpdated(new Date(res.data.timestamp));
                setError(null);
            } catch (err: any) {
                setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load sensor data');
            } finally {
                if (isInitial) setLoading(false);
            }
        },
        [floorPlanId, deviceType]
    );

    useEffect(() => {
        if (!floorPlanId || !deviceType) return;

        // Reset stale data when the floor plan or device type changes
        setSensorData({});
        setLastUpdated(null);

        fetchData(true);

        intervalRef.current = setInterval(() => fetchData(false), pollingInterval);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [floorPlanId, deviceType, pollingInterval, fetchData]);

    return { sensorData, lastUpdated, loading, error };
}
