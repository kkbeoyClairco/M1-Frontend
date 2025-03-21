export const convertToBTU = (value: any) => {
    try {
        // Conversion factor from GJ to BTU
        const conversionFactor = 947817.120313;
        return value * conversionFactor;
    } catch (error) {
        return;
    }
};
