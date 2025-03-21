import { CustomerActionTypes } from './constants';
import { CusotmerActionType } from './actions';
import { mapIdToName } from 'utils/claircoFunctions';

const INIT_STATE = {
    customers: null,
    customerMap: new Map<string, string>(),
    loading: false,
};

type State = {
    customers: any;
    customerMap: Map<string, string>;
    loading: boolean;
};

const Customer = (state: State = INIT_STATE, action: CusotmerActionType) => {
    switch (action.type) {
        case CustomerActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case CustomerActionTypes.GET_CUSTOMERS:
                    return {
                        ...state,
                        customerMap: mapIdToName(action.payload.data,state.customerMap),
                        customers: action.payload.data,
                        loading: false,
                    };
                default:
                    return state;
            }
        case CustomerActionTypes.ADD_CUSTOMER:
            return {
                ...state,
                customerMap: mapIdToName(action.payload.data,state.customerMap),
                customers: action.payload.data,
                loading: false,
            };
        case CustomerActionTypes.UPDATE_CUSTOMER:
            return{
                ...state,
                customers:[...state.customers , action.payload.data],
                customerMap: mapIdToName([...state.customers , action.payload.data],state.customerMap),
            }
        default:
            return state;
    }
};

export default Customer;
