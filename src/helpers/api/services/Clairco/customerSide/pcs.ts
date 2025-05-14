import { serverDomains } from 'appConstants/claircoConstants';
import { APICore } from 'helpers/api/apiCore';

const api = new APICore();
export const getPcsData = async (sensorName: string, startTime?: string, endTime?: string) => {
    try {
        const searchParams = new URLSearchParams();
        searchParams.append('Sensor', sensorName);
        if (startTime) {
            searchParams.append('Data', 'raw');
            searchParams.append('startTime', startTime.toString());
        }
        if (endTime) searchParams.append('endTime', endTime.toString());
        const url = `${serverDomains.flask}/api/v1/pcs-realtime?${searchParams.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const getPCSAggregate = async (sensorName: string, startTime?: string, endTime?: string) => {
    try {
        const searchParams = new URLSearchParams();
        searchParams.append('Sensor', sensorName);
        if (startTime) {
            searchParams.append('Data', 'aggregate');
            searchParams.append('startTime', startTime.toString());
        }
        if (endTime) searchParams.append('endTime', endTime.toString());
        const url = `${serverDomains.flask}/api/v1/pcs-realtime?${searchParams.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
