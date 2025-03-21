import {call, put ,all,fork, takeEvery} from 'redux-saga/effects'
import { customer } from 'helpers/api/services/Clairco/customer';
import { CustomerActionTypes } from './constants';
import {customerApiResponseSuccess,customerApiResponseError} from './actions';
import { SagaIterator } from '@redux-saga/core';

function* getCusomtersSaga(): SagaIterator{
    try {
        const response  =  yield call(customer.all);
        const customers = response?.data;
        yield put(customerApiResponseSuccess(CustomerActionTypes.GET_CUSTOMERS,customers));

    } catch (error:any) {
        yield put(customerApiResponseError(CustomerActionTypes.GET_CUSTOMERS,error?.message || 'Error Occure while Fetching cusotmers'))
        
    }
}

function* watchGetCustomer(){
    yield takeEvery(CustomerActionTypes.GET_CUSTOMERS, getCusomtersSaga);
}

function* customerSaga(){
   yield all([fork(watchGetCustomer)])
}
export default customerSaga;