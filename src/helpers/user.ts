export const getAssignedDeviceType = (data: any) => {
    try {
        const assignedDeviceTypes =
            data?.user?.access?.flatMap(
                (customer: { deviceType: { type: string }[] }) =>
                    customer?.deviceType?.map((assignedDevice: { type: string }) => assignedDevice?.type ?? '') ?? []
            ) ?? [];
        return assignedDeviceTypes;
    } catch (error) {
        return [];
    }
};

export const checkIAQCustomer = (deviceTypes: string[] | undefined | null): boolean => {
    try {
        return !!(Array.isArray(deviceTypes) && deviceTypes.includes('IAQ'));
    } catch (error) {
        return false;
    }
};
export const checkUVCustomer = (deviceTypes: string[] | undefined | null): boolean => {
    try {
        return !!(Array.isArray(deviceTypes) && deviceTypes.includes('UV'));
    } catch (error) {
        return false;
    }
};

export const getAssignedBuildings = (data: any) => {
    try {
        if (!data || !Array.isArray(data)) return [];
        const builldings = data?.flatMap((customer: any) =>
            Array.isArray(customer?.buildings)
                ? customer?.buildings
                      .filter(
                          (building: any) =>
                              Array.isArray(building?.deviceType) &&
                              building.deviceType.some((device: any) => device.type === 'IAQ')
                      )
                      .map((building: any) => ({ lable: building?.name, value: building?.buildingId }))
                : []
        );
        return builldings;
    } catch (error) {
        return [];
    }
};
