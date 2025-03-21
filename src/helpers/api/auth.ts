import { APICore } from './apiCore';
import { endPoints } from 'appConstants';
const api = new APICore();

function login(params: { email: string; password: string }) {
    const baseUrl = '/login/';
    return api.create(`${baseUrl}`, params);
}
function sensiablelogin(params: { email: string; password: string }) {
    const baseUrl = '/login';
    console.log(baseUrl);
    return api.create(`${baseUrl}`, params);
}
function claircoCustomerlogin(credentials: { email: string; password: string }) {
    return api.create(`${endPoints.ADMIN_lOGIN}`, credentials);
}
function logout() {
    const baseUrl = '/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { username: string }) {
    const baseUrl = '/forget-password/';
    return api.create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params: { email: string }) {
    const baseUrl = '/password/reset/confirm/';
    return api.create(`${baseUrl}`, params);
}

export { claircoCustomerlogin, sensiablelogin, login, logout, signup, forgotPassword, forgotPasswordConfirm };
