import { useUser } from 'hooks';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
const Root = () => {
    const [loggedInUser] = useUser();
    const deviceTypes = loggedInUser?.user?.assignedDeviceTypes?.map(({ deviceTypeName }: any) => deviceTypeName);
    // console.log('Logged in user', deviceTypes);
    // {
    //     "user": {
    //         "id": "677e5f389bdcf3d3fedd8d61",
    //         "email": "ibsbanglore@gmail.com",
    //         "type": "uvCustomer",
    //         "customerId": "677f63839abd634ae42fab85",
    //         "name": "IBS Banglore",
    //         "companyAdmin": false,
    //         "globalAdmin": false,
    //         "buildingIds": [],
    //         "assignedDeviceTypes": []
    //     },
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc3ZTVmMzg5YmRjZjNkM2ZlZGQ4ZDYxIiwiZW1haWwiOiJpYnNiYW5nbG9yZUBnbWFpbC5jb20iLCJjdXN0b21lcklkIjoiNjc3ZjYzODM5YWJkNjM0YWU0MmZhYjg1In0sImlhdCI6MTc0NDExNTUxMSwiZXhwIjoxNzQ0MTU4NzExfQ.fXil78V_GKYoaqctju0eE_Cci9RKJbHlujYDL9hA-UQ"
    // }
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
                // console.log('No user');
                return '/error-500';
            // '/customer/dashboard';
        }
    };

    const url = getRootUrl();

    return <Navigate to={url} />;
};

export default Root;
