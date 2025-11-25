export type occupancyTables = {
    name: string;
    location: string;
    occupants: string;
    building: string;
    unitName: string;
    floor: string;
    status: string;
    last_refreshed_on: any;
    lastUpdated: string;
    battery_level: string;
};

export type DeviseTables = {
    device_id: string;
    customer: string;
    seat_no: string;
    building: string;
    floor: string;
    health_status: string;
    last_refreshed_on: any;
    last_diagnosed_on: any;
    battery_level: string;
    sensor_address: string;
};
