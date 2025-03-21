import { Navigate, useLocation } from 'react-router-dom';
import { APICore } from 'helpers/api/apiCore';
import { useUser } from 'hooks';

type PrivateRouteProps = {
    component: React.ComponentType;
    roles?: string;
};

/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */
const PrivateRoute = ({ component: RouteComponent, roles, ...rest }: PrivateRouteProps) => {
    let location = useLocation();
    const [loggedInUser] = useUser();

    const api = new APICore();
    const userType = loggedInUser?.user?.type?.toString()?.trim();
    const roleType = roles?.toString()?.trim();
    if (userType !== roleType) {
        // console.log('Roles and user types do not match');
    } else {
        // console.log('Roles and user types match');
    }
    // console.log(
    //     'Logged in data',
    //     loggedInUser?.user?.type?.length,
    //     roles,
    //     roles?.length,
    //     roles?.toString() != (loggedInUser?.user?.type).toString()
    // );
    /**
     * not logged in so redirect to login page with the return url
     */
    if (api.isUserAuthenticated() === false) {
        return <Navigate to={'/login'} state={{ from: location }} replace />;
    }
    // check if route is restricted by role
    if (userType !== roleType) {
        return <Navigate to={{ pathname: '/' }} />;
    }

    return <RouteComponent />;
};

export default PrivateRoute;
