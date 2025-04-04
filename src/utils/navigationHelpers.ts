// IAQ
export const getIaqURL = (data: any) => {
    try {
        const name = data?.name ?? '';
        const buildingName = data?.buildingId?.name ?? '';
        const locationName = data?.locationId?.name ?? '';
        const floorName = data?.floorId?.name ?? '';
        const buildingId = data?.buildingId?.id ?? '';
        const deviceId = data?.id ?? '';
        const customerId = data?.customerId?.id;
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);
        searchParam.append('deviceId', deviceId);
        searchParam.append('customerId', customerId);
        searchParam.append('building', buildingName);
        searchParam.append('buildingId', buildingId);
        let url = `${searchParam.toString()}`;
        return url;
    } catch (error) {
        return '';
    }
};

// AHU
export const getAHUUrl = (data: any) => {
    try {
        const id = data?.id;
        const buildingName = data?.buildingId.name ?? '';
        const floorName = data?.floorId?.name ?? '';
        const floorId = data?.floorId?.id;
        const location = data?.buildingId?.location ?? '';
        const sensorName = data?.switchDeviceId?.name ?? '';
        const ahuName = data?.name ?? '';
        const btuName = data?.btuDeviceId?.name ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('location', location);
        searchParam.append('building', buildingName);
        searchParam.append('floorName', floorName);
        searchParam.append('ahuName', ahuName);
        searchParam.append('btuSensor', btuName);
        searchParam.append('ahuSensor', sensorName);
        searchParam.append('ahuId', id);
        searchParam.append('floorId', floorId);
        return searchParam.toString();
    } catch (error) {
        return '';
    }
};

// Thermopile
export const getThermopileUrl = (data: any) => {
    try {
        const sensorName = data?.name ?? '';
        const building = data?.buildingId?.name ?? '';
        const location = data?.buildingId?.location ?? '';
        const zone = data?.zoneId?.name ?? '';
        const searchParams = new URLSearchParams();
        searchParams.append('building', building);
        searchParams?.append('location', location);
        searchParams?.append('zone', zone);
        searchParams?.append('deviceName', sensorName);
        let url = searchParams?.toString();
        return url.toString();
    } catch (error) {
        return '';
    }
};

// PIR
export const getPIRUrl = (data: any) => {
    try {
        const searchParam = new URLSearchParams();
        const {
            name = '',
            buildingId: { name: buildingName = '' } = {},
            floorId: { name: floorName = '' } = {},
            zoneId: { name: zoneName = '' } = {},
        } = data;
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('zoneName', zoneName);
        searchParam.append('floor', floorName);
        let url = `${searchParam.toString()}`;
        return url.toString();
    } catch (error) {
        return '';
    }
};

// Indoor Devices
export const getVRFIndoorUrl = (data: any) => {
    try {
        const { buildingId = {}, floorId = {} } = data || {};
        const name = data?.name || '';
        const buildingName = buildingId?.name ?? '';
        const locationName = buildingId?.location ?? '';
        const floorName = floorId?.name ?? '';
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);
        let url = `${searchParam.toString()}`;
        return url.toString();
    } catch (error) {
        return '';
    }
};

// Outdoor Devices

export const getVRFOutdoorUrl = (data: any) => {
    try {
        const { buildingId = {}, floorId = {} } = data || {};
        const name = data?.name || '';
        const buildingName = buildingId?.name ? buildingId?.name : '';
        const locationName = buildingId?.location ?? '';
        const floorName = floorId?.name ? floorId?.name : '';
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);
        let url = `${searchParam.toString()}`;
        return url.toString();
    } catch (error) {
        return '';
    }
};

// EnergyMeter

export const getEneryMeterUrl = (data: any) => {
    try {
        const {
            name = '',
            buildingId: { name: buildingName = '' } = { name: '' },
            locationId: { name: locationName = '' } = { name: '' },
            floorId: { name: floorName = '' } = { name: '' },
        } = data || {};
        const searchParam = new URLSearchParams();
        searchParam.append('name', name);
        searchParam.append('building', buildingName);
        searchParam.append('location', locationName);
        searchParam.append('floor', floorName);
        let url = `${searchParam.toString()}`;
        return url.toString();
    } catch (error) {
        return '';
    }
};
