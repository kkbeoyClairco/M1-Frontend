import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { DefaultLayout, VerticalLayout, HorizontalLayout, DetachedLayout, FullLayout } from 'layouts';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import { LayoutTypes } from 'appConstants';
import { useRedux } from 'hooks';

// const Login = React.lazy(() => import('pages/account/Login'));
const Logout = React.lazy(() => import('pages/account/Logout'));
// const MaintananceLogsPage = React.lazy(
//     () => import('pages/ClaircoAdminDashboard/IAQ/MaintananceLogs/MaintananceLogsPage')
// );
// const treeView = React.lazy(() => import('pages/ClaircoAdminDashboard/FIleExploer/FIleExploer'));

// ENERGY EFFICIENCY
const AhuDevicePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyEfficiency/AHU_Device/AHU_DevicePage')
);
const AhuHomePage = React.lazy(() => import('pages/ClaircoCustomerDashboard/AHU/AHU_Home/AHU_HomePage'));
const EnergyMeterDevicePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyEfficiency/EnergyMeter/EnergyMeter_Device/EnergyMeterPage')
);
const EnergyMeterHomePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyEfficiency/EnergyMeter/EnergyMeter_Home/EnergyMeter_HomePage')
);

const Occupancy_Home = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyEfficiency/Occupancy/Occupancy_Home/Occupancy_Home')
);
const OccupancyDetailsPage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyEfficiency/Occupancy/OccupancyDevice/OccupancyDetailsPage')
);

const EnergyLandingPage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyEfficiency/CustomerLandingPage/CustomerLandingPage')
);

// WSR
const WashroomLandingPage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/LandingPage/CustomerLandingPage')
);
const FeedbackHome = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Feedback/Home/FeedbackHomePage')
);
const Feedback = React.lazy(() => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Feedback/Feedback'));
const Occupancy_Home1 = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Occupancy/Occupancy_Home/Occupancy_Home')
);
const OccupancyDetailsPage2 = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Occupancy/OccupancyDevice/OccupancyDevicePage')
);
const OdourHome = React.lazy(() => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Odour/IAQ_Home/IAQ_Home'));
const OdourDevice2 = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Odour/IAQ_Home/SensiableDevices/SensiableDevicesPage')
);

//NEW
// const EnergyMeterDevicePage = React.lazy(
//     () => import('pages/ClaircoCustomerDashboard/EnergyMeter/EnergyMeter_Device/EnergyMeterPage')
// );
const OccupancyDetailsPage1 = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Occupancy/OccupancyDevice/OccupancyDevicePage')
);
const OdourDevice = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/ClaircoWashroom/Odour/IAQ_Home/SensiableDevices/SensiableDevicesPage')
);

//  /Clairco Login
const ClaircoAdminLogin = React.lazy(() => import('pages/ClaircoLogin/ClaircoAdminLogin'));

const IAQSensorPageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/IAQ_Devices/IAQDevicePage2'));
const IAQDetailsPage = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/IAQHome/IAQDetailsPage'));
const PCSDetailsPage = React.lazy(() => import('pages/ClaircoAdminDashboard/PCS/PCSHome/PcsHome'));
const PCSSensorPageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/PCS/PCSDevice/PCSDevicePage'));
const LandingPageNew = React.lazy(() => import('pages/ClaircoAdminDashboard/LandingPageNew/LandingPage'));
// //UV

// const Uvbuilding = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Uvbuilding'));
// const Uvfloor = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Uvfloor'));
// const Uvlamps = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Lamps'));

