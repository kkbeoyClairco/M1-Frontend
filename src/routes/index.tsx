import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { DefaultLayout, VerticalLayout, HorizontalLayout, DetachedLayout, FullLayout } from 'layouts';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import { LayoutTypes } from 'appConstants';
import { useRedux } from 'hooks';

const Login = React.lazy(() => import('pages/account/Login'));
const Logout = React.lazy(() => import('pages/account/Logout'));
const Register = React.lazy(() => import('pages/account/Register'));
const Confirm = React.lazy(() => import('pages/account/Confirm'));
const ForgetPassword = React.lazy(() => import('pages/account/ForgetPassword'));
const LockScreen = React.lazy(() => import('pages/account/LockScreen'));

const Login2 = React.lazy(() => import('pages/account/Login2'));
const Logout2 = React.lazy(() => import('pages/account/Logout2'));
const Confirm2 = React.lazy(() => import('pages/account/Confirm2'));
const ForgetPassword2 = React.lazy(() => import('pages/account/ForgetPassword2'));
const LockScreen2 = React.lazy(() => import('pages/account/LockScreen2'));
const MaintananceLogsPage = React.lazy(
    () => import('pages/ClaircoAdminDashboard/IAQ/MaintananceLogs/MaintananceLogsPage')
);
// dashboard
// const AnalyticsDashboard = React.lazy(() => import('pages/dashboard/Analytics'));
// const EcommerceDashboard = React.lazy(() => import('pages/dashboard/Ecommerce'));
// const ProjectDashboard = React.lazy(() => import('pages/dashboard/Project'));
// const EWalletDashboard = React.lazy(() => import('pages/dashboard/E-Wallet'));
// const OccupencyTrends=React.lazy(()=>import('');
// apps
// const CalendarApp = React.lazy(() => import('pages/apps/Calendar'));
// const ProjectList = React.lazy(() => import('pages/apps/Projects/List'));
// const ProjectDetail = React.lazy(() => import('pages/apps/Projects/Detail/'));
// const ProjectGannt = React.lazy(() => import('pages/apps/Projects/Gantt'));
// const ProjectForm = React.lazy(() => import('pages/apps/Projects/ProjectForm'));

// // - chat
// const ChatApp = React.lazy(() => import('pages/apps/Chat/'));

// // -crm
// const CRMDashboard = React.lazy(() => import('pages/apps/CRM/Dashboard'));
// const CRMProjects = React.lazy(() => import('pages/apps/CRM/Projects'));
// const CRMManagement = React.lazy(() => import('pages/apps/CRM/Management'));
// const CRMClients = React.lazy(() => import('pages/apps/CRM/Clients'));
// const CRMOrderList = React.lazy(() => import('pages/apps/CRM/OrderList'));

// // - ecommece pages
// const EcommerceProducts = React.lazy(() => import('pages/apps/Ecommerce/Products'));
// const ProductDetails = React.lazy(() => import('pages/apps/Ecommerce/ProductDetails'));
// const Orders = React.lazy(() => import('pages/apps/Ecommerce/Orders'));
// const OrderDetails = React.lazy(() => import('pages/apps/Ecommerce/OrderDetails'));
// const Customers = React.lazy(() => import('pages/apps/Ecommerce/Customers'));
// const Cart = React.lazy(() => import('pages/apps/Ecommerce/Cart'));
// const Checkout = React.lazy(() => import('pages/apps/Ecommerce/Checkout/'));
// const Sellers = React.lazy(() => import('pages/apps/Ecommerce/Sellers'));

// // - email
// const Inbox = React.lazy(() => import('pages/apps/Email/Inbox'));
// const EmailDetail = React.lazy(() => import('pages/apps/Email/Detail'));

// // - social
// const SocialFeed = React.lazy(() => import('pages/apps/SocialFeed/'));

// // - tasks
// const TaskList = React.lazy(() => import('pages/apps/Tasks/List/'));
// const TaskDetails = React.lazy(() => import('pages/apps/Tasks/Details'));
// const Kanban = React.lazy(() => import('pages/apps/Tasks/Board/'));
// // - file
// const FileManager = React.lazy(() => import('pages/apps/FileManager'));

