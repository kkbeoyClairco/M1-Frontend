import { useUser } from 'hooks';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
const Root = () => {
    const [loggedInUser] = useUser();
    // console.log('Logged in user', loggedInUser);
    const deviceTypes = loggedInUser?.user?.assignedDeviceTypes?.map(({ deviceTypeName }: any) => deviceTypeName);
    const isAdmin = loggedInUser?.user?.globalAdmin === true && loggedInUser?.user?.type === 'Admin';
    const iaqUser = useMemo(() => deviceTypes?.includes('IAQ') || isAdmin, [deviceTypes, isAdmin]);
    const getRootUrl = () => {
        if (!loggedInUser || !iaqUser) {
            return 'login';
        }
        // else if (iaqOnlyUser) return `/customer/iaq`;
        switch (loggedInUser?.user?.type) {
            // case 'Admin':
            //     return '/admin/pages/admindashboard';
            // case 'Customer':
            //     return '/customer/dashboard';
            default:
                // console.log('No user');
                return '/customer/iaq-home';
            // '/customer/dashboard';
        }
    };

    const url = getRootUrl();

    return <Navigate to={url} />;
};

export default Root;
