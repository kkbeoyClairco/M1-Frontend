import { DeviceTooltipConfig } from '../types';

// ─── Per-device-type default configurations ───────────────────────────────────

export const DEVICE_TOOLTIP_CONFIGS: Record<string, DeviceTooltipConfig> = {
    'VRV/VRF': {
        colorConfig: {
            mode: 'discrete',
            states: {
                active: '#00c851',
                inactive: '#9e9e9e',
                fault: '#ff4444',
                warning: '#ffbb33',
            },
            fallback: '#9e9e9e',
        },
        fields: [
            { key: 'label', label: 'Unit' },
            { key: 'value', label: 'Temperature', unit: ' °C' },
            { key: 'status', label: 'Status' },
        ],
    },

    AHU: {
        colorConfig: {
            mode: 'gradient',
            min: 0,
            max: 100,
            colors: ['#00c851', '#ffbb33', '#ff4444'],
        },
        fields: [
            { key: 'label', label: 'Zone' },
            { key: 'value', label: 'Load', unit: ' %' },
            { key: 'status', label: 'Status' },
        ],
    },

    Occupancy: {
        colorConfig: {
            mode: 'gradient',
            min: 0,
            max: 200,
            colors: ['#e8f5e9', '#81c784', '#e53935'],
        },
        fields: [
            { key: 'label', label: 'Zone' },
            { key: 'value', label: 'Occupancy', unit: ' people' },
            { key: 'status', label: 'Status' },
        ],
    },

    Energy: {
        colorConfig: {
            mode: 'gradient',
            min: 0,
            max: 500,
            colors: ['#e3f2fd', '#42a5f5', '#1565c0'],
        },
        fields: [
            { key: 'label', label: 'Meter' },
            { key: 'value', label: 'Consumption', unit: ' kWh' },
            { key: 'status', label: 'Status' },
        ],
    },
};

// ─── Fallback used when deviceType is not listed above ────────────────────────

const DEFAULT_TOOLTIP_CONFIG: DeviceTooltipConfig = {
    colorConfig: {
        mode: 'discrete',
        states: {
            active: '#00c851',
            inactive: '#9e9e9e',
            fault: '#ff4444',
            warning: '#ffbb33',
        },
        fallback: '#9e9e9e',
    },
    fields: [
        { key: 'label', label: 'Name' },
        { key: 'value', label: 'Value' },
        { key: 'status', label: 'Status' },
    ],
};

export function getTooltipConfig(deviceType: string): DeviceTooltipConfig {
    return DEVICE_TOOLTIP_CONFIGS[deviceType] ?? DEFAULT_TOOLTIP_CONFIG;
}
