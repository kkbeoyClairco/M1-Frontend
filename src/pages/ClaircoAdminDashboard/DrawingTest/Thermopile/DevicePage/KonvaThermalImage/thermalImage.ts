import chroma from 'chroma-js';

/**
 * Formats a 2D array of temperatures into an array of tuples.
 * Each tuple contains the row index, column index, and the temperature value.
 *
 * @param {number[][]} temp - A 2D array of temperature values.
 * @returns {[number, number, number][]} - An array of tuples where each tuple represents:
 *   - The row index (i)
 *   - The column index (j)
 *   - The temperature value at that position
 *
 * @example
 * const sampleTemp = [
 *   [28.1, 28.2],
 *   [28.3, 28.4],
 * ];
 * const formattedData = formatTemperatureInput(sampleTemp);
 * console.log(formattedData);
 * // Output: [[0, 0, 28.1], [0, 1, 28.2], [1, 0, 28.3], [1, 1, 28.4]]
 */
// export const formatTemperatureInput = (temp: number[][]) => {
//     const temp1: [number, number, number][] = [];
//     for (let i = 0; i < temp.length; i++) {
//         const rowLength = temp[i].length;

//         for (let j = 0; j < rowLength; j++) {
//             if (typeof temp[i][j] === 'number') {
//                 temp1.push([i, j, temp[i][j]]); // x is reversed
//             }
//         }
//     }
//     return temp1;
// };

export const formatTemperatureInput = (temp: number[][]) => {
    const temp1: [number, number, number][] = [];
    for (let i = 0; i < temp.length; i++) {
        const rowLength = temp[i].length;
        for (let j = 0; j < rowLength; j++) {
            if (typeof temp[i][j] === 'number') {
                temp1.push([rowLength - 1 - j, i, temp[i][j]]); // x is reversed
            }
        }
    }
    return temp1;
};

export const formatTemperatureInput2 = (temp: number[]) => {
    const temp1: [number, number, number][] = [];
    const gridWidth = 32;
    for (let i = 0; i < temp.length; i++) {
        const x = i % gridWidth; // column
        const y = Math.floor(i / gridWidth); // row
        temp1.push([x, y, temp[i]]);
    }
    return temp1;
};

/**
 * Maps a temperature value to a color using a non-linear scaling (quadratic).
 * The color transitions from blue (low temperature) to red (high temperature).
 *
 * @param {number} temp - The temperature value to map.
 * @param {number} min - The minimum temperature in the range.
 * @param {number} max - The maximum temperature in the range.
 * @returns {string} - A string representing the RGB color corresponding to the temperature.
 *
 * @example
 * const color = getTemperatureColor(28, 16, 40);
 * console.log(color); // Output: rgb(85, 0, 170)
 */
export const getTemperatureColor = (temp: number, min: number, max: number) => {
    const minTemp = min,
        maxTemp = max;
    const percentage = Math.pow((temp - minTemp) / (maxTemp - minTemp), 2);
    return `rgb(${Math.floor(255 * percentage)}, 0, ${Math.floor(255 * (1 - percentage))})`;
};

/**
 * Formats a 2D array of temperatures into an array of tuples.
 * Each tuple contains the row index, column index, and the temperature value.
 *
 * @param {number[][]} temp - A 2D array of temperature values.
 * @returns {[number, number, number][]} - An array of tuples where each tuple represents:
 *   - The row index (i)
 *   - The column index (j)
 *   - The temperature value at that position
 *
 * @example
 * const sampleTemp = [
 *   [28.1, 28.2],
 *   [28.3, 28.4],
 * ];
 * const formattedData = formatTemperatureInput(sampleTemp);
 * console.log(formattedData);
 * // Output: [[0, 0, 28.1], [0, 1, 28.2], [1, 0, 28.3], [1, 1, 28.4]]
 */
export const getTemperatureColorChroma = (temp: number, min: number, max: number) => {
    // const scale = chroma.scale(['blue', 'green', 'yellow', 'red']).domain([min, max]);
    const infernoColors = [
        '#000004',
        '#0c0925',
        '#1b0c41',
        '#2a0e5d',
        '#4a0c6b',
        '#6a1c6d',
        '#781c6d',
        '#8f1c5e',
        '#a52c60',
        '#b93c52',
        '#cf4446',
        '#e55a38',
        '#ed6925',
        '#f07f15',
        '#fb9b06',
        '#f7b72d',
        '#f7d13d',
        '#fbe85d',
        '#fcffa4',
    ];
    const scale = chroma
        .scale(infernoColors)
        // (['blue', 'green', 'yellow', 'gold', 'red', 'darkred'])
        .domain([18, 40]);
    return scale(temp).hex(); // Returns hex color
};

export const getTemperatureLimits = (tempArray: number[][]) => {
    let min = 32;
    let max = 24;

    for (let i = 0; i < tempArray.length; i++) {
        for (let j = 0; j < tempArray.length; j++) {
            if (max < tempArray[i][j]) max = tempArray[i][j];
            else if (min > tempArray[i][j]) min = tempArray[i][j];
        }
    }
    return { min, max };
};
