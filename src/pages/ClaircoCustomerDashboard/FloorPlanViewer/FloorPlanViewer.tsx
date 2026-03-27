import React from 'react';
import { FloorPlanViewer as EnergyFloorPlanViewer } from 'components/FloorPlanViewer/EnergyEfficiency';
import type { ShapeMetricData } from 'components/FloorPlanViewer/EnergyEfficiency';
import type { Shape } from 'types/whiteBoard/shapes';

/**
 * Customer-facing floor plan viewer page.
 * Replace `floorPlanId` with the actual ID from route params once routing is wired.
 */
const FloorPlanViewer = () => {
    const handleShapeClick = (shapeId: string, shape: Shape, sensorData: ShapeMetricData | null) => {
        console.log('Shape clicked:', shapeId, shape, sensorData);
        // TODO: open detail modal or navigate to device page
    };

    return (
        <div style={{ padding: '16px' }}>
            <EnergyFloorPlanViewer
                floorPlanId="PLACEHOLDER_FLOOR_PLAN_ID"
                deviceType="VRV/VRF"
                pollingInterval={30_000}
                onShapeClick={handleShapeClick}
            />
        </div>
    );
};

export default FloorPlanViewer;
