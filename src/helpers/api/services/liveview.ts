import { APICore } from "../apiCore";


const api = new APICore();

export const getLiveviewData = (params: any = null) => {
    const baseUrl = ``;
    return api.get(baseUrl, params);
};


 
 