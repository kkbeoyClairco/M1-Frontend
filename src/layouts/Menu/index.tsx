import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { findAllParent, findMenuItem } from 'helpers';
import { MenuItemType } from 'appConstants';
import MenuItem from './MenuItem';
import MenuItemWithChildren from './MenuItemWithChildren';
import ClaircoLogo from '../../assets/images/Clairco_Logo.png';
import { isAdmin, isPanasonic } from 'utils/storageFunctions';

type AppMenuProps = {
    menuItems: Array<MenuItemType>;
    isCondensed: boolean;
};

const AppMenu = ({ menuItems, isCondensed }: AppMenuProps) => {
    let location = useLocation();
    const [isPanasonicUser, setIsPanasonicUser] = useState(false);

    const menuRef = useRef<HTMLUListElement>(null);

    const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

    /*
     * toggle the menus
     */
    const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
        if (show) setActiveMenuItems([menuItem['key'], ...findAllParent(menuItems, menuItem)]);
    };

    /**
     * activate the menuitems
     */
    const activeMenu = useCallback(() => {
        const div = document.getElementById('main-side-menu');
        let matchingMenuItem = null;

        if (div) {
            let items: HTMLCollectionOf<HTMLAnchorElement> = div.getElementsByClassName(
                'side-nav-link-ref'
            ) as HTMLCollectionOf<HTMLAnchorElement>;
            for (let i = 0; i < items.length; ++i) {
                if (location.pathname === items[i].pathname) {
                    matchingMenuItem = items[i];
                    break;
                }
            }

            if (matchingMenuItem) {
                const mid = matchingMenuItem.getAttribute('data-menu-key');
                const activeMt = findMenuItem(menuItems, mid!);
                if (activeMt) {
                    setActiveMenuItems([activeMt['key'], ...findAllParent(menuItems, activeMt)]);
                }
            }
        }
    }, [location.pathname, menuItems]);

    useEffect(() => {
        activeMenu();
    }, [activeMenu]);
    useEffect(() => {
        const user = isAdmin();
        setIsPanasonicUser(!user);
    }, []);
    return (
        <ul className="side-nav" ref={menuRef} id="main-side-menu">
            {/* {console.log('Menu items:', menuItems)} */}
            {(menuItems || []).map((item, index) => {
                if (item.key === 'Control-Logs' && isPanasonicUser) return '';
                return (
                    <React.Fragment key={index.toString()}>
                        {item.isTitle ? (
                            <li className="side-nav-title side-nav-item">{item.label}</li>
                        ) : (
                            <>
                                {item.children ? (
                                    <MenuItemWithChildren
                                        item={item}
                                        toggleMenu={toggleMenu}
                                        subMenuClassNames="side-nav-second-level"
                                        activeMenuItems={activeMenuItems}
                                        linkClassName="side-nav-link"
                                    />
                                ) : (
                                    <MenuItem
                                        item={item}
                                        linkClassName="side-nav-link"
                                        className={activeMenuItems.includes(item.key) ? 'menuitem-active' : ''}
                                    />
                                )}
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </ul>
    );
};

export default AppMenu;
