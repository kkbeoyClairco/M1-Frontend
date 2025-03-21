import Occupancy from 'pages/Sensiable-Dashboard/OccupancyTrends/Occupency';

const commonLabels = [
    { label: 'Name', value: 'name', type: 'input' },
    { label: 'Customer', value: 'customerId', type: 'select' },
    { label: 'Building', value: 'buildingId', type: 'select' },
    { label: 'Floor', value: 'floorId', type: 'select' },
    { label: 'Zone', value: 'zoneId', type: 'select' },
];

export const formConfig = {
    ahu: [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Alias', value: 'alias', type: 'input' },
        { label: 'GateWay Id', value: 'gatewayId', type: 'input' },
        { label: 'Parameters', value: 'parameters', type: 'list' },
        { label: 'Limits', value: 'limits', type: 'object' },
        { label: 'CalibrationValues', value: 'calibrationValues', type: 'object' },
    ],

    btu: [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Alias', value: 'alias', type: 'input' },
        { label: 'GateWay Id', value: 'gatewayId', type: 'input' },
        { label: 'Parameters', value: 'parameters', type: 'list' },
        { label: 'Limits', value: 'limits', type: 'object' },
        { label: 'CalibrationValues', value: 'calibrationValues', type: 'object' },
    ],

    iaq: [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Outdoor DeviceId (optional)', value: 'outdoorDeviceId', type: 'input' },
        { label: 'Parameters', value: 'parameters', type: 'list' },
        { label: 'Limits', value: 'limits', type: 'object' },
        { label: 'CalibrationValues', value: 'calibrationValues', type: 'object' },
    ],

    energymeter: [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Limits', value: 'limits', type: 'object' },
        { label: 'CalibrationValues', value: 'calibrationValues', type: 'object' },
        { label: 'DeviceModal', value: 'modelId', type: 'input' },
    ],

    'vrv/vrfindoor': [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Alias', value: 'aliasName', type: 'input' },
        { label: 'GateWay Id', value: 'gatewayId', type: 'input' },
        { label: 'Data Interval Time', value: 'dataIntervalTime', type: 'input' },
        { label: 'Parameters', value: 'parameters', type: 'list' },
        { label: 'Limits', value: 'limits', type: 'object' },
        { label: 'Salve ID', value: 'slaveId', type: 'input' },
        { label: 'DeviceModal ID', value: 'modelId', type: 'input' },
        { label: 'Parent outdoor VRF/VRV Device Id', value: 'parentDeviceId', type: 'input' },
    ],

    'vrv/vrfoutdoor': [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Alias', value: 'aliasName', type: 'input' },
        { label: 'GateWay Id', value: 'gatewayId', type: 'input' },
        { label: 'Parameters', value: 'parameters', type: 'list' },
        { label: 'Data Interval Time', value: 'dataIntervalTime', type: 'input' },
        { label: 'Limits', value: 'limits', type: 'object' },
        { label: 'Salve ID', value: 'slaveId', type: 'input' },
        { label: 'DeviceModal ID', value: 'modelId', type: 'input' },
    ],
    switches: [
        { label: 'Name', value: 'name', type: 'input' },
        // { label: 'Device Type', value: 'deviceType', type: 'select' },
        // { label: 'Customer', value: 'customerId', type: 'select' },
        // { label: 'floor', value: 'floorId', type: 'list' },
        { label: 'Topic', value: 'topic', type: 'input' },
        { label: 'Fan mode Dict', value: 'fanmodeDict', type: 'object' },
        { label: 'Mode Dict', value: 'modeDict', type: 'object' },
        { label: 'Key lock Dict', value: 'keylockDict', type: 'object' },
        { label: 'Relay One Dict', value: 'relayOneDict', type: 'object' },
        { label: 'Relay Two Dict', value: 'relayTwoDict', type: 'object' },
        { label: 'Thermostat Dict', value: 'THSTAT', type: 'object' },
    ],
    dpt: [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Parent Device Type', value: 'parentDeviceId', type: 'select' },
        // { label: 'Customer', value: 'customerId', type: 'select' },
        // { label: 'floor', value: 'floorId', type: 'list' },
        // { label: 'Topic', value: 'topic', type: 'input' },
        // { label: 'Fan mode Dict', value: 'fanmodeDict', type: 'object' },
        // { label: 'Mode Dict', value: 'modeDict', type: 'object' },
        // { label: 'Key lock Dict', value: 'keylockDict', type: 'object' },
        // { label: 'Relay One Dict', value: 'relayOneDict', type: 'object' },
        // { label: 'Relay Two Dict', value: 'relayTwoDict', type: 'object' },
        // { label: 'Thermostat Dict', value: 'THSTAT', type: 'object' },
    ],
    occupancy: [
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'DeviceModal ID', value: 'modelId', type: 'input' },
        { label: 'Parent Indoor Device', value: 'parentDeviceId', type: 'input' },
    ],
};
