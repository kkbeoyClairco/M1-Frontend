const endPoints = {
    ADMIN_lOGIN: '/login',
    FLOOR_IMAGE_UPLOAD: '/api/floor-plans/image',
    // GET_LIST_OF_BUILDINGS: 'http://3.7.82.174:4446/api/v1/customers/66aca68db180b45b2dfe62a3/buildings',

    // Floor plan viewer
    FLOOR_PLAN_GET: (floorPlanId: string) => `/api/floor-plans/${floorPlanId}`,
    FLOOR_PLAN_SENSOR_DATA: (floorPlanId: string) => `/api/sensor-data/${floorPlanId}`,
};
export { endPoints };
