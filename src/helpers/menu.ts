import { MENU_ITEMS, MenuItemType, CUSTOMER_MENU_ITEMS } from 'appConstants';
import { getDeviceListFromSession, getUserIdFromSession } from 'utils/storageFunctions';
import { APICore } from './api/apiCore';

// const loginData = JSON.parse(sessionStorage.getItem('USER_DATA') || ' ');
const getMenuItems = () => {
    const api = new APICore();
    // NOTE - You can fetch from server and return here as well
    const storedData = sessionStorage.getItem('USER_DATA');
    const deviceList = api.getLoggedInUser()?.user?.assignedDeviceTypes?.map((doc: any) => doc?.deviceTypeName);
    // ;
    const customerSideMenu = [];
    // if (deviceList.includes('VRV/VRF')) customerSideMenu.push(CUSTOMER_MENU_ITEMS[3]);
    if (deviceList?.includes('VRV/VRF')) customerSideMenu.push(CUSTOMER_MENU_ITEMS[3]);
    if (deviceList?.includes('VRV/VRF Outdoor')) customerSideMenu.push(CUSTOMER_MENU_ITEMS[2]);
    if (deviceList?.includes('IAQ')) customerSideMenu.push(CUSTOMER_MENU_ITEMS[4]);
    if (deviceList?.includes('AHU')) customerSideMenu.push(CUSTOMER_MENU_ITEMS[6]);
    if (deviceList?.includes('Occupancy')) customerSideMenu.push(CUSTOMER_MENU_ITEMS[5]);
    const data = storedData ? JSON.parse(storedData) : {};
    const role: string = data?.user?.type || '';
    // console.log('Active sidebar', customerSideMenu);
    if (customerSideMenu?.length > 1) customerSideMenu.unshift(CUSTOMER_MENU_ITEMS[0]);
    return role === 'Admin' ? MENU_ITEMS : customerSideMenu;
};

const findAllParent = (menuItems: MenuItemType[], menuItem: MenuItemType): string[] => {
    let parents: string[] = [];
    const parent = findMenuItem(menuItems, menuItem['parentKey']);

    if (parent) {
        parents.push(parent['key']);
        if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
    }

    return parents;
};

const findMenuItem = (
    menuItems: MenuItemType[] | undefined,
    menuItemKey: MenuItemType['key'] | undefined
): MenuItemType | null => {
    if (menuItems && menuItemKey) {
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i].key === menuItemKey) {
                return menuItems[i];
            }
            var found = findMenuItem(menuItems[i].children, menuItemKey);
            if (found) return found;
        }
    }
    return null;
};

export { getMenuItems, findAllParent, findMenuItem };