//settings
// const Settings = React.lazy(() => import('pages/CalircoAdminSettings/index'));

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
                        {
                            path: 'home',
                            element: <LoadComponent component={LandingPageNew} />,
                        },
                    ],
                },
            ],
        },

        {
            path: '/customer',
            element: <PrivateRoute component={Layout} roles={'customer'} />,
            children: [
                // {
                //     path: 'iaq-home',
                //     element: <LoadComponent component={IAQDetailsPage} />,
                // },
                // {
                //     path: 'iaq-home/:device',
                //     element: <LoadComponent component={IAQSensorPageAdmin} />,
                // },
                // {
                //     path: 'pcs-home',
                //     element: <LoadComponent component={PCSDetailsPage} />,
                // },
                // {
                //     path: 'pcs-home/:device',
                //     element: <LoadComponent component={PCSSensorPageAdmin} />,
                // },
                // {
                //     path: 'pcs-home',
                //     element: <LoadComponent component={PCSDetailsPage} />,
                // },
                // {
                //     path: 'pcs-home/:device',
                //     element: <LoadComponent component={PCSSensorPageAdmin} />,
                // },
                {
                    path: 'washroom-home',
                    element: <LoadComponent component={PCSDetailsPage} />,
                },
                {
                    path: 'washroom-home/:device',
                    element: <LoadComponent component={PCSSensorPageAdmin} />,
                },
                {
                    path: 'energy-efficiency-home',
                    element: <LoadComponent component={PCSDetailsPage} />,
                },
                {
                    path: 'energy-efficiency-home/:device',
                    element: <LoadComponent component={PCSSensorPageAdmin} />,
                },

                {
                    path: 'odour/:device',
                    element: <LoadComponent component={OdourDevice} />,
                },

                // {
                //     path: 'maintenance-logs',
                //     element: <LoadComponent component={MaintananceLogsPage} />,
                // },
                // {
                //     path: 'settings',
                //     element: <LoadComponent component={Settings} />,
                // },
                // {
                //     path: 'tree',
                //     element: <LoadComponent component={treeView} />,
                // },

                // {
                //     path: 'uv',
                //     children: [
                //         {
                //             path: '',
                //             element: <LoadComponent component={Uvbuilding} />,
                //         },
                //         {
                //             path: 'floors',
                //             element: <LoadComponent component={Uvfloor} />,
                //         },
                //         {
                //             path: 'Lamps',
                //             element: <LoadComponent component={Uvlamps} />,
                //         },
                //     ],
                // },
            ],
        },

        {
            // auth protected routes
            path: '/energy-efficiency',
            element: <PrivateRoute component={Layout} roles={'energyEfficiency'} />,
            children: [
                {
                    path: '',
                    element: <LoadComponent component={EnergyLandingPage} />,
                },

                {
                    path: 'occupancy',
                    element: <LoadComponent component={Occupancy_Home} />,
                },
                {
                    path: 'occupancy/:deviceId',
                    element: <LoadComponent component={OccupancyDetailsPage} />,
                },

                {
                    path: 'energymeter',
                    element: <LoadComponent component={EnergyMeterHomePage} />,
                },

                {
                    path: 'energymeter/:id',
                    element: <LoadComponent component={EnergyMeterDevicePage} />,
                },
                {
                    path: 'ahu',
                    element: <LoadComponent component={AhuHomePage} />,
                },
                {
                    path: 'ahu/:device',
                    element: <LoadComponent component={AhuDevicePage} />,
                },
            ],
        },

        {
            // auth protected routes
            path: '/wsr',
            element: <PrivateRoute component={Layout} roles={'wsr'} />,
            children: [
                {
                    path: '',
                    element: <LoadComponent component={WashroomLandingPage} />,
                },
                {
                    path: 'feedback',
                    element: <LoadComponent component={FeedbackHome} />,
                },
                {
                    path: 'feedback/:device',
                    element: <LoadComponent component={Feedback} />,
                },
                {
                    path: 'sensiCOUNT',
                    element: <LoadComponent component={Occupancy_Home1} />,
                },
                {
                    path: 'sensiCOUNT/:device',
                    element: <LoadComponent component={OccupancyDetailsPage2} />,
                },
                {
                    path: 'odour',
                    element: <LoadComponent component={OdourHome} />,
                },
                {
                    path: 'odour/:device',
                    element: <LoadComponent component={OdourDevice2} />,
                },
            ],
        },
        {
            // auth protected routes
            path: '/air-quality',
            element: <PrivateRoute component={Layout} roles={'wsr'} />,
            children: [
                {
                    path: '',
                    element: <LoadComponent component={IAQSensorPageAdmin} />,
                },
                {
                    path: 'iaq-home',
                    element: <LoadComponent component={IAQDetailsPage} />,
                },
                {
                    path: 'iaq-home/:device',
                    element: <LoadComponent component={IAQSensorPageAdmin} />,
                },
            ],
        },

        {
            // auth protected routes
            path: '/space',
            element: <PrivateRoute component={Layout} roles={'wsr'} />,
            children: [
                {
                    path: 'pcs-home',
                    element: <LoadComponent component={PCSDetailsPage} />,
                },
                {
                    path: 'pcs-home/:device',
                    element: <LoadComponent component={PCSSensorPageAdmin} />,
                },
            ],
        },
    ]);
};

export { AllRoutes };
