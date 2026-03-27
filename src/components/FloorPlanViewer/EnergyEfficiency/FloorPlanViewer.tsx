import React, { useMemo } from 'react';
import { Shape } from 'types/whiteBoard/shapes';
import { ColorConfig, ShapeMetricData, ViewerShapeData } from './types';
import { getColorForValue } from './utils/colorScale';
import { getTooltipConfig } from './utils/tooltipConfig';
import { useFloorPlanData } from './hooks/useFloorPlanData';
import { useShapeSensorData } from './hooks/useShapeSensorData';
import { FloorPlanStage } from './FloorPlanStage';

export interface FloorPlanViewerProps {
    /** ID of the floor plan to load */
    floorPlanId: string;
    /** Active device layer to display (default: 'VRV/VRF') */
    deviceType?: string;
    /** Sensor data polling interval in ms (default: 30 000) */
    pollingInterval?: number;
    /** Called when the user clicks a shape */
    onShapeClick?: (shapeId: string, shape: Shape, sensorData: ShapeMetricData | null) => void;
    /** Called when the user hovers over / leaves a shape (null = mouse left) */
    onShapeHover?: (shapeId: string | null) => void;
    /**
     * Override the color configuration for specific device types.
     * Falls back to the built-in config in tooltipConfig.ts if not provided.
     */
    colorConfigOverride?: Partial<Record<string, ColorConfig>>;
    /**
     * Replace the entire tooltip body for a shape.
     * Receives the Shape and its latest sensor data.
     */
    tooltipRenderer?: (shape: Shape, data: ShapeMetricData | null) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Top-level floor plan viewer component.
 *
 * Responsibilities:
 *  1. Fetch floor plan geometry + image URL via `useFloorPlanData`
 *  2. Poll sensor / energy values via `useShapeSensorData`
 *  3. Merge both data sources and resolve a display colour per shape
 *  4. Delegate rendering to `FloorPlanStage`
 */
export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
    floorPlanId,
    deviceType = 'VRV/VRF',
    pollingInterval = 30_000,
    onShapeClick,
    onShapeHover,
    colorConfigOverride,
    tooltipRenderer,
    className,
    style,
}) => {
    const { floorPlan, shapesByDeviceType, loading: planLoading, error: planError } = useFloorPlanData(floorPlanId);

    const {
        sensorData,
        lastUpdated,
        loading: sensorLoading,
    } = useShapeSensorData(floorPlanId, deviceType, pollingInterval);

    // Resolve color config: prop override → built-in default for this device type
    const colorConfig = colorConfigOverride?.[deviceType] ?? getTooltipConfig(deviceType).colorConfig;

    // Merge geometry + sensor data + computed color into a single array
    const viewerShapeData: ViewerShapeData[] = useMemo(() => {
        const shapes = shapesByDeviceType[deviceType] ?? [];
        return shapes.map((shape) => {
            const metric = sensorData[shape.id] ?? null;
            const displayColor = getColorForValue(metric?.value ?? null, metric?.status, colorConfig);
            return { shape, sensorData: metric, displayColor };
        });
    }, [shapesByDeviceType, deviceType, sensorData, colorConfig]);

    // ── Loading state ─────────────────────────────────────────────────────────
    if (planLoading) {
        return (
            <div
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 300,
                    background: '#f8f9fa',
                    borderRadius: 8,
                    color: '#6c757d',
                    ...style,
                }}>
                Loading floor plan…
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (planError) {
        return (
            <div
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 300,
                    background: '#fff5f5',
                    borderRadius: 8,
                    color: '#dc3545',
                    ...style,
                }}>
                Error: {planError}
            </div>
        );
    }

    if (!floorPlan) return null;

    return (
        <div className={className} style={style}>
            {/* Status bar */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11,
                    color: '#888',
                    marginBottom: 6,
                    minHeight: 18,
                }}>
                <span>{floorPlan.floorId}</span>
                <span>
                    {sensorLoading && 'Updating…'}
                    {!sensorLoading && lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
                </span>
            </div>

            <FloorPlanStage
                imageUrl={floorPlan.imageUrl}
                originalDimensions={floorPlan.originalImageDimensions}
                shapes={viewerShapeData}
                deviceType={deviceType}
                onShapeClick={onShapeClick}
                onShapeHover={onShapeHover}
                tooltipRenderer={tooltipRenderer}
            />
        </div>
    );
};

export default FloorPlanViewer;
