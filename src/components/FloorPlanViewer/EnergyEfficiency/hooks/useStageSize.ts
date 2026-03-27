import { useState, useRef, useEffect, RefObject } from 'react';

export interface StageSize {
    width: number;
    height: number;
}

export interface UseStageSize {
    containerRef: RefObject<HTMLDivElement>;
    stageSize: StageSize;
}

/**
 * Observes the width of a container div and computes the Konva stage dimensions,
 * preserving the original image aspect ratio. The width is capped at 1200px.
 *
 * Falls back to the supplied `originalWidth` × `originalHeight` until the
 * ResizeObserver fires its first measurement.
 */
export function useStageSize(originalWidth: number, originalHeight: number): UseStageSize {
    const containerRef = useRef<HTMLDivElement>(null);

    const computeSize = (containerWidth: number): StageSize => {
        if (!originalWidth || !originalHeight || containerWidth <= 0) {
            return { width: originalWidth || 800, height: originalHeight || 600 };
        }
        const newWidth = Math.min(containerWidth, 1200);
        const newHeight = Math.round(newWidth * (originalHeight / originalWidth));
        return { width: newWidth, height: newHeight };
    };

    const [stageSize, setStageSize] = useState<StageSize>(() => computeSize(originalWidth));

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(([entry]) => {
            if (entry) {
                setStageSize(computeSize(entry.contentRect.width));
            }
        });

        observer.observe(container);

        // Compute from current bounding rect immediately (before first observation)
        const initial = container.getBoundingClientRect();
        if (initial.width > 0) {
            setStageSize(computeSize(initial.width));
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalWidth, originalHeight]);

    return { containerRef, stageSize };
}
