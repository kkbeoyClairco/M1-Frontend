import { Shape } from 'types/whiteBoard/shapes';

// ─── Sensor / metric data returned by the polling API ────────────────────────

export interface ShapeMetricData {
    value: number | null;
    unit: string;
    status: 'active' | 'inactive' | 'fault' | 'warning';
    label?: string;
    metadata?: Record<string, any>;
}

// ─── Shape enriched with sensor data + resolved display color ─────────────────

export interface ViewerShapeData {
    shape: Shape;
    sensorData: ShapeMetricData | null;
    displayColor: string;
}

// ─── Color configuration modes ────────────────────────────────────────────────

/** Gradient: numeric value is linearly mapped between min⟶max across color stops */
export type GradientColorConfig = {
    mode: 'gradient';
    min: number;
    max: number;
    /** CSS hex colors ordered from low to high value, e.g. ['#00c851','#ffbb33','#ff4444'] */
    colors: string[];
};

/** Discrete: a status string is mapped directly to a static color */
export type DiscreteColorConfig = {
    mode: 'discrete';
    states: Record<string, string>;
    fallback: string;
};

export type ColorConfig = GradientColorConfig | DiscreteColorConfig;

// ─── Tooltip configuration ────────────────────────────────────────────────────

export interface TooltipField {
    /** Key to look up in ShapeMetricData (e.g. 'value', 'status', 'label') */
    key: string;
    label: string;
    unit?: string;
}

export interface DeviceTooltipConfig {
    fields: TooltipField[];
    colorConfig: ColorConfig;
}

// ─── Internal tooltip state ───────────────────────────────────────────────────

export interface TooltipState {
    visible: boolean;
    /** Pixel x position relative to the stage container */
    x: number;
    /** Pixel y position relative to the stage container */
    y: number;
    shapeId: string | null;
}
