export const testData = {
    name: 'string',
    customerId: 'objectId',
    buildingId: 'objectId',
    floorId: 'objectId',
    parameters: {
        PM1: {
            isActive: false,
            low: 0,
            high: 35,
            calib: '1.0',
        },
        PM25: {
            isActive: true,
            low: 0,
            high: 252,
            calib: '1.0',
        },
        PM4: {
            isActive: false,
            low: 0,
            high: 70,
            calib: '1.0',
        },
        PM10: {
            isActive: true,
            low: 0,
            high: 425,
            calib: '1.0',
        },
        CO2: {
            isActive: false,
            low: 0,
            high: 1000,
            calib: '1.0',
        },
        TEMP: {
            isActive: true,
            low: 0,
            high: 100,
            calib: '1.0',
        },
        HUM: {
            isActive: true,
            low: 0,
            high: 100,
            calib: '1.0',
        },
    },
    clientEmail: [], //boolean
    weeklyReport: false, //  boolean
    alert: false, // boolean,
    alertEmail: [],
    expiringAt: 'date',
    snoozeAlerts: [],
};
