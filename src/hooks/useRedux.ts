import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from 'redux/store';

export default function useRedux() {
    const dispatch = useDispatch<AppDispatch>();
    // Use any for legacy compatibility during transition
    const appSelector: TypedUseSelectorHook<any> = useSelector;
    return { dispatch, appSelector };
}
