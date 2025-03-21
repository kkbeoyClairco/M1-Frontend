import {  ZoneActionTypes } from './constants';

export type ZoneActionType = {
    type:
        | ZoneActionTypes.API_RESPONSE_SUCCESS
        | ZoneActionTypes.API_RESPONSE_ERROR
        | ZoneActionTypes.ADD_ZONE
        | ZoneActionTypes.UPDATE_ZONE
        | ZoneActionTypes.DELETE_ZONE
        | ZoneActionTypes.GET_AllZONES;

    payload: {
        actionType?: string;
        data?: any;
        error?: string;
    };
};
export const setZones = (data:any) =>({
    type:ZoneActionTypes.ADD_ZONE,
    payload:{data}
});

export const updateZones  = (data:any) =>({
    type:ZoneActionTypes.UPDATE_ZONE,
    payload:{data}
})
export const deleteZones  = (data:any) =>({
    type:ZoneActionTypes.DELETE_ZONE,
    payload:{data}
})
export const getAllZones = () => ({
    type: ZoneActionTypes.GET_AllZONES,
});

export const ZoneApiResponseSuccess = (actionType: string, data: any): ZoneActionType => ({
    type: ZoneActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});

export const ZoneApiResponseFailure = (actionType: string, error: string): ZoneActionType => ({
    type: ZoneActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});
