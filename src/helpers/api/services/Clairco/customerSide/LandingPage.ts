import { APICore } from 'helpers/api/apiCore';
const api = new APICore();

export async function fetchInitialLoadingData(userId: string) {
    try {
        const url = `/customers/${userId}/buildings`;
        console.log('URL', url);
        // return
        let res;
        await api
            .get(url, null)
            .then((response) => {
                console.log('Res succs', response);
                res = response;
            })
            .catch((error) => {
                console.log('res error', error);
            });
        return res;
    } catch (error) {
        console.log(error);
    }
}

export function fetchListOfFloors(buildingId: string, customerId: string) {
    try {
        const url = `/customers/${customerId}/buildings/${buildingId}/floors/`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    } // console.log('fetListOfFloors:', buildingId);
}

export const fetchDevicesList = async (
    deviceType?: string,
    customerId?: string,
    floorId?: string,
    buildingId?: string
) => {
    try {
        const baseUrl = `/devices/all`;
        const params = new URLSearchParams();
        if (customerId) params.append('customerId', customerId);
        if (deviceType) params.append('deviceType', deviceType);
        if (floorId) params.append('floorId', floorId);
        if (buildingId) params.append('buildingId', buildingId);

        const url = `${baseUrl}?${params.toString()}`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const fetchCostSavingsDetails = async () => {
    try {
        const url = `/devices/energymeterSaving?sensorName=CEM24001`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};

export const fetchDataForLayout: any = async () => {
    try {
        //    voic: "66acc3256ab73fc122cbe82d"
        // panasonic:66aca7ceb180b45b2dfe62a9

        const url = `/devices/devlayout?floorId=66f69ef10b7e6d271d9949f4`;
        return api.get(url, null);
    } catch (error) {
        console.log(error);
    }
};
