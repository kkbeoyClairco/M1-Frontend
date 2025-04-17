import { APICore } from 'helpers/api/apiCore';
import { floor } from '../customer';

const api = new APICore();
export const getZonesListAttachedToFloor = async (floorId: string) => {
    try {
        let url = `/zones/all?`;
        const searchParams = new URLSearchParams();
        searchParams.append('floorId', floorId);
        const response = api.get(url + searchParams.toString(), null);
        return response;
    } catch (error) {
        // return;
    }
};
