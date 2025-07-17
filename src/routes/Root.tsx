import { checkIAQCustomer, checkUVCustomer, getAssignedDeviceType } from 'helpers/user';
import { useUser } from 'hooks';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
const Root = () => {
    const [loggedInUser] = useUser();
    const deviceTypes = useMemo(() => getAssignedDeviceType(loggedInUser), [loggedInUser]);
    const isAdmin = loggedInUser?.user?.type === 'Admin';
    const iaqUser = useMemo(
        () => checkIAQCustomer(deviceTypes) || checkUVCustomer(deviceTypes) || isAdmin,
        [deviceTypes, isAdmin]
    );
    const getRootUrl = (): string => {
        if (!loggedInUser || !iaqUser) {
            return 'login';
        }
        switch (loggedInUser?.user?.type) {
            case 'Admin':
                return '/customer/iaq-home';
            case 'Customer':
                return '/customer/iaq-home';
            case 'uvCustomer':
                return '/customer/uv';
            default:
                return '/customer/iaq-home';
        }
    };

    const url = getRootUrl();

    return <Navigate to={url} />;
};

export default Root;
