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
        key: 'HOME',
        label: 'Home',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/home',
    },
    {
        key: 'IAQ',
        label: 'IAQ',
        isTitle: false,
        icon: 'uil-water',
        url: 'iaq-home',
    },
    {
        key: 'PCS',
        label: 'PCS',
        isTitle: false,
        icon: 'mdi mdi-account-multiple',
        url: 'pcs-home',
    },
];

const ENERGY_MENU_ITEMS: MenuItemType[] = [
    {
        key: 'HOME',
        label: 'Home',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/home',
    },
    {
        key: 'Energy Meter',
        label: 'Energy ',
        isTitle: false,
        icon: 'uil-tachometer-fast',
        url: 'energymeter',
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
];

const WASHROOM_MENU_ITEMS: MenuItemType[] = [
    {
        key: 'HOME',
        label: 'Home',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/home',
    },
    {
        key: 'Washroom-IAQ',
        label: 'OdourClair',
        isTitle: false,
        icon: 'uil-water',
        url: 'Odour',
    },
    {
        key: 'PCS',
        label: 'sensiCOUNT',
        isTitle: false,
        icon: 'mdi mdi-account-multiple',
        url: 'sensiCOUNT',
    },
    {
        key: 'Feedback',
        label: 'Feedback Analytics',
        isTitle: false,
        icon: 'mdi mdi-message',
        url: 'feedback',
    },
];
const IAQ_MENU_ITEMS: MenuItemType[] = [
    {
        key: 'HOME',
        label: 'Home',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/home',
    },
    {
        key: 'IAQ',
        label: 'IAQ',
        isTitle: false,
        icon: 'uil-water',
        url: 'iaq-home',
    },
    // {
    //     key: 'PCS',
    //     label: 'PCS',
    //     isTitle: false,
    //     icon: 'mdi mdi-account-multiple',
    //     url: 'pcs-home',
    // },
];

const SPACE_MENU_ITEMS: MenuItemType[] = [
    {
        key: 'HOME',
        label: 'Home',
        isTitle: false,
        icon: 'uil-home-alt',
        url: '/home',
    },
    // {
    //     key: 'IAQ',
    //     label: 'IAQ',
    //     isTitle: false,
    //     icon: 'uil-water',
    //     url: 'iaq-home',
    // },
    {
        key: 'PCS',
        label: 'PCS',
        isTitle: false,
        icon: 'mdi mdi-account-multiple',
        url: 'pcs-home',
    },
];

const CUSTOMER_MENU_ITEMS: MenuItemType[] = [
    // {
    //     key: 'Dashboard',
    //     label: 'Dashboard',
    //     isTitle: false,
    //     icon: ' uil-home-alt',
    //     url: 'dashboard',
    // },
    // {
    //     key: 'Energy Meter',
    //     label: 'Energy Meter',
    //     isTitle: false,
    //     icon: 'uil-tachometer-fast',
    //     url: 'energymeter',
    // },
    // {
    //     key: 'outdoor',
    //     label: 'Outdoor Units',
    //     isTitle: false,
    //     icon: 'uil-exchange-alt',
    //     url: 'outdoor-devices',
    // },
    // {
    //     key: 'indoor',
    //     label: 'Indoor Units',
    //     isTitle: false,
    //     icon: 'uil-exchange-alt',
    //     url: 'indoor-devices',
    // },
    {
        key: 'IAQ',
        label: 'IAQ',
        isTitle: false,
        icon: 'uil-water',
        url: 'iaq',
    },
    // {
    //     key: 'Occupancy',
    //     label: 'Occupancy',
    //     isTitle: false,
    //     icon: 'uil-sitemap',
    //     url: 'occupancy',
    // },
    // {
    //     key: 'AHU',
    //     label: 'AHU',
    //     isTitle: false,
    //     icon: 'uil-wind',
    //     url: 'ahu',
    // },

    // {
    //     key: 'Control-Logs',
    //     label: 'Control-Logs',
    //     isTitle: false,
    //     icon: 'uil-list-ul',
    //     url: 'control-logs',
    // },
];

export { MENU_ITEMS, CUSTOMER_MENU_ITEMS, ENERGY_MENU_ITEMS, IAQ_MENU_ITEMS, SPACE_MENU_ITEMS, WASHROOM_MENU_ITEMS };
