export const roundToOneDecimal = (input: number) => {
    try {
        if (!input || typeof input != 'number' || isNaN(input)) throw new Error('Invalid input type');
        let result = Math.round(input * 10) / 10;
        return result;
    } catch (error) {
        console.log(error);
        return input;
    }
};
export const roundToZeroDecimal = (input: number) => {
    try {
        let result = Math.round(input);
        return result;
    } catch (error) {
        console.log(error);
        return input;
    }
};
/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param {number} input - The number to round.
 * @param {number} decimals - The number of decimal places to round to (default: 1).
 * @returns {number} The rounded number.
 * @throws {TypeError} If the input is not a valid number.
 */
export const roundToDecimal = (input: number, decimals: number = 1): number | string => {
    try {
        if (typeof input !== 'number' || isNaN(input)) {
            throw new TypeError('Invalid input: Input must be a valid number.');
        }
        const factor = Math.pow(10, decimals);
        return Math.round(input * factor) / factor;
    } catch (error) {
        return 'N/A';
    }
};

/**
 * Extracts and formats a numeric value from a nested object.
 *
 * @param {any} data - The nested object containing the value.
 * @param {string} key - The key to extract the value from.
 * @param {number} divisor - A divisor to apply to the value (default: 1).
 * @returns {string | number} The formatted value or 'N/A' if the value is invalid.
 */
export const extractAndFormatValue = (data: any, key: string, divisor: number = 1): string | number => {
    try {
        const value = data?.[key];
        if (typeof value === 'number' || !isNaN(Number(value))) {
            return roundToDecimal(Number(value) / divisor);
        }
        return 'N/A';
    } catch (error) {
        console.error(`Error extracting and formatting value for key "${key}":`, error);
        return 'N/A';
    }
};
