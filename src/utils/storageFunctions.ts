export const getDataFromSession = (key: string) => {
    try {
        const sessionData = sessionStorage.getItem(key);
        // console.log('Session storage:', sessionData);
        return JSON.parse(sessionData || '');
    } catch (error) {
        console.log(error);
    }
};

export const getUserIdFromSession = () => {
    try {
        const sessionData = getDataFromSession('USER_DATA');
        const id = sessionData?.user?.id;
        const isAdmin = sessionData?.user?.type;
        const customerId = sessionData?.user?.customerId;
        const buildingId = sessionData.user.buildingId;

        return { isAdmin, id, customerId, buildingId };
    } catch (error) {
        return { isAdmin: null, id: null };
    }
};

export const getUserInfoFromSession = () => {
    try {
        const sessionData = getDataFromSession('USER_DATA');
        const id = sessionData?.user.id;
        const type = sessionData.user.type;
        const customerId = sessionData.user.customerId;
        return { type, id, customerId };
    } catch (error) {
        return { isAdmin: null, id: null };
    }
};
export const isPanasonic = () => {
    try {
        const sessionData = getDataFromSession('USER_DATA');
        const allowded = sessionData?.user?.name !== 'Panasonic Admin';
        return allowded;
    } catch (error) {
        console.log(error);
        return true;
    }
};

export const isAdmin = () => {
    try {
        const sessionData = getDataFromSession('USER_DATA');
        const allowded = sessionData?.user?.name == 'Admin';
        return allowded;
    } catch (error) {
        return false;
    }
};

export const getUserDetailsFromSession = () => {
    try {
        const sessionData = getDataFromSession('USER_DATA').user;
        return sessionData;
    } catch (error) {
        console.log(error);
    }
};

export const getDeviceListFromSession = () => {
    try {
        const deviceData = JSON.parse(sessionStorage.getItem('USER_DATA') ?? '')?.assignedDeviceTypes;
        return deviceData;
    } catch (error) {
        console.log(error);
    }
};

export const getUserRoleFromAuth = () => {
    try {
        const userType = JSON.parse(sessionStorage.getItem('USER_DATA') ?? '')?.type;
        return userType;
    } catch (error) {
        console.log(error);
    }
};

//Stores data in session storage
export const storeDataToSession = (key: string, data: any) => {
    try {
        sessionStorage.setItem(key, data);
    } catch (error) {
        console.log(error);
    }
};
