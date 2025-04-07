import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { getMenuItems } from 'helpers';
import AppMenu from './Menu/';
import profileImg from 'assets/images/users/avatar-1.jpg';
import SensiableLogo1 from 'assets/images/sensiable/SensiableLogo1.svg';
import ClaircoLogo from '../assets/images/Clairco_Logo_rezised.png';
import Wave from '../assets/images/waves.png';
type SideBarContentProps = {
    hideUserProfile: boolean;
    isCondensed: boolean;
};

const SideBarContent = ({ hideUserProfile, isCondensed }: SideBarContentProps) => {
    return (
        <div>
            {/* {!hideUserProfile && (
                <div className="leftbar-user">
                    <Link to="/">
                        <img src={profileImg} alt="" height="42" className="rounded-circle shadow-sm" />
                        <span className="leftbar-user-name">Dominic Keller</span>
                    </Link>
                </div>
            )} */}
            {!isCondensed && (
                <img src={Wave} alt="logo" className="nav-wave" loading="lazy" height={!isCondensed ? '45' : '0'} />
            )}
            {!isCondensed && (
                <div className="nav-logo">
                    {/* <span className="logo text-center logo-dark "> */}

                    <img
                        src={ClaircoLogo}
                        alt="logo"
                        className=" "
                        loading="lazy"
                        height={!isCondensed ? '180' : '45'}
                    />
                    {/* </span> */}
                </div>
            )}
            <AppMenu menuItems={getMenuItems()} isCondensed={isCondensed} />

            <div className="clearfix" />
        </div>
    );
};

type LeftSidebarProps = {
    hideLogo?: boolean;
    hideUserProfile: boolean;
    isLight: boolean;
    isCondensed: boolean;
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }: LeftSidebarProps) => {
    const menuNodeRef = useRef<HTMLDivElement>(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: MouseEvent) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target as Node)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <div className="leftside-menu shadow-lg rounded-lg" ref={menuNodeRef}>
            {!hideLogo && (
                <>
                    {/* <Link to="/" className="logo text-center logo-light mb-5"> */}
                    {/* 
                    <span className="logo text-center logo-dark mb-5">
                        <img src={ClaircoLogo} alt="logo1" height={!isCondensed ? '85' : '45'} />
                    </span> */}
                    {/* </Link> */}
                </>
            )}
            {!isCondensed && (
                // <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                <SideBarContent hideUserProfile={hideUserProfile} isCondensed={isCondensed} />
                // </SimpleBar>
            )}
            {isCondensed && <SideBarContent hideUserProfile={hideUserProfile} isCondensed={isCondensed} />}
        </div>
    );
};

export default LeftSidebar;
