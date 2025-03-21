import { APICore } from 'helpers/api/apiCore';
const api = new APICore();

export const iaq = {
    all:async (params: any) => {
        const baseUrl = `/devices/all`;
        return await api.get(baseUrl, params);
    },
    dataById: async (params: any) => {
        const baseUrl = `/devices/sens-data`;
        return await api.get(baseUrl, params);
    },
};

