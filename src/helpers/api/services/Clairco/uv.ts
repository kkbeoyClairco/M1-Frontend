import { APICore } from 'helpers/api/apiCore';
const api = new APICore();
// http://apiv2.claircoair.com/api/v1
export const addBuilding = (customerId: string, params: any = null) => {
    const baseUrl = `/customers/6513d19603a5fa06a7700c73/buildings`;
    return api.create(baseUrl, params);
};

export const getBuildingList = (customerId: string, params: any = null) => {
    const baseUrl = `/customers/${customerId}/buildings`;
    return api.get(baseUrl, params);
};

export const getFloorList = (customerId: string, buildingId: string, params: any = null) => {
    const baseUrl = `/customers/${customerId}/buildings/${buildingId}/floors`;
    return api.get(baseUrl, params);
};

export const fetchUvdevices = (customerId: string, buildingId: string, floorId: string, params: any = null) => {
    const baseUrl = `/devices/uv?customerId=${customerId}&buildingId=${buildingId}&floorId=${floorId}`;
    return api.get(baseUrl, params);
};

export const getUvData = (id: string, params: any = null) => {
    const baseUrl = `/devices/uv/data/${id}`;
    return api.get(baseUrl, params);
};
