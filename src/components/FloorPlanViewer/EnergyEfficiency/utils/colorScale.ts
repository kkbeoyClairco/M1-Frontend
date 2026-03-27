import { ColorConfig } from '../types';

// ─── Colour helpers ───────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
    return Math.round(a + (b - a) * t);
}

function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Interpolate smoothly across an arbitrary number of color stops.
 * @param colors  Array of CSS hex strings ordered from low to high value.
 * @param t       Normalized position in [0, 1].
 */
function interpolateColors(colors: string[], t: number): string {
    if (colors.length === 0) return '#aaaaaa';
    if (colors.length === 1) return colors[0];

    const clampedT = Math.max(0, Math.min(1, t));
    const segment = 1 / (colors.length - 1);
    const segIndex = Math.min(Math.floor(clampedT / segment), colors.length - 2);
    const segT = (clampedT - segIndex * segment) / segment;

    const c1 = hexToRgb(colors[segIndex]);
    const c2 = hexToRgb(colors[segIndex + 1]);

    return rgbToHex(lerp(c1[0], c2[0], segT), lerp(c1[1], c2[1], segT), lerp(c1[2], c2[2], segT));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Resolves a display color for a shape given its current sensor value/status.
 *
 * - Gradient mode: maps a numeric `value` linearly across the configured color stops.
 * - Discrete mode: maps a `status` string to a static color from the lookup table.
 *
 * Returns the fallback/first color when the value is null or out of range.
 */
export function getColorForValue(value: number | null, status: string | undefined, config: ColorConfig): string {
    if (config.mode === 'discrete') {
        if (status && status in config.states) {
            return config.states[status];
        }
        return config.fallback;
    }

    // Gradient mode
    if (value === null || value === undefined) return config.colors[0] ?? '#aaaaaa';

    const { min, max, colors } = config;
    const range = max - min;
    const t = range === 0 ? 0 : (value - min) / range;
    return interpolateColors(colors, t);
}
