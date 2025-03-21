import { APICore } from 'helpers/api/apiCore';
const api = new APICore();

export const user = {
    all: async () => {
        const baseUrl = `/customers/users/all`;
        return await api.get(baseUrl, null);
    },
    types: async () => {},
    create: async(payload: any) => {
        const baseUrl = `/customers/${payload.customerId}/users`;
        return await api.create(baseUrl, payload);
    },
    update: async(payload: any) => {
        const baseUrl = `/customers/${payload.customerId}/users/${payload.userId}`;
        return await api.updatePatch(baseUrl, payload);
    },
    delete: async(payload: any) => {
        const baseUrl = `/customers/${payload.customerId}/users/${payload.userId}`;
        return await api.delete(baseUrl);
    },
};

