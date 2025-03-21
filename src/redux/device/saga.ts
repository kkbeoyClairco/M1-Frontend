import {call,put ,all,fork ,takeEvery} from 'redux-saga/effects';
import {device} from '../../helpers/api/services/Clairco/device';
import { DeviceActionTypes } from './constants';
import { deviceApiResponseSuccess,deviceApiResponseError } from './actions';
import { SagaIterator } from 'redux-saga';


function* getDevices():SagaIterator{
    try {
        const response = yield call(device.all);
        const devices = response?.data;
        yield put(deviceApiResponseSuccess(DeviceActionTypes.GET_DEVICES,devices));
    } catch (error) {
        yield put(deviceApiResponseError(DeviceActionTypes.GET_DEVICES,error));
    }
}

function* getDeviceTypes():SagaIterator{
    try {
        const response = yield call(device.types);
        const deviceTypes = response?.data;
        yield put(deviceApiResponseSuccess(DeviceActionTypes.GET_DEVICE_TYPES,deviceTypes));
    } catch (error) {
        yield put(deviceApiResponseError(DeviceActionTypes.GET_DEVICE_TYPES,error));
    }
}

function* watchGetDevices(){
    yield takeEvery(DeviceActionTypes.GET_DEVICES,getDevices)
}

function* watchGetDeviceTypes(){
    yield takeEvery(DeviceActionTypes.GET_DEVICE_TYPES,getDeviceTypes)
}
function* deviceSage(){
    yield all([fork(watchGetDevices) ,fork(watchGetDeviceTypes)])
}

export default deviceSage;