// pages
// const Profile = React.lazy(() => import('pages/profile'));
// const Profile2 = React.lazy(() => import('pages/profile2'));
const ErrorPageNotFound = React.lazy(() => import('pages/error/PageNotFound'));
const ErrorPageNotFoundAlt = React.lazy(() => import('pages/error/PageNotFoundAlt'));
const ServerError = React.lazy(() => import('pages/error/ServerError'));
// const AdminDashboard = React.lazy(() => import('pages/Sensiable-AdminDashboard/index'));
const Admin = React.lazy(() => import('pages/CalircoAdminSettings/index'));

// const OccupencyTrends = React.lazy(() => import('pages/Sensiable-Dashboard/index'));
// const LiveView = React.lazy(() => import('pages/Sensiable-LiveView/index'));
// const Analytics = React.lazy(() => import('pages/Sensiable-Analytics/index'));
// const WashroomDashboard = React.lazy(() => import('pages/Washroom-Dashboard/index'));

//Clairco Login
const ClaircoAdminLogin = React.lazy(() => import('pages/ClaircoLogin/ClaircoAdminLogin'));

// ADMIN SIDE
//Clairco ADMIN Dashboard
const ClaircoAdminDashboard = React.lazy(() => import('pages/ClaircoAdminDashboard/LandingPage/LandingPage'));
const DevicesListPage = React.lazy(() => import('pages/ClaircoAdminDashboard/DeviceListPage/DeviceListPage'));
const BuildingListPage = React.lazy(() => import('pages/ClaircoAdminDashboard/BuildingsPage/BuildingListPage'));
const FloorListPage = React.lazy(() => import('pages/ClaircoAdminDashboard/FloorsPage/FloorsListPage'));

const VrvVrfDetailsPage = React.lazy(
    () => import('pages/ClaircoAdminDashboard/VRV-VRF/VRV_VRF_Home/OutdoorDevices_HomePage')
);
const treeView = React.lazy(() => import('pages/ClaircoAdminDashboard/FIleExploer/FIleExploer'));
// const claircoIaq = React.lazy(() => import('pages/ClaircoCustomerDashboard/Clairco-IAQ/IaqTable'));
// const IaqDashboard = React.lazy(() => import('pages/ClaircoCustomerDashboard/Clairco-IAQ/ClaircIaqDashboard/index'));
const IAQSensorPageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/IAQ_Devices/IAQDevicePage2'));
const IAQDetailsPage = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/IAQHome/IAQDetailsPage'));
const VrvVrfSensorPage = React.lazy(
    () => import('pages/ClaircoAdminDashboard/VRV-VRF/DeviceSpecific/VRVVRFSensorPage')
);
// IndoorUnit / IndoorUnit_Home / IndoorDevicesHomePage;
const IndoorUnitAdminHome = React.lazy(
    () => import('pages/ClaircoAdminDashboard/IndoorUnit/IndoorUnit_Home/IndoorDevicesHomePage')
);
const IndoorUnitAdminDevice = React.lazy(
    () => import('pages/ClaircoAdminDashboard/IndoorUnit/Indoor_Device/IndoorUnit_Page')
);
const OccupancyListAdmin = React.lazy(
    () => import('pages/ClaircoAdminDashboard/Occupancy/Occupancy_Home/Occupancy_Home')
);
const OccupancySensorPageAdmin = React.lazy(
    () => import('pages/ClaircoAdminDashboard/Occupancy/OccupancyDevice/OccupancyDetailsPage')
);

const PCSDevicePageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/PCS/PCSDevice/PCSDevicePage'));

const PCSHomeAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/PCS/PCSHome/PcsHome'));

const PIROccupancyDevicePage = React.lazy(
    () => import('pages/ClaircoAdminDashboard/Occupancy/PirDevicesHome/PIRDevicePage')
);
const EnergyMeterListAdmin = React.lazy(
    () => import('pages/ClaircoAdminDashboard/EnergyMeter/EnergyMeter_Home/EnergyMeter_HomePage')
);
const EnergyMeterSensorAdmin = React.lazy(
    () => import('pages/ClaircoAdminDashboard/EnergyMeter/EnergyMeter_Device/EnergyMeterPage')
);
const ControlLogs = React.lazy(() => import('pages/ClaircoAdminDashboard/ControlLogs/ControlLogsPage'));
//const IAQSensorPage = React.lazy(() => import('pages/ClaircoAdminDashboard/IAQ/DeviceSpecific/IAQSensorPage'));
const ThemopileHome = React.lazy(
    () => import('pages/ClaircoAdminDashboard/Thermopile/ThermopileHome/ThermopileHomePage')
);
const ThemopileDevicePage = React.lazy(
    () => import('pages/ClaircoAdminDashboard/Thermopile/ThermopileDevice/ThermopileDevicePage')
);

