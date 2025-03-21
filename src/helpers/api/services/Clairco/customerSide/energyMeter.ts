import { APICore } from 'helpers/api/apiCore';
const api = new APICore();
export const getEnergyMeterHistoricReadings = async (sensorName: any, timePeriod: any) => {
    try {
        // http://192.168.29.8:4444/api/v1
        const url = `http://192.168.29.8:4446/api/v1/devices/sens-data?sensorName=${sensorName}&timeFrameInHours=${timePeriod}&deviceTypeId=66a891781827e777d25fc180`;

        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const getPowerHistoricData = async (sensorName: any, timePeriod: any, timeframe2: any) => {
    try {
        const url = `http://192.168.29.8:4446/api/v1/energy-meters/display/total-consumption?sensorName=${sensorName}&timeframe=${timePeriod}&timeframe2=${timeframe2}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const getEnergyMeterLiveReading = async (sensorName: any) => {
    try {
        const url = `http://192.168.29.8:4446/api/v1/devices/energyMeter/realtime?sensorName=${sensorName}`;
        return api.get(url, null);
    } catch (error) {}
};
