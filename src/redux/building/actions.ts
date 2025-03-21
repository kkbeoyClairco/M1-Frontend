import { BuildingActionTypes } from './constants';

export type BuildingActionType = {
    type:
        | BuildingActionTypes.API_RESPONSE_SUCCESS
        | BuildingActionTypes.API_RESPONSE_ERROR
        | BuildingActionTypes.ADD_BUILDING
        | BuildingActionTypes.UPDATE_BUILDING
        | BuildingActionTypes.DELETE_BUILDING
        | BuildingActionTypes.GET_AllBUILDINGS;

    payload: {
        actionType?: string;
        data?: any;
        error?: string;
    };
};
export const setBuildings = (data:any) =>({
    type:BuildingActionTypes.ADD_BUILDING,
    payload:{data}
});
export const updateBuildings = (data:any) =>({
        type:BuildingActionTypes.UPDATE_BUILDING,
        payload:{data}
})
export const deleteBuildings = (data:any) =>({
    type:BuildingActionTypes.DELETE_BUILDING,
    payload:{data}
})
export const getAllBuildings = () => ({
    type: BuildingActionTypes.GET_AllBUILDINGS,
});

export const buildingApiResponseSuccess = (actionType: string, data: any): BuildingActionType => ({
    type: BuildingActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});

export const buildingApiResponseFailure = (actionType: string, error: string): BuildingActionType => ({
    type: BuildingActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});
