// Creates floorList in a format that can be used in the select component
export const getFloorsListForSelect = (data: any) => {
    try {
        const floorMap = new Map();
        floorMap.set('Others', {
            value: '',
            label: 'All',
        });
        for (let i = 0; i < data.length; i++) {
            if (data?.[i]?.floorId?.id)
                floorMap.set(data?.[i]?.floorId?.id, {
                    value: data?.[i]?.floorId?.id,
                    label: data?.[i]?.floorId?.name,
                });
        }
        const floorList = Array.from(floorMap.values());
        return floorList;
    } catch (error) {
        console.log(error);
    }
};

export const getCustomersListForSelect = (data: any) => {
    try {
        const customerMap = new Map();
        customerMap.set('Others', {
            value: '',
            label: 'All',
        });

        for (let i = 0; i < data.length; i++) {
            if (data?.[i]?.customerId?.id)
                customerMap.set(data?.[i]?.customerId?.id, {
                    label: data?.[i]?.customerId?.name ?? '',
                    value: data?.[i]?.customerId?.id ?? '',
                });
        }
        const customerList = Array.from(customerMap.values());
        return customerList;
    } catch (error) {
        console.log(error);
    }
};
// Creates buildingList in a format that can be used in the select component
export const getBuidinglListForSelect = (data: any) => {
    try {
        const buildingMap = new Map();
        buildingMap.set('Others', {
            value: '',
            label: 'All',
        });
        for (let i = 0; i < data.length; i++) {
            if (data?.[i]?.buildingId?.id)
                buildingMap.set(data?.[i]?.buildingId?.id, {
                    label: data?.[i]?.buildingId?.name ?? '',
                    value: data?.[i]?.buildingId?.id ?? '',
                });
        }
        const buildingList = Array.from(buildingMap.values());
        return buildingList;
    } catch (error) {
        console.log(error);
    }
};

export const getDeviceListForSelection = (data: any) => {
    try {
        if (!Array.isArray(data)) return [];
        const deviceList = data?.map((doc: any) => ({
            label: `${doc?.buildingId?.name + ' / ' + doc?.floorId?.name + ' / ' + doc?.name}`,
            value: {
                name: doc?.name,
                buildingName: doc?.buildingId?.name,
                locationName: doc?.locationId?.name,
                floorName: doc?.floorId?.name,
                deviceId: doc?.id,
                customerId: doc?.customerId?.id,
                buildingId: doc?.buildingId?.id,
            },
        }));
        return deviceList;
    } catch (error) {
        console.log(error);
    }
};

export const filterDataWithBuildingIds = (data: any, buildingIds: string[]) => {
    try {
        if (!Array.isArray(data) || !Array.isArray(buildingIds)) return [];
        const filtered = data?.filter((device: any) => buildingIds?.includes(device?.buildingId?.id ?? ''));
        return filtered;
    } catch (error) {
        return [];
    }
};