const WhiteBoardPage = React.lazy(() => import('pages/ClaircoAdminDashboard/Drawing/WhiteBoardPage'));
// //UV

const Uvbuilding = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Uvbuilding'));
const Uvfloor = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Uvfloor'));
const Uvlamps = React.lazy(() => import('pages/ClaircoAdminDashboard/UV Devices/Lamps'));

// CUSTOMER SIDE
//Clairco Customer Side

const claircoCustomerLandingPage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/CustomerLandingPage/CustomerLandingPage')
);

const TrailLanding = React.lazy(() => import('pages/ClaircoCustomerDashboard/CustomerLandingPage/TrailLanding'));

const VrvVrfDetailsPageCus = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/VRV-VRF/VRV_VRF_Home/OutdoorDevices_HomePage')
);
const IndoorDeviceHomePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/IndoorUnit/IndoorUnit_Home/IndoorDevicesHomePage')
);
const VrvVrfSensorPageCus = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/VRV-VRF/DeviceSpecific/VRVVRFSensorPage')
);
const OccupancyDetailsPage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/Occupancy/OccupancyDevice/OccupancyDetailsPage')
);
// const LayoutSPage = React.lazy(() => import('pages/ClaircoCustomerDashboard/Layouts/Layouts'));
// const Heatmap = React.lazy(() => import('pages/ClaircoCustomerDashboard/HeatMap/Heatmap'));
const EnergyMeterDevicePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyMeter/EnergyMeter_Device/EnergyMeterPage')
);
const EnergyMeterHomePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/EnergyMeter/EnergyMeter_Home/EnergyMeter_HomePage')
);
const Occupancy_Home = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/Occupancy/Occupancy_Home/Occupancy_Home')
);

const AhuDevicePage = React.lazy(() => import('pages/ClaircoCustomerDashboard/AHU/AHU_Device/AHU_DevicePage'));
const AhuHomePage = React.lazy(() => import('pages/ClaircoCustomerDashboard/AHU/AHU_Home/AHU_HomePage'));
const AhuHomePageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/AHU/AHU_Home/AHU_HomePage'));
const AhuDevicePageAdmin = React.lazy(() => import('pages/ClaircoAdminDashboard/AHU/AHU_Device/AHU_DevicePage'));

const ControlLogsPage = React.lazy(() => import('pages/ClaircoCustomerDashboard/ControlLogs/ControlLogsPage'));
const IAQDevicePage = React.lazy(() => import('pages/ClaircoCustomerDashboard/IAQ/IAQ_Devices/IAQDevicePage'));
const IAQHomePage = React.lazy(() => import('pages/ClaircoCustomerDashboard/IAQ/IAQ_Home/IAQ_Home'));
const indoorUnitDevicePage = React.lazy(
    () => import('pages/ClaircoCustomerDashboard/IndoorUnit/Indoor_Device/IndoorUnit_Page')
);
//SettingsPages

