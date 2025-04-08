import { fork, put } from 'redux-saga/effects';
import { all, call, takeEvery } from 'redux-saga/effects';
import { HomePageActionTypes } from './constants';
import { SagaIterator } from 'redux-saga';
import { fetchInitialLoadingData, fetchListOfFloors } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import {
    fetchBuildingsSuccess,
    fetchBuildingsFailure,
    setBuildingSelected,
    fetchFloorsSuccess,
    setSelectedFloor,
    fetchFloorsFailure,
} from './actions';

type HomePageData = {
    payload: {
        userId: string;
    };
    type: string;
};

type BuildingSelectionChangeType = {
    payload: {
        buildingId: string;
        customerId: string;
    };
    type: string;
};

function* homePageLoading({ payload: { userId }, type }: HomePageData): SagaIterator {
    try {
        if (!userId) return;
        // Fetching Building list
        const response = yield call(fetchInitialLoadingData, userId);
        const buildingsList = response?.data;
        const { id: buildingId, name: buildingName } = buildingsList?.[0] || { id: null, name: null };
        yield put(setBuildingSelected(buildingId, buildingName));
        yield put(fetchBuildingsSuccess(buildingsList));
        // Fetching Floors List
        const floorsRes: { data: any } = yield call(fetchListOfFloors, buildingsList?.[0]?.id, userId);
        const { data: floorData } = floorsRes;
        const { id: floorId = '', name: floorName = '', layout = '' } = floorData?.[0];
        const activeDevices = floorData?.[0]?.deviceTypeId ?? [];
        // console.log('Home Page inital call:', activeDevices, floorsRes);

        yield put(fetchFloorsSuccess(floorData));
        yield put(setSelectedFloor(floorId, floorName, activeDevices, layout));
    } catch (error: any) {
        yield put(fetchBuildingsFailure(error.message));
        console.error('Error fetching initial loading data:', error);
    }
}
// function* watchBuildingSelectedChangesSaga() {
//     yield takeEvery(
//         HomePageActionTypes.FETCH_FLOOR_REQUEST,
//         function* ({ payload: { buildingId, customerId } }: BuildingSelectionChangeType) {
//             // console.log('Building id selected', buildingId, customerId);
//             // yield put(setBuildingSelected(buildingId, ''));
//             const response: { data: any } = yield call(fetchListOfFloors, buildingId, customerId);
//             const { data } = response;
//             yield put(fetchFloorsSuccess(data));
//             // console.log('Login Data:', response);
//         }
//     );
// }

// //Function that watches Floor selections and excecute the subsequent api calls
// function* watchFloorSelectionChanges() {
//     yield takeEvery(HomePageActionTypes.SET_ACTIVE_FLOOR, function* ({ payload: { floorId, floorName } }: any) {
//         console.log('Flood id and floorname', floorId, floorName);
//     });
// }

// function* watchSetBuildingSelection() {
//     yield takeEvery(
//         HomePageActionTypes.SET_ACTIVE_BUILDING,
//         function* ({ payload: { buildingId, buildingName, customerId } }: any) {
//             console.log('Yield', buildingId, buildingName);
//             // const floorsRes: { data: any } = yield call(fetListOfFloors, buildingsList[0].id, userId);
//         }
//     );
// }
function* watchFloorRequests() {
    yield takeEvery(HomePageActionTypes.FETCH_FLOOR_REQUEST, function* ({ payload: { buildingId, customerId } }: any) {
        if (!customerId || !buildingId) return;
        try {
            const response: { data: any } = yield call(fetchListOfFloors, buildingId, customerId);
            const {
                id: floorId = '',
                name: floorName = '',
                deviceTypeId: deviceTypes = [],
                layout: layout = '',
            } = response?.data[0] || { id: null, name: null, deviceTypes: [] };
            yield put(fetchFloorsSuccess(response?.data));
            yield put(setSelectedFloor(floorId, floorName, deviceTypes, layout));
        } catch (error) {
            const errorMessage = (error as Error).message || 'Failed to fetch floors';
            console.error('Error fetching floors:', errorMessage);
            yield put(fetchFloorsFailure(errorMessage));
        }
    });
}

// function* watchBuildingSelectedChangesSaga() {
//     yield takeEvery(
//         HomePageActionTypes.SET_ACTIVE_BUILDING,
//         function* ({ payload: { buildingId } }: BuildingSelectionChangeType) {
//             // console.log('Building id selected', buildingId);
//             yield put(setBuildingSelected(buildingId));
//         }
//     );
// }

export function* watchHomePageLoading() {
    yield takeEvery(HomePageActionTypes.FETCH_BUILDING_REQUEST, homePageLoading);
}

function* homePageSaga() {
    yield all([
        fork(watchHomePageLoading),
        // fork(watchBuildingSelectedChangesSaga),
        fork(watchFloorRequests),
    ]);
}

//Add customer addition,
export default homePageSaga;
