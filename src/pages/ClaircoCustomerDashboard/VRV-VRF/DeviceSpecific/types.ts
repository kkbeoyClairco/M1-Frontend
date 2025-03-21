export type TableRecord = {
    value: string;
    // location: string;
    time: string;
    Parameter: string;
};

export type AlertTableType = {
    time_stamp: string;
    sensor_id: string;
    parameter: string;
    parameter_value: string;
    building: string;
    floor: string;
    businessunit: string;
};
export type OccupancyTableType = {
    time_stamp: string;
    sensor_id: string;
    parameter: string;
    parameter_value: string;
    building: string;
    floor: string;
    businessunit: string;
};