// const BuildingsTable = React.lazy(() => import('pages/Sensiable-Settings/BuildingsTable/index'));
// const FloorsTable = React.lazy(() => import('pages/Sensiable-Settings/FloorsTable/index'));
// const SensorsMapping = React.lazy(() => import('pages/Sensiable-Settings/SensorsMapping/index'));
// const SensorAnalytics = React.lazy(() => import('pages/SensorDiagnostics'));
// const EnvironmentAnalytics = React.lazy(() => import('pages/EnvironmentAnalytics'));
// const MappingSettings = React.lazy(() => import('pages/Sensiable-Settings/MappingSettings'));
// const CommissionSequence = React.lazy(() => import('pages/Sensiable-Settings/commissionSequence/index'));
// const CustomerTable = React.lazy(() => import('pages/Sensiable-Settings/CustomerTable/index'));
// const skelton = React.lazy(() => import('components/ClaircoCustomer/skelton'));
// const TableSkelton = React.lazy(() => import('components/ClaircoCustomer/Skeltons/TableSkelton'));
const editCustomerModal = React.lazy(() => import('pages/CalircoAdminSettings/modals/CustomerModal/EditCustomerModal'));
const editBuildingModal = React.lazy(() => import('pages/CalircoAdminSettings/modals/BuildingModal/EditBuildingModal'));
const editFloorModal = React.lazy(() => import('pages/CalircoAdminSettings/modals/FloorModal/EditFloorModal'));
const editZoneModal = React.lazy(() => import('pages/CalircoAdminSettings/modals/ZoneModal/EditZoneModal'));
const editUserModal = React.lazy(() => import('pages/CalircoAdminSettings/modals/UserModal/EditUserModal'));
const DeviceCreation = React.lazy(() => import('pages/CalircoAdminSettings/modals/DeviceCreation/DeviceCreation'));
const GrowingTree = React.lazy(() => import('components/ClaircoSkeltonLoaders/TreeLoader'));
// - other
// const Invoice = React.lazy(() => import('pages/other/Invoice'));
// const FAQ = React.lazy(() => import('pages/other/FAQ'));
// const Pricing = React.lazy(() => import('pages/other/Pricing'));
// const Maintenance = React.lazy(() => import('pages/other/Maintenance'));
// const Starter = React.lazy(() => import('pages/other/Starter'));
// const PreLoader = React.lazy(() => import('pages/other/PreLoader/'));
// const Timeline = React.lazy(() => import('pages/other/Timeline'));
// const Landing = React.lazy(() => import('pages/landing/'));

// // uikit
// const Accordions = React.lazy(() => import('pages/uikit/Accordions'));
// const Alerts = React.lazy(() => import('pages/uikit/Alerts'));
// const Avatars = React.lazy(() => import('pages/uikit/Avatars'));
// const Badges = React.lazy(() => import('pages/uikit/Badges'));
// const Breadcrumbs = React.lazy(() => import('pages/uikit/Breadcrumb'));
// const Buttons = React.lazy(() => import('pages/uikit/Buttons'));
// const Cards = React.lazy(() => import('pages/uikit/Cards'));
// const Carousels = React.lazy(() => import('pages/uikit/Carousel'));
// const Dropdowns = React.lazy(() => import('pages/uikit/Dropdowns'));
// const EmbedVideo = React.lazy(() => import('pages/uikit/EmbedVideo'));
// const Grid = React.lazy(() => import('pages/uikit/Grid'));
// const ListGroups = React.lazy(() => import('pages/uikit/ListGroups'));
// const Modals = React.lazy(() => import('pages/uikit/Modals'));
// const Notifications = React.lazy(() => import('pages/uikit/Notifications'));
// const Offcanvases = React.lazy(() => import('pages/uikit/Offcanvas'));
// const Placeholders = React.lazy(() => import('pages/uikit/Placeholders'));
// const Paginations = React.lazy(() => import('pages/uikit/Paginations'));
// const Popovers = React.lazy(() => import('pages/uikit/Popovers'));
// const Progress = React.lazy(() => import('pages/uikit/Progress'));
// const Ribbons = React.lazy(() => import('pages/uikit/Ribbons'));
// const Spinners = React.lazy(() => import('pages/uikit/Spinners'));
// const Tabs = React.lazy(() => import('pages/uikit/Tabs'));
// const Tooltips = React.lazy(() => import('pages/uikit/Tooltips'));
// const Typography = React.lazy(() => import('pages/uikit/Typography'));
// const DragDrop = React.lazy(() => import('pages/uikit/DragDrop'));
// const RangeSliders = React.lazy(() => import('pages/uikit/RangeSliders'));
// const Ratings = React.lazy(() => import('pages/uikit/Ratings'));

// // icons
// const Dripicons = React.lazy(() => import('pages/icons/Dripicons'));
// const MDIIcons = React.lazy(() => import('pages/icons/MDIIcons'));
// const Unicons = React.lazy(() => import('pages/icons/Unicons'));

