import { HomePageActionTypes } from './constants';

export type HomePageActionType = {
    type: // | HomePageActionTypes.API_RESPONSE_SUCCESS
    // | HomePageActionTypes.API_RESPONSE_ERROR
    // | HomePageActionTypes.USER_LOGGED_IN
    | HomePageActionTypes.FETCH_BUILDING_SUCCESS
        | HomePageActionTypes.FETCH_BUILDING_REQUEST
        | HomePageActionTypes.FETCH_BUILDING_FAILURE
        | HomePageActionTypes.FETCH_FLOOR_REQUEST
        | HomePageActionTypes.FETCH_FLOOR_SUCCESS
        | HomePageActionTypes.FETCH_FLOOR_FAILURE;

    payload: {} | string;
};

// Action creators
//Buildings
export const fetchBuildingsRequest = (userId: string): HomePageActionType => ({
    type: HomePageActionTypes.FETCH_BUILDING_REQUEST,
    payload: {
        userId,
    },
});

export const fetchBuildingsSuccess = (data: any) => ({
    type: HomePageActionTypes.FETCH_BUILDING_SUCCESS,
    payload: data,
});
export const fetchBuildingsFailure = (error: any) => ({
    type: HomePageActionTypes.FETCH_BUILDING_FAILURE,
    payload: error,
});
export const setBuildingSelected = (buildingId: string, buildingName: string) => ({
    type: HomePageActionTypes.SET_ACTIVE_BUILDING,
    payload: { buildingId, buildingName },
});

//Floors
export const fetchFloorsRequest = (buildingId: string, customerId: string) => ({
    type: HomePageActionTypes.FETCH_FLOOR_REQUEST,
    payload: { buildingId, customerId },
});
export const fetchFloorsSuccess = (data: any) => ({
    type: HomePageActionTypes.FETCH_FLOOR_SUCCESS,
    payload: data,
});
export const fetchFloorsFailure = (error: any) => ({
    type: HomePageActionTypes.FETCH_FLOOR_FAILURE,
    payload: error,
});
export const setSelectedFloor = (floorId: string, floorName: string, activeDevices: string[], layout: string) => ({
    type: HomePageActionTypes.SET_ACTIVE_FLOOR,
    payload: {
        floorId,
        floorName,
        activeDevices,
        layout,
    },
});
