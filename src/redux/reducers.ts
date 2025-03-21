import { combineReducers } from 'redux';
import Auth from './auth/reducers';
import Layout from './layout/reducers';
import HomePageReducer from './homePage/reducers';
// <<<<<<< HEAD
// export default combineReducers({
//     Auth,
//     Layout,
//     HomePageReducer,
// =======
import Customer from './customer/reducers';
import Building from './building/reducers';
import Floor from './floor/reducers';
import Zone from './zone/reducers';
import Device from './device/reducres';

export default combineReducers({
    Auth,
    Layout,
    HomePageReducer,
    Customer,
    Building,
    Floor,
    Zone,
    Device,
    // >>>>>>> feature_Admin
});
