export const iaqParameters = ['PM1', 'OPM10', 'OPM25', 'PM25', 'PM4', 'PM10', 'CO2', 'TEMP', 'HUM'];
export const parametersDefaultValues = {
    PM1: {
        isActive: true,
        low: 0,
        high: 35,
        calib: 0,
    },
    PM25: {
        isActive: true,
        low: 0,
        high: 252,
        calib: 0,
    },
    PM4: {
        isActive: true,
        low: 0,
        high: 70,
        calib: 0,
    },
    PM10: {
        isActive: true,
        low: 0,
        high: 425,
        calib: 0,
    },
    CO2: {
        isActive: true,
        low: 0,
        high: 1000,
        calib: 0,
    },
    TEMP: {
        isActive: true,
        low: 0,
        high: 100,
        calib: 0,
    },
    HUM: {
        isActive: true,
        low: 0,
        high: 100,
        calib: 0,
    },
};
