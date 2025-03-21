import { FloorActionTypes } from './constants';
import { FloorActionType } from './actions';
import { mapIdToName } from 'utils/claircoFunctions';
const INIT_STATE = {
    floors: null,
    floorMap: new Map<string,string>(),
};
type State = {
    floors: any;
    floorMap:Map<string,string>;
};

const Floor = (state: State = INIT_STATE, action: FloorActionType) => {
    switch (action.type) {
        case FloorActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case FloorActionTypes.GET_AllFLOORS:
                    return {
                        ...state,
                        floors: action.payload.data,
                        floorMap: mapIdToName(action.payload.data,state.floorMap),
                        
                    };
                default:
                    return { ...state };
            }
        case FloorActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case FloorActionTypes.GET_AllFLOORS:
                    return { ...state, error: action.payload.error };
                default:
                    return { ...state };
            }
        case FloorActionTypes.ADD_FLOOR:
            return {
                ...state,
                floors:action.payload.data,
                floorMap: mapIdToName(action.payload.data,state.floorMap),
            };
        case FloorActionTypes.UPDATE_FLOOR: 
            return{
                ...state,
                floors:[...state.floors , action.payload.data],
                floorMap: mapIdToName([...state.floors , action.payload.data],state.floorMap),
        }
        default:
            return { ...state };
    }
};

export default Floor;
