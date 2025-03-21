export const devices = [
    {
        deviceTypeName: 'IAQ',

        id: '6690ef7fdeb2b486e92011aa',
    },
    {
        deviceTypeName: 'VRV/VRF',

        id: '6690f11bd90262f91784da81',
    },
    {
        deviceTypeName: 'Occupancy',

        id: '6690f12ed90262f91784da83',
    },
];

// Device On or Off Status Mapped for Trends
export const deviceStatusConstant: { [key: string]: number } = {
    OFF: 1,
    ON: 2,
};

export const MODIFY_ALERT = 'MODIFY_ALERT';
// seconds for floor plan
export const THIRTY_MINUTES_INTERVAL = 600 * 3; //in seconds
export const TEN_MINUTES_INTERVAL = 600;

export const iconConstant = {
    customer: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741242720/customer_qmyusx.png`,
    folder: `https://res.cloudinary.com/dlulq6hny/image/upload/v1740465105/folder_wlkpgb.png`,
    play: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741090196/play_tjuy8k.png`,
    arrowDownDard: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741090197/down_mzdmhc.png`,
    device: 'https://res.cloudinary.com/dlulq6hny/image/upload/v1738217587/sensors_bbmpqg.png',
    offline: `https://res.cloudinary.com/dlulq6hny/image/upload/v1740747690/cloud_b0jx6r.png`,
    offline1: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741242381/no-signal_g28k7d.png`,
    user: `https://res.cloudinary.com/dlulq6hny/image/upload/v1740985860/user_ly53qk.png`,
    arrowUp: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001605/up-arrow_m9lzzm.png`,
    arrowDown: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001419/arrow-down-sign-to-navigate_u42dnf.png`,
    addition: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001702/plus_u1czew.png`,
    plusDarkBlack: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741091679/add_fvqxhx.png`,
    organization: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001946/organization-structure_sqhx1t.png`,
    building: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741002385/skyscraper_pp9wzt.png`,
    buildingBlack: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741003384/buildings_bv3kh5.png`,
    floorPlan: `https://res.cloudinary.com/dlulq6hny/image/upload/v1741003494/layout_egs4jp.png`,
    sensor: `https://res.cloudinary.com/dlulq6hny/image/upload/v1738217587/sensors_bbmpqg.png`,
};

export const serverDomains = {
    flask: `https://flask.claircoair.com`,
};
