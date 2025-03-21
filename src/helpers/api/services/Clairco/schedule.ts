import { APICore } from 'helpers/api/apiCore';
import { update } from 'lodash';
const api = new APICore();

export const schedule  = {
    all:()=>{
       const baseUrl = `/schedules/all`;
       return api.get(baseUrl, null);
    },
    byId:(params:any)=>{
      const baseUrl = `/schedules/${params.scheduleId}`;
      return api.get(baseUrl, null);

    },
    create:(payload:any)=>{
        const baseUrl = `/schedules/`;
        return api.create(baseUrl, payload);
    },
    update:(params:any,payload:any)=>{
        const baseUrl = `/schedules/${params.scheduleId}`;
        return api.update(baseUrl, payload);
    },
    delete:(params:any)=>{
        const baseUrl = `/schedules/${params.scheduleId}`;
        return api.delete(baseUrl);
    },
    deleteByDay:(params:any)=>{
        const baseUrl = `/schedules/${params.deviceId}/day/${params.day}`;
        return api.delete(baseUrl);
    },
    attach:(params:any,payload:any)=>{
        const baseUrl = `/schedules/attach/${params.deviceId}`;
        return api.update(baseUrl,payload);
    },
    override:(params:any,payload:any)=>{        
        const baseUrl = `/schedules/${params.deviceId}/${params.scheduleId}`;
        return api.updatePatch(baseUrl, payload);
    }
}