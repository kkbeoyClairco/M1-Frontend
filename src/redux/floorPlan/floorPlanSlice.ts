import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { FloorPlanState } from 'types/whiteBoard/entity';
// Define the shape interface (same as in your types.ts)
import { Shape } from 'types/whiteBoard/shapes'; // ← Import from centralized types
import { FloorPlanState } from 'types/whiteBoard/entity'; // ← Import FloorPlanState too

// export interface Shape {
//     id: string;
//     type: 'rectangle' | 'circle' | 'polygon';
//     x: number;
//     y: number;
//     width?: number;
//     height?: number;
//     radius?: number;
//     points?: number[];
//     fill?: string;
//     stroke?: string;
//     strokeWidth?: number;
//     opacity?: number;
//     draggable?: boolean;
//     name?: string;
//     deviceType: string;
//     // IoT-specific properties
//     deviceId?: string;
//     sensorType?: string;
//     metadata?: Record<string, any>;
// }

// export interface FloorPlanState {
//     // Device type based shape organization
//     deviceTypes: {
//         [deviceType: string]: {
//             shapes: Shape[];
//             history: Shape[][];
//             historyIndex: number;
//         };
//     };
//     // Active device type being displayed/edited
//     activeDeviceType: string;
//     selectedShapeId: string | null;
//     drawingTool: 'rectangle' | 'circle' | 'polygon' | null;
//     isDrawing: boolean;
//     floorPlanImage: string | null;
//     scale: number;
//     offset: { x: number; y: number };
//     // Data for shapes
//     // shapeData: Record<string, any>;
// }

const initialState: FloorPlanState = {
    deviceTypes: {
        'VRV/VRF': { shapes: [], history: [[]], historyIndex: 0 },
        AHU: { shapes: [], history: [[]], historyIndex: 0 },
        Occupancy: { shapes: [], history: [[]], historyIndex: 0 },
    },
    activeDeviceType: 'VRV/VRF',
    selectedShapeId: null,
    drawingTool: null,
    isDrawing: false,
    floorPlanImage: null,
    scale: 1,
    offset: { x: 0, y: 0 },
    // shapeData: {},
};

