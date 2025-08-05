import { Store, combineReducers } from 'redux';
import { configureStore as createRTKStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
// Import individual legacy reducers to maintain exact same state structure
import Auth from './auth/reducers';
import Layout from './layout/reducers';
import HomePageReducer from './homePage/reducers';
import Customer from './customer/reducers';
import Building from './building/reducers';
import Floor from './floor/reducers';
import Zone from './zone/reducers';
import Device from './device/reducres';
// RTK Slices
import floorPlanReducer from './floorPlan/floorPlanSlice';

// Create enhanced root reducer that maintains exact same state structure as before
// but adds the new RTK slice
const enhancedRootReducer = combineReducers({
    // All existing reducers exactly as they were
    Auth,
    Layout,
    HomePageReducer,
    Customer,
    Building,
    Floor,
    Zone,
    Device,
    floorPlan: floorPlanReducer,
});

const sagaMiddleware = createSagaMiddleware();
let store: Store;

export function configureStore(initialState = {}) {
    // Use RTK's configureStore for better dev tools and middleware setup
    const rtkStore = createRTKStore({
        reducer: enhancedRootReducer,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                // Disable RTK's default thunk middleware since we're using saga
                thunk: false,
                serializableCheck: {
                    // Ignore these action types for Konva objects which might not be serializable
                    ignoredActions: ['floorPlan/addShape', 'floorPlan/updateShape'],
                },
            }).concat(sagaMiddleware),
        devTools: process.env.NODE_ENV !== 'production',
    });

    // Run saga middleware
    sagaMiddleware.run(rootSaga);
    store = rtkStore;
    return rtkStore;
}

// Use any type for now to avoid type conflicts during transition
export type RootState = any; // Will be properly typed later during gradual migration
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof configureStore>;
