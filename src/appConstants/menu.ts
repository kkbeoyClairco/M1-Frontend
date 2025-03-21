export type MenuItemType = {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: {
        variant: string;
        text: string;
    };
    parentKey?: string;
    target?: string;
    children?: MenuItemType[];
};

const MENU_ITEMS: MenuItemType[] = [
    {
        key: 'Dashboard',
        label: 'Dashboard',
        isTitle: false,
        icon: ' uil-home-alt',
        url: 'pages/admindashboard',
    },
    {
        key: 'Energy Meter',
        label: 'Energy Meter',
        isTitle: false,
        icon: 'uil-tachometer-fast',
        url: 'pages/energymeter',
    },
    {
        key: 'Occupancy',
        label: 'Occupancy',
        isTitle: false,
        icon: 'uil-sitemap',
        url: 'pages/occupancy',
    },
    {
        key: 'IAQ',
        label: 'IAQ',
        isTitle: false,
        icon: 'uil-wind',
        url: 'pages/iaq',
    },
    {
        key: 'indoor',
        label: 'Indoor Units',
        isTitle: false,
        icon: 'uil-exchange-alt',
        url: 'pages/indoor-devices',
    },
    {
        key: 'outdoor',
        label: 'Outdoor Units',
        isTitle: false,
        icon: 'uil-exchange-alt',
        url: 'pages/outdoor-devices',
    },

    {
        key: 'AHU',
        label: 'AHU',
        isTitle: false,
        icon: 'uil-filter',
        url: 'pages/ahu',
    },

    {
        key: 'Settings',
        label: 'Settings',
        isTitle: false,
        icon: 'dripicons-gear',
        url: 'pages/claircosettings',
    },
    {
        key: 'Clients Tree',
        label: 'Clients Tree',
        isTitle: false,
        icon: 'mdi mdi-file-tree',
        url: 'pages/tree',
    },
    // {
    //     key: 'Control-Logs',
    //     label: 'Control-Logs',
    //     isTitle: false,
    //     icon: 'uil-list-ul',
    //     url: 'pages/control-logs',
    // },
];

const CUSTOMER_MENU_ITEMS: MenuItemType[] = [
    {
        key: 'Dashboard',
        label: 'Dashboard',
        isTitle: false,
        icon: ' uil-home-alt',
        url: 'dashboard',
    },
    {
        key: 'Energy Meter',
        label: 'Energy Meter',
        isTitle: false,
        icon: 'uil-tachometer-fast',
        url: 'energymeter',
    },
    {
        key: 'outdoor',
        label: 'Outdoor Units',
        isTitle: false,
        icon: 'uil-exchange-alt',
        url: 'outdoor-devices',
    },
    {
        key: 'indoor',
        label: 'Indoor Units',
        isTitle: false,
        icon: 'uil-exchange-alt',
        url: 'indoor-devices',
    },
    {
        key: 'IAQ',
        label: 'IAQ',
        isTitle: false,
        icon: 'uil-refresh',
        url: 'iaq',
    },
    {
        key: 'Occupancy',
        label: 'Occupancy',
        isTitle: false,
        icon: 'uil-sitemap',
        url: 'occupancy',
    },
    {
        key: 'AHU',
        label: 'AHU',
        isTitle: false,
        icon: 'uil-wind',
        url: 'ahu',
    },

    {
        key: 'Control-Logs',
        label: 'Control-Logs',
        isTitle: false,
        icon: 'uil-list-ul',
        url: 'control-logs',
    },
];

export { MENU_ITEMS, CUSTOMER_MENU_ITEMS };
