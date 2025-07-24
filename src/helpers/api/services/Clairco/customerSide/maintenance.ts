import { APICore } from 'helpers/api/apiCore';
import { building } from '../customer';
import axios from 'axios';

const api = new APICore();

//Fetch Maintenance logs for Tables
export const fetchMaintenanceLogs = async (customerId?: string) => {
    try {
        let url = '/maintenanceLogs/all';
        if (customerId) {
            const searchParams = new URLSearchParams();
            searchParams.append('customerId', customerId);
            url = url + `?${searchParams.toString()}`;
        }
        const res = await api.get(url, null);
        return res;
    } catch (error) {
        console.log(error);
    }
};

// Fetch data of the Technician List

export const getTechnicianList = async () => {
    try {
        const res = await api.get('/technician', null);
        return res;
    } catch (error) {
        console.error(error);
    }
};

export const getCustomersList = async () => {
    try {
        const res = await api.get('/customers/all', null);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getBuildingListWithCustomerId = async (customerId: string) => {
    try {
        const res = await api.get(`/customers/${customerId}/buildings`, null);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getFloorListWithBuildingId = async (customerId: string, buildingId: string) => {
    try {
        const res = await api.get(`/customers/${customerId}/buildings/${buildingId}/floors/`, null);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getDeviceTypeList = async () => {
    try {
        const res = await api.get(`/deviceType/all`, null);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createNewMaintenanceLog = async (data: any) => {
    try {
        const url = `/maintenanceLogs`;
        const res = await axios.post(url, data, {
            headers: {
                // 'Content-Type': 'multipart/form-data',
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};
