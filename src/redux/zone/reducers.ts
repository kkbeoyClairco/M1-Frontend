import {  ZoneActionTypes } from './constants';
import {  ZoneActionType } from './actions';
import { mapIdToName } from 'utils/claircoFunctions';
const INIT_STATE = {
    zones: null,
    zoneMap: new Map<string,string>(),
};
type State = {
    zones: any;
    zoneMap:Map<string,string>;
};

const Zone = (state: State = INIT_STATE, action: ZoneActionType) => {
    switch (action.type) {
        case ZoneActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ZoneActionTypes.GET_AllZONES:
                    return {
                        ...state,
                        floors: action.payload.data,
                        floorMap: mapIdToName(action.payload.data,state.zoneMap),
                        
                    };
                default:
                    return { ...state };
            }
        case ZoneActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case ZoneActionTypes.GET_AllZONES:
                    return { ...state, error: action.payload.error };
                default:
                    return { ...state };
            }
        case ZoneActionTypes.ADD_ZONE:
            return {
                ...state,
                zones:action.payload.data,
                zoneMap: mapIdToName(action.payload.data,state.zoneMap),
            };
        case ZoneActionTypes.UPDATE_ZONE:
            return{
                ...state,
                zones:[...state.zones,action.payload.data],
                zoneMap: mapIdToName([...state.zones,action.payload.data],state.zoneMap),
            }
        default:
            return { ...state };
    }
};

export default Zone;