const floorPlanSlice = createSlice({
    name: 'floorPlan',
    initialState,
    reducers: {
        // Device type management
        setActiveDeviceType: (state, action: PayloadAction<string>) => {
            const deviceType = action.payload;

            // Automatically create device type if it doesn't exist
            if (!state.deviceTypes[deviceType]) {
                state.deviceTypes[deviceType] = {
                    shapes: [],
                    history: [[]],
                    historyIndex: 0,
                };
            }

            state.activeDeviceType = deviceType;
            state.selectedShapeId = null; // Clear selection when switching device types
        },

        // Add a new device type explicitly
        addDeviceType: (state, action: PayloadAction<string>) => {
            const deviceType = action.payload;
            if (!state.deviceTypes[deviceType]) {
                state.deviceTypes[deviceType] = {
                    shapes: [],
                    history: [[]],
                    historyIndex: 0,
                };
            }
        },

        // Remove a device type (with confirmation)
        removeDeviceType: (state, action: PayloadAction<string>) => {
            const deviceType = action.payload;
            if (state.deviceTypes[deviceType]) {
                delete state.deviceTypes[deviceType];

                // If we deleted the active device type, switch to the first available one
                if (state.activeDeviceType === deviceType) {
                    const availableTypes = Object.keys(state.deviceTypes);
                    state.activeDeviceType = availableTypes.length > 0 ? availableTypes[0] : 'VRV/VRF';

                    // Create default if no types exist
                    if (availableTypes.length === 0) {
                        state.deviceTypes['VRV/VRF'] = { shapes: [], history: [[]], historyIndex: 0 };
                        state.activeDeviceType = 'VRV/VRF';
                    }
                }

                state.selectedShapeId = null;
            }
        },

        // Shape management - now operates on active device type
        addShape: (state, action: PayloadAction<Shape>) => {
            const activeType = state.activeDeviceType;
            if (!state.deviceTypes[activeType]) {
                state.deviceTypes[activeType] = { shapes: [], history: [[]], historyIndex: 0 };
            }

            state.deviceTypes[activeType].shapes.push(action.payload);

            // Add to history for undo/redo
            const deviceTypeState = state.deviceTypes[activeType];
            deviceTypeState.history = deviceTypeState.history.slice(0, deviceTypeState.historyIndex + 1);
            deviceTypeState.history.push([...deviceTypeState.shapes]);
            deviceTypeState.historyIndex = deviceTypeState.history.length - 1;
        },

        updateShape: (state, action: PayloadAction<{ id: string; updates: Partial<Shape> }>) => {
            const { id, updates } = action.payload;
            const activeType = state.activeDeviceType;
            const deviceTypeState = state.deviceTypes[activeType];

            if (deviceTypeState) {
                const shapeIndex = deviceTypeState.shapes.findIndex((shape) => shape.id === id);
                if (shapeIndex !== -1) {
                    deviceTypeState.shapes[shapeIndex] = { ...deviceTypeState.shapes[shapeIndex], ...updates };

                    // Add to history
                    deviceTypeState.history = deviceTypeState.history.slice(0, deviceTypeState.historyIndex + 1);
                    deviceTypeState.history.push([...deviceTypeState.shapes]);
                    deviceTypeState.historyIndex = deviceTypeState.history.length - 1;
                }
            }
        },

        deleteShape: (state, action: PayloadAction<string>) => {
            const activeType = state.activeDeviceType;
            const deviceTypeState = state.deviceTypes[activeType];

            if (deviceTypeState) {
                deviceTypeState.shapes = deviceTypeState.shapes.filter((shape) => shape.id !== action.payload);
                if (state.selectedShapeId === action.payload) {
                    state.selectedShapeId = null;
                }

                // Remove associated data
                // delete state.shapeData[action.payload];

                // Add to history
                deviceTypeState.history = deviceTypeState.history.slice(0, deviceTypeState.historyIndex + 1);
                deviceTypeState.history.push([...deviceTypeState.shapes]);
                deviceTypeState.historyIndex = deviceTypeState.history.length - 1;
            }
        },

        selectShape: (state, action: PayloadAction<string | null>) => {
            state.selectedShapeId = action.payload;
        },

        clearShapes: (state) => {
            const activeType = state.activeDeviceType;
            if (state.deviceTypes[activeType]) {
                state.deviceTypes[activeType].shapes = [];
                state.deviceTypes[activeType].history = [[]];
                state.deviceTypes[activeType].historyIndex = 0;
            }
            state.selectedShapeId = null;
            // Clear shape data for active device type
            // Object.keys(state.shapeData).forEach((key) => {
            //     if (key.startsWith(activeType)) {
            //         delete state.shapeData[key];
            //     }
            // });
        },

        clearAllDeviceTypes: (state) => {
            Object.keys(state.deviceTypes).forEach((deviceType) => {
                state.deviceTypes[deviceType] = { shapes: [], history: [[]], historyIndex: 0 };
            });
            state.selectedShapeId = null;
            // state.shapeData = {};
        },

        // Drawing tool management
        setDrawingTool: (state, action: PayloadAction<'rectangle' | 'circle' | 'polygon' | null>) => {
            state.drawingTool = action.payload;
            if (action.payload) {
                state.selectedShapeId = null; // Deselect when starting to draw
            }
        },

        setIsDrawing: (state, action: PayloadAction<boolean>) => {
            state.isDrawing = action.payload;
        },

        // Floor plan image
        setFloorPlanImage: (state, action: PayloadAction<string | null>) => {
            state.floorPlanImage = action.payload;
        },

        // View management
        setScale: (state, action: PayloadAction<number>) => {
            state.scale = Math.max(0.1, Math.min(5, action.payload)); // Limit scale between 0.1 and 5
        },

        setOffset: (state, action: PayloadAction<{ x: number; y: number }>) => {
            state.offset = action.payload;
        },

        // // Shape data (for IoT values)
        // updateShapeData: (state, action: PayloadAction<{ shapeId: string; data: any }>) => {
        //     const { shapeId, data } = action.payload;
        //     state.shapeData[shapeId] = { ...state.shapeData[shapeId], ...data };
        // },

        // setShapeData: (state, action: PayloadAction<{ shapeId: string; data: any }>) => {
        //     const { shapeId, data } = action.payload;
        //     state.shapeData[shapeId] = data;
        // },

        // History management (undo/redo) - now per device type
        undo: (state) => {
            const activeType = state.activeDeviceType;
            const deviceTypeState = state.deviceTypes[activeType];

            if (deviceTypeState && deviceTypeState.historyIndex > 0) {
                deviceTypeState.historyIndex -= 1;
                deviceTypeState.shapes = [...deviceTypeState.history[deviceTypeState.historyIndex]];
                state.selectedShapeId = null;
            }
        },

        redo: (state) => {
            const activeType = state.activeDeviceType;
            const deviceTypeState = state.deviceTypes[activeType];

            if (deviceTypeState && deviceTypeState.historyIndex < deviceTypeState.history.length - 1) {
                deviceTypeState.historyIndex += 1;
                deviceTypeState.shapes = [...deviceTypeState.history[deviceTypeState.historyIndex]];
                state.selectedShapeId = null;
            }
        },

        // Batch operations
        loadFloorPlan: (
            state,
            action: PayloadAction<{ deviceType: string; shapes: Shape[]; floorPlanImage?: string }>
        ) => {
            const { deviceType, shapes, floorPlanImage } = action.payload;

            if (!state.deviceTypes[deviceType]) {
                state.deviceTypes[deviceType] = { shapes: [], history: [[]], historyIndex: 0 };
            }

            state.deviceTypes[deviceType].shapes = shapes;
            state.selectedShapeId = null;
            if (floorPlanImage) {
                state.floorPlanImage = floorPlanImage;
            }

            // Reset history for this device type
            state.deviceTypes[deviceType].history = [shapes];
            state.deviceTypes[deviceType].historyIndex = 0;
        },

        loadAllDeviceTypes: (
            state,
            action: PayloadAction<{ deviceTypes: Record<string, Shape[]>; floorPlanImage?: string }>
        ) => {
            const { deviceTypes, floorPlanImage } = action.payload;

            Object.entries(deviceTypes).forEach(([deviceType, shapes]) => {
                state.deviceTypes[deviceType] = {
                    shapes,
                    history: [shapes],
                    historyIndex: 0,
                };
            });

            state.selectedShapeId = null;
            if (floorPlanImage) {
                state.floorPlanImage = floorPlanImage;
            }
        },

        // Reset state
        resetFloorPlan: () => initialState,
    },
});

