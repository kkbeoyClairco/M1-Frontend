import { APICore } from "../apiCore";


const api = new APICore();

export const getChartData = (params: any = null) => {
    const baseUrl = ``;
    return api.get(baseUrl, params);
};



 
 