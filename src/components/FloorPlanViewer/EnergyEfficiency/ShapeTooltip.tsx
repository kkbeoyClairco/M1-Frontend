import React from 'react';
import { Shape } from 'types/whiteBoard/shapes';
import { ShapeMetricData, TooltipField } from './types';
import { getTooltipConfig } from './utils/tooltipConfig';

interface ShapeTooltipProps {
    visible: boolean;
    /** Pixel x position relative to the stage container */
    x: number;
    /** Pixel y position relative to the stage container */
    y: number;
    shape: Shape | null;
    sensorData: ShapeMetricData | null;
    deviceType: string;
    /** Override the entire tooltip body with a custom renderer */
    tooltipRenderer?: (shape: Shape, data: ShapeMetricData | null) => React.ReactNode;
}

// ─── Default tooltip body ─────────────────────────────────────────────────────

function DefaultTooltipContent({
    shape,
    sensorData,
    deviceType,
}: {
    shape: Shape;
    sensorData: ShapeMetricData | null;
    deviceType: string;
}) {
    const config = getTooltipConfig(deviceType);
    const data: Record<string, any> = sensorData ?? {};

    return (
        <div style={{ minWidth: 160 }}>
            {/* Shape name header */}
            <div
                style={{
                    fontWeight: 600,
                    fontSize: 13,
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: 4,
                    marginBottom: 6,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 200,
                }}>
                {shape.name ?? shape.id}
            </div>

            {/* Configured fields */}
            {config.fields.map((field: TooltipField) => {
                const rawVal = data[field.key];
                const display = rawVal !== undefined && rawVal !== null ? `${rawVal}${field.unit ?? ''}` : '—';

                return (
                    <div
                        key={field.key}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 16,
                            fontSize: 12,
                            lineHeight: '1.7',
                        }}>
                        <span style={{ opacity: 0.7 }}>{field.label}</span>
                        <span style={{ fontWeight: 500 }}>{display}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Tooltip container (HTML overlay, not drawn on canvas) ────────────────────

const OFFSET_PX = 14;

/**
 * Absolutely-positioned HTML tooltip rendered **outside** the Konva canvas layer.
 * This avoids canvas redraws on hover and allows full HTML/CSS styling.
 * `pointer-events: none` ensures it never intercepts mouse events meant for shapes.
 */
export const ShapeTooltip: React.FC<ShapeTooltipProps> = ({
    visible,
    x,
    y,
    shape,
    sensorData,
    deviceType,
    tooltipRenderer,
}) => {
    if (!visible || !shape) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: x + OFFSET_PX,
                top: y + OFFSET_PX,
                background: 'rgba(24, 24, 34, 0.94)',
                color: '#f0f0f0',
                borderRadius: 8,
                padding: '8px 12px',
                pointerEvents: 'none',
                zIndex: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: 240,
                wordBreak: 'break-word',
                transition: 'opacity 0.1s ease',
            }}>
            {tooltipRenderer ? (
                tooltipRenderer(shape, sensorData)
            ) : (
                <DefaultTooltipContent shape={shape} sensorData={sensorData} deviceType={deviceType} />
            )}
        </div>
    );
};

export default ShapeTooltip;
