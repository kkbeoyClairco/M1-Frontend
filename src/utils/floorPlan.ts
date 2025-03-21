// Getting green and Red ids for Occupancy

import { MODIFY_ALERT, THIRTY_MINUTES_INTERVAL } from 'appConstants/claircoConstants';
import { deviceTypeId, deviceTypeIdReverseMapping } from 'appConstants/DeviceMappingConstants';
import { convertUnixToIST } from './timeFunctions';

export const getGreenAndRedForOccupancy = async (data: any) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        // MODIFY_ALERT -Reinstate the time based filteration
        let greenElementsOccu: any = data
            .filter(
                (doc: any) =>
                    doc?.deviceType === deviceTypeId['Occupancy'] &&
                    doc?.rawData?.occupancy?.metaData?.occupancy_number !== 0 &&
                    typeof doc?.rawData?.occupancy?.metaData?.occupancy_number === 'number'
                // &&
                // Number(currentTime - doc.rawData?.occupancy?.epochTime) < THIRTY_MINUTES_INTERVAL
            )
            .map((doc: any) => doc.id);
        if (!greenElementsOccu) greenElementsOccu = [];
        let redElementsOccu: any =
            data
                .filter(
                    (doc: any) => doc?.rawData?.occupancy?.metaData?.occupancy_number === 0
                    //  &&
                    //     Number(currentTime - doc?.rawData?.occupancy?.epochTime) < THIRTY_MINUTES_INTERVAL
                )
                .map((doc: any) => doc?.id) || [];
        if (!redElementsOccu) redElementsOccu = [];

        return { greenElementsOccu, redElementsOccu };
    } catch (error) {
        console.log('Error filtering Occupancy Active and inactive', error);
        return { greenElementsOccu: [], redElementsOccu: [] };
    }
};

// Getting green and Red ids for VRF
export const getGreenAndRedForVRF = async (data: any) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        // MODIFY_ALERT add time interval filteration which is commented out right now
        const greenElementsVRF =
            data
                .filter(
                    (doc: any) => doc?.rawData?.indoor?.Status === 'ON'
                    // &&
                    // Number(currentTime - doc?.rawData?.indoor?.['Epoch time']) < THIRTY_MINUTES_INTERVAL
                )
                .map((doc: any) => doc?.id) ?? [];

        const redElementsVRF =
            data
                .filter(
                    (doc: any) => doc?.rawData?.indoor?.Status === 'OFF'
                    // &&
                    // Number(currentTime - doc?.rawData?.indoor?.['Epoch time']) < THIRTY_MINUTES_INTERVAL
                )
                .map((doc: any) => doc?.id) ?? [];
        return { greenElementsVRF, redElementsVRF };
    } catch (error) {
        console.log('Error filtering active and inactive for Vrf');
        return { greenElementsVRF: [], redElementsVRF: [] };
    }
};

// Getting green and Red AHU

export const getGreenAndRedForAHU = async (ahuData: any) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);

        const greenElementsAHU =
            ahuData
                .filter(
                    (doc: any) => doc?.rawData?.ahuRawData?.data?.['RELAY1_STATE'] == 1
                    //  &&
                    // Number(currentTime - doc.rawData?.ahuRawData['Epoch time']?.['$numberDecimal']) <
                    //     THIRTY_MINUTES_INTERVAL
                )
                .map((doc: any) => doc?.id) ?? [];

        const redElementsAHU =
            ahuData
                .filter(
                    (doc: any) => Number(doc?.rawData?.ahuRawData?.data?.RELAY1_STATE) === 0
                    // &&
                    //     Number(currentTime - doc.rawData?.ahuRawData['Epoch time']?.['$numberDecimal']) <
                    //         THIRTY_MINUTES_INTERVAL
                )
                .map((doc: any) => doc?.id) ?? [];

        return { greenElementsAHU, redElementsAHU };
    } catch (error) {
        console.log('Error extracting AHU active and inactive', error);
        return { greenElementsAHU: [], redElementsAHU: [] };
    }
};

// Extracting occupants device id to count
export const getOccupancyToolTipData = async (data: any) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);

        let occupantsDataToTooltip =
            data.reduce(
                (
                    accu: any[],
                    doc: {
                        deviceId: string;
                        name: string;
                        id: string;
                        epochTime: number;
                        zoneName: string;
                        rawData: { occupancy: { metaData: { occupancy_number: number }; epochTime: string } };
                    }
                ) => {
                    const isDeviceOnline = true;
                    // currentTime - Number(doc?.rawData?.occupancy?.epochTime) < THIRTY_MINUTES_INTERVAL;

                    const extracted = {
                        name: doc?.zoneName,
                        id: doc.id,
                        epochTime: convertUnixToIST(doc?.rawData?.occupancy?.epochTime ?? ''),
                        count: isDeviceOnline ? doc.rawData?.occupancy?.metaData.occupancy_number : 'Na',
                    };
                    accu.push(extracted);
                    // accu[doc.deviceId] = doc.metaData.occupancy_number || 0;
                    return accu;
                },
                []
            ) ?? [];
        return occupantsDataToTooltip;
    } catch (error) {
        console.log('Error extracting Occupancy tooltip data', error);
        return [];
    }
};

export const getVrvToolTipData = async (data: any) => {
    try {
        const deviceDataTooltip = data.reduce((accu: any[], doc: any) => {
            const extracted = {
                name: doc.aliasName,
                ...doc?.rawData?.indoor,
                id: doc?.id,
            };
            accu.push(extracted);
            return accu;
        }, []);
        return deviceDataTooltip;
    } catch (error) {
        console.log('Error extracting Indoor unit toop tip data', error);
        return [];
    }
};

export const getAhuToolTipData = async (data: any) => {
    try {
        const extracted = data.reduce((accu: any[], doc: any) => {
            const extracted = {
                // name: doc?.rawData?.ahuRawData,
                name: doc?.name,
                ...doc?.rawData?.ahuRawData,
                id: doc?.id,
            };
            accu.push(extracted);
            return accu;
        }, []);
        return extracted;
    } catch (error) {
        console.log(error);
        return [];
    }
};
