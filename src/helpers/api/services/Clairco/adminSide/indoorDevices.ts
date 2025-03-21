import { APICore } from 'helpers/api/apiCore';

const api = new APICore();

// Indoor unit data fetching function- For Both Trends and Cards
export const getIndoorUnitLiveData = (deviceTypeId: string, sensorName: string, timeFrameInHours?: number | string) => {
    try {
        const baseUrl = `/devices/sens-data`;
        const params = new URLSearchParams();
        if (deviceTypeId) params.append('deviceTypeId', deviceTypeId);
        if (sensorName) params.append('sensorName', sensorName);
        if (timeFrameInHours) params.append('timeFrameInHours', timeFrameInHours?.toString());
        const url = `${baseUrl}?${params.toString()}`;

        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

// Fetch aggregate data for indoor unit
export const getArrgregateIndoorUnitData = (deviseName: string, timeInterval: string) => {
    const encodedDeviseName = encodeURI(deviseName);
    let baseUrl = `/devices/sens-aggr?sensorName=${encodedDeviseName}&timeFrameInHours=${timeInterval}`;
    return api.get(baseUrl, null);
};
