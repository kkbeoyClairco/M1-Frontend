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
