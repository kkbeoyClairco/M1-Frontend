import { serverDomains } from 'appConstants/claircoConstants';
import { APICore } from 'helpers/api/apiCore';

const api = new APICore();
// export const getPcsData = async (sensorName: string, startTime?: string, endTime?: string) => {
//     try {
//         const searchParams = new URLSearchParams();
//         searchParams.append('Sensor', sensorName);
//         if (startTime) {
//             searchParams.append('Data', 'raw');
//             searchParams.append('startTime', startTime.toString());
//         }
//         if (endTime) searchParams.append('endTime', endTime.toString());
//         const url = `${serverDomains.flask}/api/v1/pcs-realtime?${searchParams.toString()}`;
//         return api.get(url, null);
//     } catch (error) {
//         console.log(error);
//     }
// };

export const getPCSTraffic = async (sensor: string, timeFrame: 'day' | 'month', date?: string | Date) => {
    try {
        const searchParams = new URLSearchParams();
        if (sensor) searchParams.append('Sensor', sensor);
        if (timeFrame) searchParams.append('timeFrame', timeFrame);
        if (date) searchParams.append('date', date.toString());
        //127.0.0.1:2001
        // const url = `http://127.0.0.1:2001//api/v1/pcs-traffic?${searchParams.toString()}`;

        const url = `https://flask.claircoair.com//api/v1/pcs-traffic?${searchParams.toString()}`;
        return api.get(url, null);
        // ?Sensor=PCS_WS_W&timeFrame=day&date=2025-06-24'`
    } catch (error) {}
};
export const getPCSMonthlyTraffic = async (sensor: string) => {
    try {
        const searchParams = new URLSearchParams();
        if (sensor) searchParams.append('Sensor', sensor);
        // const url = `https://flask.claircoair.com/
        const url = `https://flask.claircoair.com//api/v1/pcs-monthly-stats?${searchParams.toString()}`;

        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
export const getPcsData = async (sensorName: string, startTime?: string, endTime?: string) => {
    try {
        const searchParams = new URLSearchParams();
        searchParams.append('Sensor', sensorName);
        if (startTime) {
            searchParams.append('Data', 'raw');
            searchParams.append('startTime', startTime.toString());
        }
        if (endTime) searchParams.append('endTime', endTime.toString());
        const url = `https://flask.claircoair.com/api/v1/pcs-realtime?${searchParams.toString()}`;
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
        const url = `${serverDomains.flask}/pcs-realtime?${searchParams.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