// Export actions
export const {
    setActiveDeviceType,
    addDeviceType,
    removeDeviceType,
    addShape,
    updateShape,
    deleteShape,
    selectShape,
    clearShapes,
    clearAllDeviceTypes,
    setDrawingTool,
    setIsDrawing,
    setFloorPlanImage,
    setScale,
    setOffset,
    // updateShapeData,
    // setShapeData,
    undo,
    redo,
    loadFloorPlan,
    loadAllDeviceTypes,
    resetFloorPlan,
} = floorPlanSlice.actions;

// Export reducer
export default floorPlanSlice.reducer;

// Selectors - Updated for new device-type-based structure
export const selectActiveDeviceType = (state: { floorPlan: FloorPlanState }) => state.floorPlan.activeDeviceType;

export const selectDeviceTypes = (state: { floorPlan: FloorPlanState }) => Object.keys(state.floorPlan.deviceTypes);

export const selectShapes = (state: { floorPlan: FloorPlanState }) => {
    const { activeDeviceType, deviceTypes } = state.floorPlan;
    return deviceTypes[activeDeviceType]?.shapes || [];
};

export const selectShapesByDeviceType = (state: { floorPlan: FloorPlanState }, deviceType: string) => {
    return state.floorPlan.deviceTypes[deviceType]?.shapes || [];
};

export const selectAllShapes = (state: { floorPlan: FloorPlanState }) => {
    const allShapes: { [deviceType: string]: Shape[] } = {};
    Object.entries(state.floorPlan.deviceTypes).forEach(([deviceType, typeState]) => {
        allShapes[deviceType] = typeState.shapes;
    });
    return allShapes;
};

export const selectSelectedShapeId = (state: { floorPlan: FloorPlanState }) => state.floorPlan.selectedShapeId;

export const selectSelectedShape = (state: { floorPlan: FloorPlanState }) => {
    const { activeDeviceType, deviceTypes, selectedShapeId } = state.floorPlan;
    const shapes = deviceTypes[activeDeviceType]?.shapes || [];
    return selectedShapeId ? shapes.find((shape: Shape) => shape.id === selectedShapeId) : null;
};

export const selectDrawingTool = (state: { floorPlan: FloorPlanState }) => state.floorPlan.drawingTool;
export const selectIsDrawing = (state: { floorPlan: FloorPlanState }) => state.floorPlan.isDrawing;
export const selectFloorPlanImage = (state: { floorPlan: FloorPlanState }) => state.floorPlan.floorPlanImage;
export const selectScale = (state: { floorPlan: FloorPlanState }) => state.floorPlan.scale;
export const selectOffset = (state: { floorPlan: FloorPlanState }) => state.floorPlan.offset;

// export const selectShapeData = (state: { floorPlan: FloorPlanState }, shapeId: string) =>
//     state.floorPlan.shapeData[shapeId];

export const selectCanUndo = (state: { floorPlan: FloorPlanState }) => {
    const { activeDeviceType, deviceTypes } = state.floorPlan;
    return deviceTypes[activeDeviceType]?.historyIndex > 0;
};

export const selectCanRedo = (state: { floorPlan: FloorPlanState }) => {
    const { activeDeviceType, deviceTypes } = state.floorPlan;
    const deviceTypeState = deviceTypes[activeDeviceType];
    return deviceTypeState ? deviceTypeState.historyIndex < deviceTypeState.history.length - 1 : false;
};

// New selectors for device type specific data
export const selectDeviceTypeShapeCount = (state: { floorPlan: FloorPlanState }, deviceType: string) => {
    return state.floorPlan.deviceTypes[deviceType]?.shapes.length || 0;
};

export const selectTotalShapeCount = (state: { floorPlan: FloorPlanState }) => {
    return Object.values(state.floorPlan.deviceTypes).reduce((total, typeState) => total + typeState.shapes.length, 0);
};

export const selectDeviceTypeExists = (state: { floorPlan: FloorPlanState }, deviceType: string) => {
    return !!state.floorPlan.deviceTypes[deviceType];
};

export const selectAllDeviceTypesWithCounts = (state: { floorPlan: FloorPlanState }) => {
    return Object.entries(state.floorPlan.deviceTypes).map(([deviceType, typeState]) => ({
        deviceType,
        shapeCount: typeState.shapes.length,
        isActive: deviceType === state.floorPlan.activeDeviceType,
    }));
};
