import { DeviceActionTypes } from './constants';

export type DeviceActionType = {
    type:
        | DeviceActionTypes.ADD_DEVICE
        | DeviceActionTypes.API_RESPONSE_ERROR
        | DeviceActionTypes.API_RESPONSE_SUCCESS
        | DeviceActionTypes.GET_DEVICES
        | DeviceActionTypes.DELETE_DEVICE
        | DeviceActionTypes.UPDATE_DEVICE
        | DeviceActionTypes.GET_DEVICE_TYPES
    payload: {
        actionType?: string;
        data?: any;
        error?:any;
    };
};


export const setDevices = (data:any) =>({
    type:DeviceActionTypes.ADD_DEVICE,
    payload:{data}
});

export const getDevices = ()=>({
    type:DeviceActionTypes.GET_DEVICES
})
export const deviceApiResponseError = (actionType:string,error:any):DeviceActionType=>({
    type:DeviceActionTypes.API_RESPONSE_ERROR,
    payload:{actionType,error}
});

export const deviceApiResponseSuccess = (actionType:string , data:any) : DeviceActionType =>({
    type:DeviceActionTypes.API_RESPONSE_SUCCESS,
    payload:{actionType,data}
});

export const getDeviceTypes = ()=>({
    type:DeviceActionTypes.GET_DEVICE_TYPES,
})