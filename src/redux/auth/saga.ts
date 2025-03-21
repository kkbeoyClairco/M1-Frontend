import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import { APICore, setAuthorization } from 'helpers/api/apiCore';
import {
    sensiablelogin as sensiableloginApi,
    logout as logoutApi,
    signup as signupApi,
    forgotPassword as forgotPasswordApi,
} from 'helpers';
import { claircoCustomerlogin as claircoCustomerloginApi } from 'helpers/api/auth';
import { authApiResponseSuccess, authApiResponseError } from './actions';
import { AuthActionTypes } from './constants';

type UserData = {
    payload: {
        username: string;
        password: string;
        fullname: string;
        email: string;
    };
    type: string;
};

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* sensiablelogin({ payload: { email, password }, type }: UserData): SagaIterator {
    try {
        const response = yield call(claircoCustomerloginApi, { email, password });
        const user = response.data;
        // console.log('Login Data:', response);
        // NOTE - You can change this according to response format from your api
        api.setLoggedInUser(user);
        setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SENSIABLE_LOGIN_USER, user));
    } catch (error: any) {
        yield put(
            authApiResponseError(AuthActionTypes.SENSIABLE_LOGIN_USER, error?.message || 'Something went wrong!')
        );
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* claircoCustomerlogin({ payload: { email, password }, type }: UserData): SagaIterator {
    try {
        const response = yield call(claircoCustomerloginApi, { email, password });
        // console.log('Login Data:', response);
        const user = response?.data;
        api.setLoggedInUser(user);
        setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SENSIABLE_LOGIN_USER, user));
    } catch (error: any) {
        console.log('error login', error);
        yield put(authApiResponseError(AuthActionTypes.SENSIABLE_LOGIN_USER, error || 'Something went wrong!'));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}
/**
 * Logout the user
 */
function* logout(): SagaIterator {
    try {
        yield call(logoutApi);
        api.setLoggedInUser(null);
        setAuthorization(null);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
    }
}

function* signup({ payload: { fullname, email, password } }: UserData): SagaIterator {
    try {
        const response = yield call(signupApi, { fullname, email, password });
        const user = response.data;
        // api.setLoggedInUser(user);
        // setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* forgotPassword({ payload: { username } }: UserData): SagaIterator {
    try {
        const response = yield call(forgotPasswordApi, { username });
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
    }
}
export function* watchSensiableLoginUser() {
    yield takeEvery(AuthActionTypes.SENSIABLE_LOGIN_USER, claircoCustomerlogin);
}

export function* watchLogout() {
    yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup() {
    yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword() {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

function* authSaga() {
    yield all([fork(watchSensiableLoginUser), fork(watchLogout), fork(watchSignup), fork(watchForgotPassword)]);
}

export default authSaga;
