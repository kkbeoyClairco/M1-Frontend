// import { object } from 'yup';
// import { dataLevels } from './fakeData';
import { convertUnixToIST } from 'utils/timeFunctions';
import { coloursTable } from 'appConstants/propertyTable';
const yLabels = [null, 'Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous'];
export const createParameters = (data: any) => {
    const parameterKeys = Object.keys(data).filter((key) => Array.isArray(data[key]));
    return parameterKeys;
};

export const createSeries = (data: any) => {
    const parameterKeys = createParameters(data);
    const series = parameterKeys.reduce((accu: any, parameter: string) => {
        //NEED TO SORT
        const levels = data[parameter].map((data: any) => data?.level);
        const timestamps = data[parameter].map((data: any) =>
            data?.timestamp ? convertUnixToIST(data?.timestamp) : 'N/A'
        );
        accu[parameter] = {
            name: parameter,
            data: [
                {
                    name: parameter,
                    type: 'line',
                    smooth: true,
                    endLabel: {
                        show: false,
                        formatter: function (params: any) {
                            // console.log('End label parameter', params);
                            return params?.seriesName + ': ' + yLabels[params.value];
                        },
                    },
                    labelLayout: {
                        // dx: 40,
                        show: false,
                        align: 'left',
                        moveOverlap: 'shiftY',
                        verticalAlign: 'top',
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            fontWeight: 'bold',
                            formatter: (params: any) => {
                                // customize label text here
                                return ParamNameForDisplay[params.seriesName] + ': ' + yLabels[params.value];
                            },
                        },
                    },
                    step: 'start',
                    data: levels,
                    connectNulls: true,
                    lineStyle: {
                        color: coloursTable[parameter],
                    },
                },
            ],

            timestamps,
        };
        return accu;
    }, {});
    return series;
};

export const createSeriesForLevelTrends = (data: any[]) => {
    data.reverse();
    // Get all parameter keys from the first object, except 'date'
    if (!data || data.length === 0) return {};
    const parameterKeys = Object.keys(data[0]).filter((key) => key !== 'date');
    const series: any = {};

    parameterKeys.forEach((parameter) => {
        const levels = data
            .map((obj: any) => {
                const paramLevels = obj[parameter] || {};
                return [1, 2, 3, 4, 5, 6]
                    .map((lvl) => (paramLevels[lvl]?.level ? Number(paramLevels[lvl]?.level) : null))
                    .filter((doc) => doc);
            })
            .flat();

        const timestamps = data
            .map((obj: any) => {
                const paramLevels = obj[parameter] || {};
                return [1, 2, 3, 4, 5, 6]
                    .map((lvl) =>
                        paramLevels[lvl]?.timestamp ? convertUnixToIST(Number(paramLevels[lvl]?.timestamp)) : null
                    )
                    .filter((doc) => doc);
                // .filter((doc) => doc !== 0);
            })
            .flat();

        // console.log('Data ', data);
        series[parameter] = {
            name: parameter,
            data: [
                {
                    name: parameter,
                    type: 'line',
                    smooth: true,
                    endLabel: {
                        show: false,
                        formatter: function (params: any) {
                            return params?.seriesName + ': ' + params.value;
                        },
                    },
                    labelLayout: {
                        show: false,
                        align: 'left',
                        moveOverlap: 'shiftY',
                        verticalAlign: 'top',
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            fontWeight: 'bold',
                            formatter: (params: any) =>
                                ParamNameForDisplay[params.seriesName] + ': ' + yLabels[params?.value],
                        },
                    },
                    step: 'start',
                    // You may want to extract a specific level here, e.g.:
                    // data: data.map(obj => obj[parameter]?.['1'] ?? 0),
                    data: levels,
                    //  levels.map((levelObj) => levelObj['1'] ?? 0), // Change '1' to desired level or make dynamic
                    connectNulls: true,
                    lineStyle: {
                        color: coloursTable[parameter],
                    },
                },
            ],
            timestamps: timestamps,
            // data.map((obj) => obj.date ?? 'N/A'),
        };
    });
    // console.log('Series', series['OPM25']);
    return series;
};

export const ParamNameForDisplay: Record<string, string> = {
    VOC: 'VOC',
    TEMP: 'Temperature',
    PM25: 'PM 2.5',
    PM10: 'PM 10 ',
    OTemp: 'Outdoor Temperature',
    OPM25: 'Outdoor PM 2.5',
    OPM10: 'Outdoor PM 10',
    HUM: 'Humidity',
    CO2: 'CO2',
    AQI: 'AQI',
};
export const parameterOrder = ['PM25', 'PM10', 'CO2', 'VOC', 'AQI', 'TEMP', 'HUM', 'OPM25', 'OPM10'];
export const extractParameters = (data: any) => {
    return parameterOrder.filter((param) => param in data);
};
export const createDataForStacked = (data: any) => {
    // const parameters = Object.keys(data)?.filter((param) => typeof data[param] === 'object');

    const parameters = extractParameters(data);
    const results = Array.from({ length: 6 }).fill(() => []);

    for (let level = 1; level <= 6; level++) {
        const levelValuesArray = parameters.map((param) => data?.[param]?.[level] ?? 0);
        results[level - 1] = levelValuesArray;
    }

    return results;
};
export function formatDateToDDMMYY(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year.slice(-2)}`;
}

export const createDataForStacked2 = (data: any[], parameter: string) => {
    try {
        // const filteredData = data?.filter((dt) => Object.keys(dt)?.includes(parameter));
        const filteredData = data.filter((dt) => dt[parameter] !== undefined && dt[parameter] !== null);

        // console.log('filteredData0', filteredData);
        const results: number[][] = Array.from({ length: 6 }, () => []);
        for (let level = 1; level <= 6; level++) {
            for (let i = 0; i < filteredData?.length; i++) {
                results[level - 1][i] = filteredData?.[i]?.[parameter]?.[level] ?? 0;
            }
        }
        const xAxis = extractDates(filteredData);
        // return results;
        return {
            series: results,
            xAxis,
        };
    } catch (error) {
        console.log(error);
        throw new Error();
    }
};

export const extractDates = (data: any) => {
    try {
        const dates = data.map((dt: any) => formatDateToDDMMYY(dt?.date));
        return dates;
    } catch (error) {
        console.log(error);
    }
};
export const getParametersForLevelChart = (data: any) => {
    try {
        const parameters = new Set();
        for (let i = 0; i < parameterOrder.length; i++) {
            for (let j = 0; j < data?.length; j++) {
                if (data?.[j]?.[parameterOrder?.[i]] !== undefined && data?.[j]?.[parameterOrder?.[i]] !== null) {
                    parameters?.add(parameterOrder?.[i]);
                    // continue;
                }
            }
        }
        return Array.from(parameters);
    } catch (error) {
        return [];
    }
};
// export const getParametersForPercentageChart = (data: any) => {
//     try {
//         const parameters = new Set();
//     } catch (error) {
//         return [];
//     }
// };
