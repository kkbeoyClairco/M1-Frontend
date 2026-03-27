import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import { Shape } from 'types/whiteBoard/shapes';
import { ViewerShapeData, TooltipState, ShapeMetricData } from './types';
import { ViewerShape } from './ViewerShape';
import { ShapeTooltip } from './ShapeTooltip';
import { useStageSize } from './hooks/useStageSize';

export interface FloorPlanStageProps {
    imageUrl: string;
    originalDimensions: { width: number; height: number };
    shapes: ViewerShapeData[];
    deviceType: string;
    onShapeClick?: (shapeId: string, shape: Shape, sensorData: ShapeMetricData | null) => void;
    onShapeHover?: (shapeId: string | null) => void;
    tooltipRenderer?: (shape: Shape, data: ShapeMetricData | null) => React.ReactNode;
}

/**
 * Konva Stage wrapped in a responsive container.
 *
 * Architecture note — tooltip is an **HTML overlay div**, not a Konva node:
 *  - Sits in a `position: relative` wrapper alongside the Stage
 *  - `pointer-events: none` so it never blocks canvas interactions
 *  - No canvas redraw triggered on hover; only React state updates
 */
export const FloorPlanStage: React.FC<FloorPlanStageProps> = ({
    imageUrl,
    originalDimensions,
    shapes,
    deviceType,
    onShapeClick,
    onShapeHover,
    tooltipRenderer,
}) => {
    const { containerRef, stageSize } = useStageSize(originalDimensions.width, originalDimensions.height);
    // console.log("Stage size ",stageSize)
    const stageRef = useRef<Konva.Stage>(null);
    const [floorPlanImg, setFloorPlanImg] = useState<HTMLImageElement | null>(null);
    const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false,
        x: 0,
        y: 0,
        shapeId: null,
    });

    // ── Load background image ───────────────────────────────────────────────
    useEffect(() => {
        if (!imageUrl) return;
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setFloorPlanImg(img);
        img.onerror = () => setFloorPlanImg(null);
        img.src = imageUrl;
    }, [imageUrl]);

    // ── Shape event handlers ─────────────────────────────────────────────────

    const handleShapeMouseEnter = (shapeId: string, e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = stageRef.current;
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (pos) {
            setTooltip({ visible: true, x: pos.x, y: pos.y, shapeId });
        }

        setHoveredShapeId(shapeId);
        onShapeHover?.(shapeId);

        // Change cursor to pointer for better UX
        stage.container().style.cursor = 'pointer';
    };

    const handleShapeMouseLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, shapeId: null });
        setHoveredShapeId(null);
        onShapeHover?.(null);

        const stage = stageRef.current;
        if (stage) stage.container().style.cursor = 'default';
    };

    // Track pointer while hovering to keep tooltip near cursor
    const handleStageMouseMove = () => {
        if (!hoveredShapeId) return;
        const stage = stageRef.current;
        if (!stage) return;
        const pos = stage.getPointerPosition();
        if (pos) {
            setTooltip((prev) => ({ ...prev, x: pos.x, y: pos.y }));
        }
    };

    // ── Resolve tooltip target ───────────────────────────────────────────────
    const tooltipTarget = shapes.find((s) => s.shape.id === tooltip.shapeId) ?? null;

    return (
        // `position: relative` is required so the absolutely-positioned tooltip
        // is anchored to the stage container rather than the document.
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} onMouseMove={handleStageMouseMove}>
                <Layer>
                    {/* Background floor plan image */}
                    {floorPlanImg && (
                        <KonvaImage
                            image={floorPlanImg}
                            width={stageSize.width}
                            height={stageSize.height}
                            listening={false}
                        />
                    )}

                    {/* Data-driven shapes */}
                    {shapes.map((vsd) => (
                        <ViewerShape
                            key={vsd.shape.id}
                            shape={vsd.shape}
                            displayColor={vsd.displayColor}
                            sensorData={vsd.sensorData}
                            stageWidth={stageSize.width}
                            stageHeight={stageSize.height}
                            isHovered={hoveredShapeId === vsd.shape.id}
                            onClick={onShapeClick}
                            onMouseEnter={handleShapeMouseEnter}
                            onMouseLeave={handleShapeMouseLeave}
                        />
                    ))}
                </Layer>
            </Stage>

            {/* HTML tooltip overlay — rendered outside canvas to avoid redraws */}
            <ShapeTooltip
                visible={tooltip.visible}
                x={tooltip.x}
                y={tooltip.y}
                shape={tooltipTarget?.shape ?? null}
                sensorData={tooltipTarget?.sensorData ?? null}
                deviceType={deviceType}
                tooltipRenderer={tooltipRenderer}
            />
        </div>
    );
};

export default FloorPlanStage;
