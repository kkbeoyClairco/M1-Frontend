import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { APICore } from 'helpers/api/apiCore';
const api = new APICore();
export async function getalldevice() {
    const baseUrl = `/devices/all`;
    return await api.get(baseUrl, null);
}
export const device = {
    all: async () => {
        const baseUrl = `/devices/all?`;
        return await api.get(baseUrl, null);
    },
    getDeviceList: async (deviceTypeId: string) => {
        const baseUrl = `/devices/all?deviceTypeId=${deviceTypeId}`;
        return await api.get(baseUrl, null);
    },
    customerDevices: async (customerId: string) => {
        const baseUrl = `/devices/all?customerId=${customerId}`;
        return await api.get(baseUrl, null);
    },
    floorDevices: async (floorId: string) => {
        const baseUrl = `/devices/all?floorId=${floorId}`;
        return await api.get(baseUrl, null);
    },
    byId: async () => {},
    byDeviceTypeId: (params: any) => {
        const baseUrl = `/devices/all?deviceTypeId=${params.deviceTypeId}`;
        return api.get(baseUrl, null);
    },
    types: async () => {
        const baseUrl = `/deviceType/all`;
        return await api.get(baseUrl, null);
    },
    create: async (params: any) => {
        const baseUrl = `/devices/`;
        return await api.create(baseUrl, params);
    },
    createInBulk: async (payload: any) => {
        let { deviceTypeId, ...devices } = payload;
        const baseUrl = `/devices/bulkInsert/${payload.deviceTypeId}`;
        return await api.create(baseUrl, devices);
    },
    update: async (params: any) => {
        const baseUrl = `/devices/`;
        return await api.update(baseUrl, params);
    },
    delete: async (params: any) => {
        const baseUrl = `/devices/`;
        return await api.delete(baseUrl);
    },
};

export const gateWay = {
    all: async () => {
        const baseUrl = `/gateways/all`;
        return await api.get(baseUrl, null);
    },
    byId: async (gateWayId: string) => {
        const baseUrl = `/gateways/${gateWayId}`;
        return await api.get(baseUrl, null);
    },
    create: async (payload: any) => {
        const baseUrl = `/gateways/`;
        return await api.create(baseUrl, payload);
    },
    update: async (params: any) => {
        const baseUrl = `/gateways/${params.gateWayId}`;
        return await api.updatePatch(baseUrl, params);
    },
    delete: async (params: any) => {
        const baseUrl = `/gateways/${params.gateWayId}`;
        return await api.delete(baseUrl);
    },
};
