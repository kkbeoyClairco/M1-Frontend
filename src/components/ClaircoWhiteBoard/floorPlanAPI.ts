import { useState, useEffect } from 'react';
import { 
    FloorPlan, 
    FloorPlanAPI, 
    FloorPlanListResponse, 
    SaveFloorPlanRequest, 
    SaveFloorPlanResponse,
    LiveData
} from './types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3001';

class FloorPlanService implements FloorPlanAPI {
    private wsConnection: WebSocket | null = null;
    private liveDataCallbacks: Map<string, (data: LiveData) => void> = new Map();

    /**
     * Get all floor plans for a building/floor
     */
    async getFloorPlans(buildingId: string, floorId?: string): Promise<FloorPlanListResponse> {
        const params = new URLSearchParams({ buildingId });
        if (floorId) params.append('floorId', floorId);

        const response = await fetch(`${API_BASE_URL}/floor-plans?${params}`);
        if (!response.ok) throw new Error('Failed to fetch floor plans');
        
        return await response.json();
    }

    /**
     * Get a specific floor plan by ID
     */
    async getFloorPlan(id: string): Promise<FloorPlan> {
        const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`);
        if (!response.ok) throw new Error('Failed to fetch floor plan');
        
        return await response.json();
    }

    /**
     * Save floor plan with shapes
     */
    async saveFloorPlan(request: SaveFloorPlanRequest): Promise<SaveFloorPlanResponse> {
        const response = await fetch(`${API_BASE_URL}/floor-plans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) throw new Error('Failed to save floor plan');
        
        return await response.json();
    }

    /**
     * Update existing floor plan
     */
    async updateFloorPlan(id: string, floorPlan: Partial<FloorPlan>): Promise<SaveFloorPlanResponse> {
        const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(floorPlan),
        });

        if (!response.ok) throw new Error('Failed to update floor plan');
        
        return await response.json();
    }

    /**
     * Delete floor plan
     */
    async deleteFloorPlan(id: string): Promise<{ success: boolean }> {
        const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete floor plan');
        
        return await response.json();
    }

    /**
     * Upload floor plan image
     */
    async uploadFloorPlanImage(file: File): Promise<{ 
        imageUrl: string; 
        dimensions: { width: number; height: number } 
    }> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/floor-plans/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload image');
        
        return await response.json();
    }

    /**
     * Get current live IoT data for a floor plan
     */
    async getLiveData(floorPlanId: string): Promise<LiveData> {
        const response = await fetch(`${API_BASE_URL}/live-data/${floorPlanId}`);
        if (!response.ok) throw new Error('Failed to fetch live data');
        
        return await response.json();
    }

    /**
     * Subscribe to live data updates via WebSocket
     */
    subscribeLiveData(floorPlanId: string, callback: (data: LiveData) => void): () => void {
        this.liveDataCallbacks.set(floorPlanId, callback);
        
        if (!this.wsConnection) {
            this.initializeWebSocket();
        }

        // Send subscription message
        if (this.wsConnection?.readyState === WebSocket.OPEN) {
            this.wsConnection.send(JSON.stringify({
                type: 'SUBSCRIBE_FLOOR_PLAN',
                floorPlanId
            }));
        }

        // Return unsubscribe function
        return () => {
            this.liveDataCallbacks.delete(floorPlanId);
            if (this.wsConnection?.readyState === WebSocket.OPEN) {
                this.wsConnection.send(JSON.stringify({
                    type: 'UNSUBSCRIBE_FLOOR_PLAN',
                    floorPlanId
                }));
            }
        };
    }

    /**
     * Initialize WebSocket connection for real-time updates
     */
    private initializeWebSocket(): void {
        this.wsConnection = new WebSocket(`${WS_BASE_URL}/live-data`);
        
        this.wsConnection.onopen = () => {
            console.log('WebSocket connected for live data');
        };

        this.wsConnection.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleWebSocketMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.wsConnection.onclose = () => {
            console.log('WebSocket disconnected, attempting to reconnect...');
            setTimeout(() => this.initializeWebSocket(), 5000);
        };

        this.wsConnection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    /**
     * Handle incoming WebSocket messages
     */
    private handleWebSocketMessage(message: any): void {
        switch (message.type) {
            case 'LIVE_DATA_UPDATE':
                const { floorPlanId, liveData } = message.payload;
                const callback = this.liveDataCallbacks.get(floorPlanId);
                if (callback) {
                    callback(liveData);
                }
                break;
                
            case 'SENSOR_UPDATE':
                // Handle individual sensor updates
                break;
                
            case 'DEVICE_STATUS_CHANGE':
                // Handle device status changes
                break;
                
            default:
                console.log('Unknown WebSocket message type:', message.type);
        }
    }

    /**
     * Close WebSocket connection
     */
    disconnect(): void {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
        this.liveDataCallbacks.clear();
    }
}

// Create singleton instance
export const floorPlanAPI = new FloorPlanService();

// React Hook for using the API
export const useFloorPlanAPI = () => {
    return floorPlanAPI;
};

// React Hook for live data subscription
export const useLiveData = (floorPlanId: string | null) => {
    const [liveData, setLiveData] = useState<LiveData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!floorPlanId) return;

        let unsubscribe: (() => void) | undefined;

        const setupSubscription = async () => {
            try {
                // Get initial data
                const initialData = await floorPlanAPI.getLiveData(floorPlanId);
                setLiveData(initialData);
                
                // Subscribe to updates
                unsubscribe = floorPlanAPI.subscribeLiveData(floorPlanId, (data) => {
                    setLiveData(data);
                    setIsConnected(true);
                });
                
            } catch (error) {
                console.error('Failed to setup live data subscription:', error);
                setIsConnected(false);
            }
        };

        setupSubscription();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            setIsConnected(false);
        };
    }, [floorPlanId]);

    return { liveData, isConnected };
};
