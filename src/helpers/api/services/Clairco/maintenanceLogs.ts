import { APICore } from 'helpers/api/apiCore';
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
        const res = await api.get(`/buildings/customer/${customerId}`, null);
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
        // const bodyValues = {
        //     technicianId: data.technician,
        //     clientSupervisor: data.clientSupervisor,
        //     customerId: data.customer,
        //     buildingId: data.building,
        //     floorId: data.floor,
        //     deviceType: data.device,
        //     workDescription: data.description,
        //     workDoneImg: data.file,
        // };
        const url = `/maintenanceLogs`;
        // const url = `http://192.168.29.7:4446/api/v1/maintenanceLogs/`;
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
