import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from 'redux/store';

// Compatibility hook that maintains the old state structure
export default function useRedux() {
    const dispatch = useDispatch<AppDispatch>();

    // Create a compatibility layer that maps the new state structure to the old one
    const appSelector: TypedUseSelectorHook<any> = (selector) => {
        return useSelector((state: RootState) => {
            // Create a compatibility state object that matches the old structure
            const compatibilityState = {
                ...state.legacy, // Spread all legacy state at the root level
                floorPlan: state.floorPlan, // Add the new floor plan state
            };
            return selector(compatibilityState);
        });
    };

    return { dispatch, appSelector };
}

// Also export the new typed hooks for components that want to use them
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