// // forms
// const BasicForms = React.lazy(() => import('pages/forms/Basic'));
// const FormAdvanced = React.lazy(() => import('pages/forms/Advanced'));
// const FormValidation = React.lazy(() => import('pages/forms/Validation'));
// const FormWizard = React.lazy(() => import('pages/forms/Wizard'));
// const FileUpload = React.lazy(() => import('pages/forms/FileUpload'));
// const Editors = React.lazy(() => import('pages/forms/Editors'));

// // charts
// const ApexChart = React.lazy(() => import('pages/charts/Apex'));
// const ChartJs = React.lazy(() => import('pages/charts/ChartJs'));

// // tables
// const BasicTables = React.lazy(() => import('pages/tables/Basic'));
// const AdvancedTables = React.lazy(() => import('pages/tables/Advanced'));

// // widgets
// const Widgets = React.lazy(() => import('pages/uikit/Widgets'));

// // maps
// const GoogleMaps = React.lazy(() => import('pages/maps/GoogleMaps'));
// const VectorMaps = React.lazy(() => import('pages/maps/VectorMaps'));

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
                        { path: 'clairco-in', element: <LoadComponent component={ClaircoAdminLogin} /> },
                        { path: 'register', element: <LoadComponent component={Register} /> },
                        { path: 'confirm', element: <LoadComponent component={Confirm} /> },
                        { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                        { path: 'login2', element: <LoadComponent component={Login2} /> },
                        // { path: 'sensiablelogin', element: <LoadComponent component={SensiableLogin} /> },
                        { path: 'confirm2', element: <LoadComponent component={Confirm2} /> },
                        { path: 'forget-password2', element: <LoadComponent component={ForgetPassword2} /> },
                        { path: 'lock-screen2', element: <LoadComponent component={LockScreen2} /> },
                        { path: 'logout2', element: <LoadComponent component={Logout2} /> },
                    ],
                },
                {
                    path: 'error-404',
                    element: <LoadComponent component={ErrorPageNotFound} />,
                },
                {
                    path: 'error-500',
                    element: <LoadComponent component={ServerError} />,
                },
                // {
                //     path: 'maintenance',
                //     element: <LoadComponent component={Maintenance} />,
                // },
                // {
                //     path: 'landing',
                //     element: <LoadComponent component={Landing} />,
                // },
            ],
        },
        {
            // auth protected routes
            path: '/customer',
            element: <PrivateRoute component={Layout} roles={'Customer'} />,
            children: [
                {
                    path: 'dashboard',
                    element: (
                        <LoadComponent
                            component={
                                claircoCustomerLandingPage
                                // TrailLanding
                            }
                        />
                    ),
                },
                {
                    path: 'outdoor-devices',
                    element: <LoadComponent component={VrvVrfDetailsPageCus} />,
                },
                {
                    path: 'indoor-devices',
                    element: <LoadComponent component={IndoorDeviceHomePage} />,
                },
                {
                    path: 'indoor-devices/:indoorDeviceId',
                    element: <LoadComponent component={indoorUnitDevicePage} />,
                },
                {
                    path: 'outdoor-devices/:deviceId',
                    element: <LoadComponent component={VrvVrfSensorPageCus} />,
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
                {
                    path: 'control-logs',
                    element: <LoadComponent component={ControlLogsPage} />,
                },
                {
                    path: 'iaq',
                    element: <LoadComponent component={IAQHomePage} />,
                },
                {
                    path: 'iaq/:devices',
                    element: <LoadComponent component={IAQDevicePage} />,
                },

                {
                    path: 'test',
                    element: <LoadComponent component={GrowingTree} />,
                },
            ],
        },
        {
            // auth protected routes
            path: '/admin',
            element: <PrivateRoute component={Layout} roles={'Admin'} />,
            children: [
                {
                    path: 'pages',
                    children: [
                        {
                            path: 'error-404-alt',
                            element: <LoadComponent component={ErrorPageNotFoundAlt} />,
                        },
                        {
                            path: 'test',
                            element: <LoadComponent component={GrowingTree} />,
                        },
                        {
                            path: 'admindashboard',
                            element: <LoadComponent component={ClaircoAdminDashboard} />,
                        },
                        {
                            path: ':customerName',
                            element: <LoadComponent component={BuildingListPage} />,
                        },
                        {
                            path: ':customerName/:buildingName',
                            element: <LoadComponent component={FloorListPage} />,
                        },
                        {
                            path: ':customerName/:buildingName/:floorName',
                            element: <LoadComponent component={DevicesListPage} />,
                        },
                        {
                            path: 'indoor-devices',
                            element: <LoadComponent component={IndoorUnitAdminHome} />,
                        },
                        {
                            path: 'indoor-devices/:indoorDeviceId',
                            element: <LoadComponent component={IndoorUnitAdminDevice} />,
                        },
                        {
                            path: 'outdoor-devices',
                            element: <LoadComponent component={VrvVrfDetailsPage} />,
                        },

                        {
                            path: 'outdoor-devices/:device',
                            element: <LoadComponent component={VrvVrfSensorPage} />,
                        },
                        {
                            path: 'occupancy',
                            element: <LoadComponent component={OccupancyListAdmin} />,
                        },
                        {
                            path: 'occupancy/:device',
                            element: <LoadComponent component={OccupancySensorPageAdmin} />,
                        },
                        {
                            path: 'pir/:device',
                            element: <LoadComponent component={PIROccupancyDevicePage} />,
                        },
                        {
                            path: 'thermopile',
                            element: <LoadComponent component={ThemopileHome} />,
                        },
                        {
                            path: 'thermopile/:device',
                            element: <LoadComponent component={ThemopileDevicePage} />,
                        },
                        {
                            path: 'iaq',
                            element: <LoadComponent component={IAQDetailsPage} />,
                        },
                        {
                            path: 'iaq/:device',
                            element: <LoadComponent component={IAQSensorPageAdmin} />,
                        },
                        {
                            path: 'maintenance-logs',
                            element: <LoadComponent component={MaintananceLogsPage} />,
                        },
                        {
                            path: 'claircosettings',
                            element: <LoadComponent component={Admin} />,
                        },
                        {
                            path: 'ahu',
                            element: <LoadComponent component={AhuHomePageAdmin} />,
                        },

                        {
                            path: 'ahu/:device',
                            element: <LoadComponent component={AhuDevicePageAdmin} />,
                        },
                        {
                            path: 'energymeter',
                            element: <LoadComponent component={EnergyMeterListAdmin} />,
                        },
                        {
                            path: 'energymeter/:device',
                            element: <LoadComponent component={EnergyMeterSensorAdmin} />,
                        },
                        {
                            path: 'tree',
                            element: <LoadComponent component={treeView} />,
                        },

                        {
                            path: 'control-logs',
                            element: <LoadComponent component={ControlLogs} />,
                        },
                        {
                            path: 'pcs',
                            element: <LoadComponent component={PCSHomeAdmin} />,
                        },
                        {
                            path: 'pcs/:device',
                            element: <LoadComponent component={PCSDevicePageAdmin} />,
                        },
                        {
                            path: 'whiteboard',
                            element: <LoadComponent component={WhiteBoardPage} />,
                        },

                        {
                            path: 'edit',
                            children: [
                                {
                                    path: 'customer',
                                    element: <LoadComponent component={editCustomerModal} />,
                                },
                                {
                                    path: 'building',
                                    element: <LoadComponent component={editBuildingModal} />,
                                },
                                {
                                    path: 'floor',
                                    element: <LoadComponent component={editFloorModal} />,
                                },
                                {
                                    path: 'zone',
                                    element: <LoadComponent component={editZoneModal} />,
                                },
                                // {
                                //     path:'device',
                                //     element:<LoadComponent component={editDeviceModal}/>
                                // },
                                {
                                    path: 'gateWay',
                                },
                                {
                                    path: 'user',
                                    element: <LoadComponent component={editUserModal} />,
                                },
                            ],
                        },
                        // {
                        //     path: 'customertable',
                        //     element: <LoadComponent component={CustomerTable} />,
                        // },
                        // {
                        //     path: 'buildingtable',
                        //     element: <LoadComponent component={BuildingsTable} />,
                        // },
                        // {
                        //     path: 'floorstable',
                        //     element: <LoadComponent component={FloorsTable} />,
                        // },
                        {
                            path: 'deviceCreation',
                            element: <LoadComponent component={DeviceCreation} />,
                        },
                        {
                            path: 'uv',
                            // element: <PrivateRoute component={Layout} />,
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
            ],
        },
    ]);
};

export { AllRoutes };
