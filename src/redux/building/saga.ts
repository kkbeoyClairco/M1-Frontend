import { call, all, put, fork, takeEvery } from 'redux-saga/effects';
import { BuildingActionTypes } from './constants';
import { buildingApiResponseSuccess, buildingApiResponseFailure } from './actions';
import { building } from 'helpers/api/services/Clairco/customer';
import { SagaIterator } from '@redux-saga/core';
function* getBuildingList(): SagaIterator {
    try {
        const resposne = yield call(building.all);
        const buildings = resposne.data;
        yield put(buildingApiResponseSuccess(BuildingActionTypes.GET_AllBUILDINGS, buildings));
    } catch (error: any) {
        yield put(
            buildingApiResponseFailure(BuildingActionTypes.GET_AllBUILDINGS, error?.message || 'Something went wrong!')
        );
    }
}
function* watchGetAllBuldings() {
    yield takeEvery(BuildingActionTypes.GET_AllBUILDINGS, getBuildingList);
}
function* buildingSaga() {
    yield all([fork(watchGetAllBuldings)]);
}

export default buildingSaga;
