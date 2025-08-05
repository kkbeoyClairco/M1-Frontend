import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {
    selectShapes,
    selectSelectedShapeId,
    selectSelectedShape,
    selectActiveDeviceType,
    selectDeviceTypes,
    selectCanUndo,
    selectCanRedo,
} from './floorPlan/floorPlanSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for floor plan state
export const useFloorPlan = () => {
    const dispatch = useAppDispatch();
    const floorPlanState = useAppSelector((state) => state.floorPlan);

    return {
        ...floorPlanState,
        dispatch,
    };
};

// Custom hook for shapes selection and manipulation - updated for device types
export const useShapes = () => {
    const shapes = useAppSelector(selectShapes); // Gets shapes for active device type
    const selectedShapeId = useAppSelector(selectSelectedShapeId);
    const selectedShape = useAppSelector(selectSelectedShape);
    const activeDeviceType = useAppSelector(selectActiveDeviceType);

    return {
        shapes,
        selectedShapeId,
        selectedShape,
        activeDeviceType,
        filteredShapes: (filter: any) => shapes.filter(filter),
    };
};

// Custom hook for device types
export const useDeviceTypes = () => {
    const activeDeviceType = useAppSelector(selectActiveDeviceType);
    const availableDeviceTypes = useAppSelector(selectDeviceTypes);

    return {
        activeDeviceType,
        availableDeviceTypes,
    };
};

// Custom hook for drawing tools
export const useDrawingTools = () => {
    const drawingTool = useAppSelector((state) => state.floorPlan.drawingTool);
    const isDrawing = useAppSelector((state) => state.floorPlan.isDrawing);

    return {
        drawingTool,
        isDrawing,
    };
};

// Custom hook for floor plan view (scale, offset)
export const useFloorPlanView = () => {
    const scale = useAppSelector((state) => state.floorPlan.scale);
    const offset = useAppSelector((state) => state.floorPlan.offset);
    const floorPlanImage = useAppSelector((state) => state.floorPlan.floorPlanImage);

    return {
        scale,
        offset,
        floorPlanImage,
    };
};

// Custom hook for history (undo/redo) - updated for device type specific history
export const useFloorPlanHistory = () => {
    const canUndo = useAppSelector(selectCanUndo);
    const canRedo = useAppSelector(selectCanRedo);

    return {
        canUndo,
        canRedo,
    };
};
