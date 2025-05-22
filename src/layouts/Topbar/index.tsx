import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { showRightSidebar, changeSidebarType } from 'redux/actions';
import * as layoutConstants from 'appConstants';
import { useRedux, useToggle, useViewport } from 'hooks';
import { profileMenus } from './data';
import LanguageDropdown from './LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchDropdown from './SearchDropdown';
import TopbarSearch from './TopbarSearch';
import AppsDropdown from './AppsDropdown';
import userImage from 'assets/images/users/avatar-1.jpg';
import logoSmDark from 'assets/images/logo_sm_dark.png';
import logoSmLight from 'assets/images/logo_sm.png';
import logo from 'assets/images/logo-light.png';
import { useEffect, useState } from 'react';
import { getUserDetailsFromSession } from 'utils/storageFunctions';
const userImageDummy = `https://res.cloudinary.com/dlulq6hny/image/upload/v1737283789/dummy-prod-1_bzsdsp.jpg`;

type TopbarProps = {
    hideLogo?: boolean;
    navCssClasses?: string;
    openLeftMenuCallBack?: () => void;
    topbarDark?: boolean;
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps) => {
    const { dispatch, appSelector } = useRedux();
    const [user, setUser] = useState<any>({});

    const { width } = useViewport();
    const [isMenuOpened, toggleMenu] = useToggle();

    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = appSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    // console.log('Left sidebar type:', leftSideBarType);
    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LayoutTypes.LAYOUT_VERTICAL:
                if (width >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            default:
                break;
        }
    };

    /**
     * Toggles the right sidebar
     */
    const handleRightSideBar = () => {
        dispatch(showRightSidebar());
    };

    useEffect(() => {
        // Dispatch an action to close the left menu when the component mounts
        if (layoutType === layoutConstants.LayoutTypes.LAYOUT_VERTICAL) {
            dispatch(changeSidebarType(layoutConstants.SideBarWidth.LEFT_SIDEBAR_TYPE_FIXED));
        }
    }, [dispatch, layoutType]);
    useEffect(() => {
        const user = getUserDetailsFromSession();
        setUser({
            name: user?.name || '',
        });
    }, []);
    return (
        <div className={classNames('navbar-custom', navCssClasses)}>
            <div className={containerCssClasses}>
                {!hideLogo && (
                    <Link to="/" className="topnav-logo">
                        <span className="topnav-logo-lg">
                            <img src={logo} alt="logo" height="16" />
                        </span>
                        <span className="topnav-logo-sm">
                            <img src={topbarDark ? logoSmLight : logoSmDark} alt="logo" height="16" />
                        </span>
                    </Link>
                )}

                <ul className="list-unstyled topbar-menu float-end mb-0">
                    <li className="dropdown notification-list">
                        <ProfileDropdown
                            userImage={userImageDummy}
                            menuItems={profileMenus}
                            username={user.name}
                            userTitle={''}
                        />
                    </li>
                </ul>

                {/* toggle for vertical layout */}

                {/* <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                    <i className="mdi mdi-menu" />
                </button> */}
            </div>
        </div>
    );
};

export default Topbar;
