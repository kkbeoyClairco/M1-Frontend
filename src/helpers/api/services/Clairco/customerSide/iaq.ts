import { MODIFY_ALERT, serverDomains } from 'appConstants/claircoConstants';
import { APICore } from 'helpers/api/apiCore';
import { getDateNow } from 'utils/timeFunctions';
const api = new APICore();

export const getIaqData = (params: any) => {
    // MODIFY_ALERT

    const baseUrl = `http://192.168.29.8:4446/api/v1/devices/sens-data`;
    return api.get(baseUrl, params);
};

export const getIaqAggregate = (sensorName: string, buildingId: string, deviceId: string) => {
    try {
        const dateNow = getDateNow();
        // http://3.7.82.174:4446/api/v1/devices
        // MODIFY_ALERT
        const url1 = `http://192.168.29.8:4446/api/v1/devices/iaq/${sensorName}/data?date=${dateNow}&buildingId=${buildingId}&deviceId=${deviceId}`;
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

export const getCsvdownload1 = async (
    params: any
    // deviceId: any, start_time: any, end_time: any, interval: any
) => {
    // http://3.7.82.174:5001/api/v1
    const url = `/iaq/interval-csv`;

    // console.log('params', params);

    try {
        const response = await api.create(url, params);
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
