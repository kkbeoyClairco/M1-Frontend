import { MENU_ITEMS, MenuItemType, CUSTOMER_MENU_ITEMS } from 'appConstants';
import { getDeviceListFromSession, getUserIdFromSession } from 'utils/storageFunctions';
import { APICore } from './api/apiCore';
import { getAssignedDeviceType } from './user';

// const loginData = JSON.parse(sessionStorage.getItem('USER_DATA') || ' ');
const getMenuItems = () => {
    const api = new APICore();
    // NOTE - You can fetch from server and return here as well
    const storedData = JSON.parse(sessionStorage?.getItem('USER_DATA') ?? '');
    const role: string = storedData?.user?.type || '';

    if (role === 'Admin') return MENU_ITEMS;

    const deviceList = getAssignedDeviceType(storedData);
    // const deviceList = api.getLoggedInUser()?.user?.assignedDeviceTypes?.map((doc: any) => doc?.deviceTypeName);
    // ;
    // console.log('Sessrion data', CUSTOMER_MENU_ITEMS, deviceList);
    const customerSideMenu = [];
    if (deviceList?.includes('IAQ')) customerSideMenu.push(MENU_ITEMS[0]);
    if (deviceList?.includes('UV')) customerSideMenu.push(MENU_ITEMS[1]);
    customerSideMenu.push(MENU_ITEMS[2]);
    return customerSideMenu;
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
