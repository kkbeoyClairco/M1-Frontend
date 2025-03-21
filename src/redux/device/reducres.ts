import { DeviceActionTypes } from './constants';
import { DeviceActionType } from './actions';
import { mapNameToId , mapIdToName } from 'utils/claircoFunctions';
const INIT_STATE = {
    devices: null,
    idToDeviceName: new Map<string,string>(),
    deviceNameToId: new Map<string, string>(),

};

type State = {
    devices: any;
    idToDeviceName: Map<string, string>;
    deviceNameToId: Map<string,string>;
};
const Device = (state: State = INIT_STATE ,action: DeviceActionType) => {
    switch (action.type) {
        case DeviceActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case DeviceActionTypes.GET_DEVICES:
                    return {
                        ...state,
                        devices: action.payload.data,
                    };
                case DeviceActionTypes.GET_DEVICE_TYPES:
                    return{
                        ...state,
                        idToDeviceName:mapIdToName(action.payload.data,state.idToDeviceName),
                        deviceNameToId:mapNameToId(action.payload.data,state.deviceNameToId),
                    }
                default:
                    return { ...state };
            }
        case DeviceActionTypes.ADD_DEVICE:
            return {
                ...state,
                devices: action.payload.data,
            };
        default:
            return { ...state };
    }
};

export default Device;