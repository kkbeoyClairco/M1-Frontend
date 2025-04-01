export const extractParamsForBreadCrumbs = <T extends Record<string, any>>(data: T): string[] => {
    try {
        const res: string[] = [];
        if (data.customerName) res.push(data.customerName);
        if (data.buildingName) res.push(data.buildingName);
        if (data.floorName) res.push(data.floorName);
        return res;
    } catch (error) {
        console.log(error);
        return [];
    }
};
