export const sanitizeTemperature = (value: string | number): number | null => {
    const sanitizedValue = parseFloat(value as string);
    if (
        isNaN(sanitizedValue)
        //  || sanitizedValue < 16 || sanitizedValue > 40
    ) {
        return null;
    }
    return Math.round(sanitizedValue * 2) / 2; // Round to the nearest 0.5
};

export const sanitizeThermostatMode = (value: string): string | null => {
    if (!value) return null;
    try {
        const allowedThermostatModes = ['Cool', 'Heat', 'Ventilation'];
        return allowedThermostatModes.includes(value?.trim()) ? value : null;
    } catch (error) {
        return null;
    }
};
export const sanitizeParameters = (parameters: Record<string, string | number>): Record<string, string | number> => {
    try {
        const sanitizedParameters: Record<string, string | number> = Object.create(null);

        Object.entries(parameters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (typeof value === 'string') {
                    sanitizedParameters[key] = value.trim();
                } else if (typeof value === 'number') {
                    sanitizedParameters[key] = value;
                }
            }
        });

        return sanitizedParameters;
    } catch (error) {
        return Object.create(null);
    }
};
