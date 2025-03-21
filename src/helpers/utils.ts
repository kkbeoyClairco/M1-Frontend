export const idToDeviceTypeNameMap = new Map([
    ['6690ef7fdeb2b486e92011aa', 'IAQ'],
    ['6690f11bd90262f91784da81', 'VRV/VRF'],
    ['6690f12ed90262f91784da83', 'Occupancy'],
    ['669f7a7a7c0832407259f7c9', 'VRV/VRF Indoor'],
    ['669f7a827c0832407259f7ca', 'VRV/VRF Outdoor'],
    ['66a891781827e777d25fc180', 'Energy Meter'],
    ['66a891841827e777d25fc181', 'Switches'],
]);

export const deviceTypeNameToIdMap = new Map([
    ['IAQ', '6690ef7fdeb2b486e92011aa'],
    ['VRV/VRF', '6690f11bd90262f91784da81'],
    ['Occupancy', '6690f12ed90262f91784da83'],
    ['VRV/VRF Indoor', '669f7a7a7c0832407259f7c9'],
    ['VRV/VRF Outdoor', '669f7a827c0832407259f7ca'],
    ['Energy Meter', '66a891781827e777d25fc180'],
    ['Switches', '66a891841827e777d25fc181'],
]);

export const assignDeviceType = (deviceType: string) => {
    if (idToDeviceTypeNameMap.has(deviceType)) {
        return idToDeviceTypeNameMap.get(deviceType);
    }
    if (deviceTypeNameToIdMap.has(deviceType)) {
        return deviceTypeNameToIdMap.get(deviceType);
    }
    return deviceType;
};

export const formatDateToLocalTime = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString();
};
