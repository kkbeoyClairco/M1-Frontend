import axios from 'axios';
import { APICore } from 'helpers/api/apiCore';

const api = new APICore();

// Device Control API
export const controlVrfVrcStateAPI = async (newDeviceState: {}) => {
    try {
        // http://3.7.82.174:2000
        const url = '/vrvvrf/settings/';

        const apiResult = await axios.post(url, newDeviceState);

        return apiResult;
    } catch (error) {
        console.log(error);
        return error;
    }
};

//List of Indoor unit tables
export const getIndoorUnitTableData = (parentUnitId: string) => {
    try {
        const baseUrl = `/devices/all?deviceType=VRV%2FVRF+Indoor&parentDeviceId=${parentUnitId}`;
        return api.get(baseUrl, null);
    } catch (error) {
        console.log(error);
    }
};

// Live Data of a Specific Indoor units device
export const getLiveDataOfIndoorUnit = (deviseName: string, timeInterval?: string | number) => {
    const encodedDeviseName = encodeURI(deviseName);
    if (!encodedDeviseName || !timeInterval) throw new Error('Paramertes absent');
    let baseUrl = `/devices/sens-data`;
    // &sensorName=${encodedDeviseName}&timeFrameInHours=${timeInterval}`;
    const params = new URLSearchParams();
    if (timeInterval) params.append('timeInterval', timeInterval.toString());
    params.append('sensorName', encodedDeviseName);
    params.append('deviceTypeId', '6690f11bd90262f91784da81');
    baseUrl = baseUrl + params.toString();
    return api.get(baseUrl, null);
};

//Aggregate data of Specific Indoor unit device
export const getAggregateDataOfIndoorUnit = (deviseName: string, timeInterval: string) => {
    const encodedDeviseName = encodeURI(deviseName);
    // if (!encodedDeviseName || !timeInterval) throw new Error('Paramertes absent');

    let baseUrl = `/devices/sens-aggr?sensorName=${encodedDeviseName}&timeFrameInHours=${timeInterval}`;

    return api.get(baseUrl, null);
};

//Gets occupants count from Device Id
export const getOccupantsCount = (deviceId: any) => {
    try {
        if (!deviceId) throw new Error('Device ID unavailable');

        const baseUrl = `/devices/occupancy/${deviceId}`;
        return api.get(baseUrl, null);
    } catch (error) {
        console.log(error);
    }
};

export const getVrfControlLogs = async (startTime: Number, endTime: Number) => {
    try {
        const url = `/temperatureLogs/?startTime=${startTime}&endTime=${endTime}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
