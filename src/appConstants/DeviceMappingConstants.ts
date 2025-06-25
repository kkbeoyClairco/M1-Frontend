export const fanSpeedReverseMapping: { [key: number]: string } = {
    0: 'Auto',
    1: 'Low',
    2: 'Low+',
    3: 'Med',
    4: 'Med+',
    5: 'High',
};
export const deviceModesReverseMapping: { [key: number]: string } = {
    1: 'Auto',
    2: 'Heat',
    3: 'Dry',
    4: 'Fan',
    5: 'Cool',
    6: 'AutoHeat',
    7: 'AutoCool',
};

export const AHUModeReverseMapping: { [key: number]: string } = {
    1: 'Cool',
    2: 'Heat',
    3: 'Ventilation',
};

// Device Id Map
export const deviceTypeId: { [key: string]: string } = {
    'VRV/VRF': '6690f11bd90262f91784da81',
    Occupancy: '6690f12ed90262f91784da83',
    'VRV/VRF Indoor': '669f7a7a7c0832407259f7c9',
    'VRV/VRF Outdoor': '669f7a827c0832407259f7ca',
    IAQ: '6690ef7fdeb2b486e92011aa',
    'Energy Meter': '66a891781827e777d25fc180',
    AHU: '66d015995b0bbb913bf9936d',
    PIR: '675fcbb8279a996259411943',
};

//Device Id to Device TYpe- Reverse Mapping
export const deviceTypeIdReverseMapping: { [key: string]: string } = {
    '6690f11bd90262f91784da81': 'VRV/VRF',
    '6690f12ed90262f91784da83': 'Occupancy',
    '669f7a7a7c0832407259f7c9': 'VRV/VRF Indoor',
    '669f7a827c0832407259f7ca': 'VRV/VRF Outdoor',
    '6690ef7fdeb2b486e92011aa': 'IAQ',
    '66a891781827e777d25fc180': 'Energy Meter',
    '66d015995b0bbb913bf9936d': 'AHU',
    '675fcbb8279a996259411943': 'PIR',
};

export const deviceTypesConstant: { [key: string]: string } = {
    VRV_VRF_INDOOR: 'VRV/VRF Indoor',
    VRV_VRF_OUTDOOR: 'VRV/VRF Outdoor',
    IAQ: 'IAQ',
    AHU: 'AHU',
    BTU: 'BTU',
    OCCUPANCY: 'Occupancy',
    ENERGY_METER: 'Energy Meter',
    DPT: 'DPT',
    PIR: 'PIR',
    SWITCH: 'Switches',
    GATEWAY: 'Gateway',
};

// Needs to verify // MODIFY_ALERT
export const deviceTypesReverseConstant: { [key: string]: string } = {
    'VRV/VRF Indoor': 'VRV_VRF_INDOOR',
    'VRV/VRF Outdoor': 'VRV_VRF_OUTDOOR',
    IAQ: 'IAQ',
    AHU: 'AHU',
    BTU: 'BTU',
    Occupancy: 'OCCUPANCY',
    'Energy Meter': 'ENERGY_METER',
    DPT: 'DPT',
    PIR: 'PIR',
    Switches: 'SWITCH',
    Gateway: 'GATEWAY',
};
