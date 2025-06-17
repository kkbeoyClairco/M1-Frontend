import { MODIFY_ALERT, serverDomains } from 'appConstants/claircoConstants';
import axios from 'axios';
import config from 'config';
import { APICore } from 'helpers/api/apiCore';
import { getDateNow } from 'utils/timeFunctions';
const api = new APICore();

export const getIaqData = (params: any) => {
    // MODIFY_ALERT

    const baseUrl = `/devices/sens-data`;
    return api.get(baseUrl, params);
};

export const getIaqAggregate = (sensorName: string, buildingId: string, deviceId: string) => {
    try {
        const dateNow = getDateNow();
        // http://3.7.82.174:4446/api/v1/devices
        // MODIFY_ALERT
        const url1 = `/devices/iaq/${sensorName}/data?date=${dateNow}&buildingId=${buildingId}&deviceId=${deviceId}`;
        const params = new URLSearchParams();
        if (deviceId) params.append('deviceId', deviceId);
        if (buildingId) params.append('buildingId', buildingId);
        return api.get(url1, null);
    } catch (error) {
        console.log('Error Fetching Agrregate', error);
    }
};
export const getIaqTableData = (params: any) => {
    const baseUrl = `/devices/all`;
    return api.get(baseUrl, params);
};

async function getCsvdownload(deviceId: any, start_time: any, end_time: any, interval: any) {
    const url = `${serverDomains.flask}/iaq/interval-csv`;
    const params = { deviceId, start_time, end_time, interval };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    };
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        const responseData = await response.text();
        return responseData;
    } catch (error) {
        console.error('Error fetching params data:', error);
        throw error;
    }
}

export const getCsvdownload1 = async (params: any) => {
    const url = `${config.DEVICE_CONTROL_API}/iaq/interval-csv`;

    try {
        const response = await axios.post(url, params, { responseType: 'blob' });
        // const response = await api.create(url, params);
        return response;
    } catch (error) {
        console.error('Error fetching params data:', error);
        throw error;
    }
};

export const fetchDevicesList1 = async (
    deviceTypeId?: string,
    customerId?: string,
    floorId?: string,
    buildingId?: string
) => {
    try {
        const baseUrl = `/devices/all`;
        const params = new URLSearchParams();
        if (customerId) params.append('customerId', customerId);
        if (deviceTypeId) params.append('deviceTypeId', deviceTypeId);
        if (floorId) params.append('floorId', floorId);
        if (buildingId) params.append('buildingId', buildingId);

        const url = `${baseUrl}?${params.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export { getCsvdownload };

export const downloadExcel = async () => {
    try {
        const url = `http://192.168.1.124:2001/api/v1/iaq/interval-csv`;
        const body = {
            customer_id: '6698e2d415023def020a7c45',
            start_time: '2025-04-10',
            end_time: '2025-04-11',
            interval: 'daily',
        };
        const res = await axios.post(url, body, { responseType: 'blob' });
        // console.log('res', res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getAlerts = (customerId?: string, buildingId?: string) => {
    try {
        // console.log('Alerts api', customerId);
        const deviceTypeId = '6690ef7fdeb2b486e92011aa';
        let url = `/devices/offdevices`;
        const searchParam = new URLSearchParams();
        searchParam.append('deviceTypeId', deviceTypeId);
        if (buildingId) searchParam.append('buildingId', buildingId);
        if (customerId) {
            searchParam.append('customerId', customerId);
        }
        url = `https://apiv1.claircoair.com/api/v1/devices/offdevices?${searchParam.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
