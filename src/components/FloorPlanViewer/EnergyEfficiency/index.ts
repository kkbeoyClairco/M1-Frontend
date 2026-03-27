// ─── Main component ───────────────────────────────────────────────────────────
export { FloorPlanViewer, FloorPlanViewer as default } from './FloorPlanViewer';
export type { FloorPlanViewerProps } from './FloorPlanViewer';

// ─── Sub-components (for advanced composition) ────────────────────────────────
export { FloorPlanStage } from './FloorPlanStage';
export type { FloorPlanStageProps } from './FloorPlanStage';

export { ViewerShape } from './ViewerShape';
export type { ViewerShapeProps } from './ViewerShape';

export { ShapeTooltip } from './ShapeTooltip';

// ─── Hooks (for custom orchestrators) ────────────────────────────────────────
export { useFloorPlanData } from './hooks/useFloorPlanData';
export type { UseFloorPlanDataResult } from './hooks/useFloorPlanData';

export { useShapeSensorData } from './hooks/useShapeSensorData';
export type { UseShapeSensorDataResult } from './hooks/useShapeSensorData';

export { useStageSize } from './hooks/useStageSize';
export type { StageSize, UseStageSize } from './hooks/useStageSize';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { getColorForValue } from './utils/colorScale';
export { getTooltipConfig, DEVICE_TOOLTIP_CONFIGS } from './utils/tooltipConfig';

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
    ShapeMetricData,
    ViewerShapeData,
    ColorConfig,
    GradientColorConfig,
    DiscreteColorConfig,
    TooltipField,
    DeviceTooltipConfig,
    TooltipState,
} from './types';
