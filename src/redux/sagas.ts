import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import homePageSaga from './homePage/saga';
// <<<<<<< HEAD
// export default function* rootSaga() {
//     yield all([authSaga(), layoutSaga(), homePageSaga()]);
// =======
import customerSaga from './customer/saga';
import buildingSaga from './building/saga';
import deviceSage from './device/saga';
export default function* rootSaga() {
    yield all([authSaga(), layoutSaga(), deviceSage(), homePageSaga(), customerSaga(), buildingSaga()]);
    // >>>>>>> feature_Admin
}
