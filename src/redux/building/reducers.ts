import { BuildingActionTypes } from './constants';
import { BuildingActionType } from './actions';
import { mapIdToName } from 'utils/claircoFunctions';
const INIT_STATE = {
    buildings: null,
    buildingMap: new Map<string,string>(),
    loading: false,
};
type State = {
    buildings: any;
    buildingMap:Map<string,string>;
    loading: boolean;
};

const Building = (state: State = INIT_STATE, action: BuildingActionType) => {
    switch (action.type) {
        case BuildingActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case BuildingActionTypes.GET_AllBUILDINGS:
                    return {
                        ...state,
                        buildings: action.payload.data,
                        buildingMap: mapIdToName(action.payload.data,state.buildingMap),
                        loading: false,
                    };
                default:
                    return { ...state };
            }
        case BuildingActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case BuildingActionTypes.GET_AllBUILDINGS:
                    return { ...state, error: action.payload.error };
                default:
                    return { ...state };
            }
        case BuildingActionTypes.ADD_BUILDING:
            return {
                ...state,
                buildings:action.payload.data,
                buildingMap: mapIdToName(action.payload.data,state.buildingMap),
            };
        case BuildingActionTypes.UPDATE_BUILDING:
            return {
                ...state,
                buildings:[...state.buildings ,action.payload.data],
                buildingMap: mapIdToName([...state.buildings ,action.payload.data],state.buildingMap),
            }
        default:
            return { ...state };
    }
};

export default Building;
