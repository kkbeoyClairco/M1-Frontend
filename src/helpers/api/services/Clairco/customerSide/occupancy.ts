import { MODIFY_ALERT, serverDomains } from 'appConstants/claircoConstants';
import axios from 'axios';
import { APICore } from 'helpers/api/apiCore';
const api = new APICore();

// Gets Data for the Occupancy Table in the Customer Landing page
export const getOccupancyDeviceList = async () => {
    try {
        const baseUrl = `/devices/occupancy`;
        // return api.get(baseUrl);
        return api.get(baseUrl, null);
    } catch (error) {
        console.log(error);
    }
};

//Get device specific data
export const getOccupancyFromAllDevice = async (deviceId: string, timeInHours: number) => {
    try {
        const baseUrl = `/occupancy`;
        // console.log('resul', timeInHours);
        return api.create(baseUrl, { deviceId, timeInHours });
    } catch (error) {
        console.log(error);
    }
};
// Get the occupancy Trends within a date frame
export const getOccupancywithDates = async (startTime: any, endTime: any, deviceId: any) => {
    try {
        // const baseUrl = `http://3.7.82.174:4446/api/v1/devices/getRawDataTherm?startTime=${startTime}&endTime=${endTime}&deviceId=${deviceId}`;

        const baseUrl = `/devices/getRawDataTherm?startTime=${startTime}&endTime=${endTime}&deviceId=${deviceId}`;
        return axios.get(baseUrl);
    } catch (error) {
        console.log(error);
    }
};

// Get Data for Occupancy Layout
export const getDataOccupancyLayout = async () => {
    try {
        const url = '/devices/layout?floorId=651dc2e6454714d72701869e';
        const result = await api.get(url, null);
        // console.log('Result:', result);
        return result.data;
    } catch (error) {
        console.log(error);
    }
};

export const getDataForSVGManipulation = async (floorId?: any, deviceTypeId?: any) => {
    try {
        // 66f68ae10b7e6d271d9949c5 oic
        // 66d015995b0bbb913bf9936d AHU
        //66aca7ceb180b45b2dfe62a9 IIC
        // MODIFY_ALERT
        // &deviceTypeId=${deviceTypeId}
        // const url = `http://3.7.82.174:4444/api/v1/devices/devlayout?floorId=${floorId}&deviceTypeId=${deviceTypeId}`;
        const url = `/devices/devlayout?floorId=${floorId}&deviceTypeId=${deviceTypeId}`;
        return await api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const getOverallOccupancyData = async (startTime: any, endTime: any) => {
    try {
        const url = `/devices/occupancystats?startTime=${startTime}&endTime=${endTime}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const fetchThermalmage = async (id: any) => {
    try {
        // 66e803a2d30baa0ab8d4306a
        // http://3.7.82.174:2001
        const url = `${serverDomains.flask}/occupancy/image`;
        const res = await axios.post(url, { rawDataId: id }, { responseType: 'blob' });
        return res;
    } catch (error) {
        console.log(error);
        return;
    }
};
export const fetchZoneWiseOccupancyData = async (startTime: any, endTime: any, zoneId: any) => {
    try {
        const encodedZoneId = encodeURIComponent(JSON.stringify(zoneId));
        const url = `/devices/occupancystats?startTime=${startTime}&endTime=${endTime}&zoneId=${encodedZoneId}`;
        // console.log('URL', url);
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

//Occupancy Trends : With Time Period
export const getRawOccupancyData = async (startTime: any, endTime: any, deviceName: any) => {
    try {
        const url = `/devices/getRawDataTherm?startTime=${startTime}&endTime=${endTime}&deviceId=${deviceName}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
        return [];
    }
};

// PIR Table API
export const fetchPIRDeviceList = async (customerId?: any) => {
    try {
        const params = new URLSearchParams();
        if (customerId) params.append('customerId', customerId);
        const url = `/devices/pirOccupancy?${params.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

// PIR Trends and Live
export const getOccupancyTrendsData = (params: any) => {
    const baseUrl = `/devices/sens-data`;
    return api.get(baseUrl, params);
};

export const getThemopileData = async (sensor: string, timeFrameInHours: string | number) => {
    try {
        const url = `${serverDomains.flask}/api/v1/desktherm-realtime?Sensor=${sensor}&timeFrameInHours=${timeFrameInHours}`;
        return axios.get(url);
    } catch (error) {
        console.log(error);
    }
};
