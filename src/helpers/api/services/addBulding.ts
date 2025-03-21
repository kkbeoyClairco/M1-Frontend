import { APICore } from '../apiCore';

const api = new APICore();

export const addBuilding = (customerId: string, params: any = null) => {
    const baseUrl = `/customers/${customerId}/buildings`;
    return api.create(baseUrl, params);
};
