import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { DefaultLayout, VerticalLayout, HorizontalLayout, DetachedLayout, FullLayout } from 'layouts';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import { LayoutTypes } from 'appConstants';
import { useRedux } from 'hooks';

// const Login = React.lazy(() => import('pages/account/Login'));
const Logout = React.lazy(() => import('pages/account/Logout'));
const MaintananceLogsPage = React.lazy(
    () => import('pages/ClaircoAdminDashboard/IAQ/MaintananceLogs/MaintananceLogsPage')
);
const treeView = React.lazy(() => import('pages/ClaircoAdminDashboard/FIleExploer/FIleExploer'));

//Clairco Login
const ClaircoAdminLogin = React.lazy(() => import('pages/ClaircoLogin/ClaircoAdminLogin'));

const IAQSensorPageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/IAQ_Devices/IAQDevicePage2'));
const IAQDetailsPage = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/IAQHome/IAQDetailsPage'));

// //UV

const Uvbuilding = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Uvbuilding'));
const Uvfloor = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Uvfloor'));
const Uvlamps = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Lamps'));

const loading = () => <div className=""></div>;

type LoadComponentProps = {
    component: React.LazyExoticComponent<() => JSX.Element>;
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { appSelector } = useRedux();

    const { layout } = appSelector((state) => ({
        layout: state.Layout,
    }));

    const getLayout = () => {
        let layoutCls: React.ComponentType = VerticalLayout;

        switch (layout.layoutType) {
            case LayoutTypes.LAYOUT_HORIZONTAL:
                layoutCls = HorizontalLayout;
                break;
            case LayoutTypes.LAYOUT_DETACHED:
                layoutCls = DetachedLayout;
                break;
            case LayoutTypes.LAYOUT_FULL:
                layoutCls = FullLayout;
                break;
            default:
                layoutCls = VerticalLayout;
                break;
        }
        return layoutCls;
    };
    let Layout = getLayout();
    return useRoutes([
        { path: '/', element: <Root /> },

        {
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: '/',
                    children: [
                        { path: 'login', element: <LoadComponent component={ClaircoAdminLogin} /> },
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                    ],
                },
            ],
        },

        {
            path: '/customer',
            element: <PrivateRoute component={Layout} roles={'customer'} />,
            children: [
                {
                    path: 'iaq-home',
                    element: <LoadComponent component={IAQDetailsPage} />,
                },
                {
                    path: 'iaq-home/:device',
                    element: <LoadComponent component={IAQSensorPageAdmin} />,
                },
                {
                    path: 'maintenance-logs',
                    element: <LoadComponent component={MaintananceLogsPage} />,
                },
                {
                    path: 'tree',
                    element: <LoadComponent component={treeView} />,
                },

                {
                    path: 'uv',
                    children: [
                        {
                            path: '',
                            element: <LoadComponent component={Uvbuilding} />,
                        },
                        {
                            path: 'floors',
                            element: <LoadComponent component={Uvfloor} />,
                        },
                        {
                            path: 'Lamps',
                            element: <LoadComponent component={Uvlamps} />,
                        },
                    ],
                },
            ],
        },
    ]);
};

export { AllRoutes };
