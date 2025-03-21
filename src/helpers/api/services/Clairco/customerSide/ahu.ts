import { APICore } from 'helpers/api/apiCore';
const api = new APICore();
export const fetchBTUTrendsData = async (sensorName: any, startTime: any, endTime: any) => {
    try {
        const url = `/devices/BTU-Trends?sensorName=${sensorName}&startEpoch=${startTime}&endEpoch=${endTime}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
export const fetchBTURealTime = async (sensorName: any) => {
    try {
        const url = `/devices/BTU-realtime?sensorName=${sensorName}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const fetchAHURealTime = async (sensorName: any) => {
    try {
        const url = `/devices/AHU-realtime?sensorName=${sensorName}`;

        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const fetchAHUTrends = async (sensorName?: any, startTime?: any, endtime?: any) => {
    try {
        const url = `/devices/AHU-Trends?sensorName=${sensorName}&startEpoch=${startTime}&endEpoch=${endtime}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const ahuContolsApi = async (newState: any) => {
    try {
        // http://3.7.82.174:2000
        const url = '/ahu/settings/';
        return api.create(url, newState);
    } catch (error) {
        return;
    }
};

export const fetchAHUDeviceList = async (customerId?: any) => {
    try {
        customerId = customerId ? customerId : '';
        const url = `/devices/all?deviceTypeId=66d015995b0bbb913bf9936d&customerId=${customerId}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

// export const fetchDeviceId = async (parentDeviceId: any) => {
//     try {
//         const url = `http://3.7.82.174:4444/api/v1/devices/all?deviceTypeId=66d015995b0bbb913bf9936d&parentDeviceId=${parentDeviceId}`;
//         return api.get(url, null);
//     } catch (error) {
//         console.log(error);
//     }
// };

// API to get data for Occupancy and IAQ tables in AHU Dashboard
// Devices mapped to this AHU device with Real time Values
export const fetchOccuAndIaqList = async (id: any) => {
    try {
        const url = `/devices/AhuRealtime/${id}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

// Average values like Humidity and Temperature
export const fetchAverageValuesForAHU = async (id: any) => {
    try {
        // 66ec0105f37c1f0bc3c1b52a
        const url = `/devices/AhuAggregate/${id}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

//DTP Real
export const fetchRealtimeDPT = async (deviceId: any) => {
    try {
        const url = `/devices/dtp-realtime?deviceId=${deviceId}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

//DTP Trends
export const fetchTrendsDPT = async (deviceId: any, startEpoch: any, endEpoch: any) => {
    try {
        const url = `/devices/dtp-trend?deviceId=${deviceId}&endEpochTime=${endEpoch}&startEpochTime=${startEpoch}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
