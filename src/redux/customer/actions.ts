import { CustomerActionTypes } from './constants';
export type CusotmerActionType = {
    type:
        | CustomerActionTypes.ADD_CUSTOMER
        | CustomerActionTypes.UPDATE_CUSTOMER
        | CustomerActionTypes.API_RESPONSE_ERROR
        | CustomerActionTypes.API_RESPONSE_SUCCESS
        | CustomerActionTypes.DELETE_CUSTOMER
        | CustomerActionTypes.GET_CUSTOMERS;
    payload: {
        actionType?: string;
        data?: any;
        error?: string;
    };
};

export const setCustomers = (data: any) => ({
    type: CustomerActionTypes.ADD_CUSTOMER,
    payload:{data}
});

export const getCustomers = () => ({
    type: CustomerActionTypes.GET_CUSTOMERS,
});

export const updateCustomer = (data: any) => ({
        type: CustomerActionTypes.UPDATE_CUSTOMER,
        payload:{data}
});

export const deleteCustomers = (data:any)=>({
    type:CustomerActionTypes.DELETE_CUSTOMER,
    payload:{data}  
})

export const customerApiResponseSuccess = (actionType: string, data: any): CusotmerActionType => ({
    type: CustomerActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const customerApiResponseError = (actionType: string, error: string): CusotmerActionType => ({
    type: CustomerActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});
