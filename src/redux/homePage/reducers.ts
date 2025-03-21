import { HomePageActionTypes } from './constants';

interface HomePageState {
    buildingData: any[];
    floorData: any[];
    activeBuilding: any;
    activeFloor: any;
    isLoading: boolean;
    error: any;
}
const initialState: HomePageState = {
    buildingData: [],
    floorData: [],
    activeBuilding: {},
    activeFloor: {},
    // zoneData: null,
    isLoading: false,
    error: null,
};

function HomePageReducer(state = initialState, action: any) {
    switch (action.type) {
        case HomePageActionTypes.FETCH_BUILDING_SUCCESS:
            return {
                ...state,
                buildingData: action.payload,
                // activeBuilding: 0,
                // isLoading: false,
                // floorData: action.payload.floorData,
                // zoneData: action.payload.zoneData,
            };
        case HomePageActionTypes.SET_ACTIVE_BUILDING:
            return {
                ...state,
                activeBuilding: action.payload,
            };
        case HomePageActionTypes.FETCH_BUILDING_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case HomePageActionTypes.FETCH_FLOOR_SUCCESS:
            return {
                ...state,
                floorData: action.payload,
                // activeFloor: 0,
            };
        case HomePageActionTypes.SET_ACTIVE_FLOOR:
            return {
                ...state,
                activeFloor: action.payload,
            };
        case HomePageActionTypes.FETCH_FLOOR_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default HomePageReducer;
