import { APICore } from 'helpers/api/apiCore';
const api = new APICore();
export const getDevices = async (deviceTypeId: string, floorId?: string) => {
    try {
        // let url = `/devices/by-filter`;
        let url = `/devices/all?`;
        const searchParams = new URLSearchParams();
        if (deviceTypeId) {
            searchParams.append('deviceType', deviceTypeId);
        }
        if (floorId) {
            searchParams.append('floorId', floorId);
            // url = url + searchParams.toString();
        }
        url = url + searchParams.toString();
        const res = api.get(url, null);
        return res;
    } catch (error) {
        console.log(error);
    }
};
// const express={}
// express.

export const getDeviceTypeList = async (customerId?: string) => {
    try {
        let url = `deviceType/all`;
        const searchParams = new URLSearchParams();
        if (customerId) {
            searchParams.append('customerId', customerId);
            // url = url + searchParams.toString();
        }
        url = url + searchParams.toString();
        const res = api.get(url, null);
        return res;
    } catch (error) {
        console.log(error);
    }
};
