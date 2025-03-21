import { FloorActionTypes } from './constants';

export type FloorActionType = {
    type:
        | FloorActionTypes.API_RESPONSE_SUCCESS
        | FloorActionTypes.API_RESPONSE_ERROR
        | FloorActionTypes.ADD_FLOOR
        | FloorActionTypes.UPDATE_FLOOR
        | FloorActionTypes.DELETE_FLOOR
        | FloorActionTypes.GET_AllFLOORS;

    payload: {
        actionType?: string;
        data?: any;
        error?: string;
    };
};
export const setFloors = (data:any) =>({
    type:FloorActionTypes.ADD_FLOOR,
    payload:{data}
});

export const updateFloors = (data:any) =>({
    type:FloorActionTypes.UPDATE_FLOOR,
    payload:{data}
})

export const deleteFloors = (data:any) =>({
    type:FloorActionTypes.DELETE_FLOOR,
    payload:{data}
})
export const getAllFloors = () => ({
    type: FloorActionTypes.GET_AllFLOORS,
});

export const floorApiResponseSuccess = (actionType: string, data: any): FloorActionType => ({
    type: FloorActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});

export const floorApiResponseFailure = (actionType: string, error: string): FloorActionType => ({
    type: FloorActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});
