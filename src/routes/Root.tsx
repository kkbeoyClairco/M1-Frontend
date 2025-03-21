import { useUser } from 'hooks';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
const Root = () => {
    const [loggedInUser] = useUser();
    const deviceTypes = loggedInUser?.user?.assignedDeviceTypes?.map(({ deviceTypeName }: any) => deviceTypeName);

    // useMemo(
    // loggedInUser?.user?.assignedDeviceTypes?.map(({ deviceTypeName }: any) => deviceTypeName);
    // [loggedInUser]
    // );
    const iaqOnlyUser = useMemo(() => deviceTypes?.includes('IAQ') && deviceTypes?.length === 1, [deviceTypes]);
    // console.log('Log in user details:', iaqOnlyUser, deviceTypes);
    const getRootUrl = () => {
        if (!loggedInUser) {
            return 'login';
        } else if (iaqOnlyUser) return `/customer/iaq`;
        switch (loggedInUser.user.type) {
            case 'Admin':
                return '/admin/pages/admindashboard';
            case 'Customer':
                return '/customer/dashboard';
            default:
                return '';
            // '/customer/dashboard';
        }
    };

    const url = getRootUrl();

    return <Navigate to={url} />;
};

export default Root;
