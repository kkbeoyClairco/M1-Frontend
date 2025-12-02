import React from 'react';
import BentoGrid from 'components/BentoGrid/BentoGrid';
import 'components/BentoGrid/BentoGrid.scss';
import BentoGrid2 from 'components/BentoGrid2/BentoGrid2';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [logoutHovered, setLogoutHovered] = React.useState(false);

    const handleLogout = () => {
        navigate('/logout');
    };
    return (
        <div className="landing-page-root" style={{ position: 'relative' }}>
            <button
                style={{
                    position: 'absolute',
                    top: 5,
                    right: 32,
                    padding: '8px 20px',
                    borderRadius: 20,
                    background: logoutHovered ? 'linear-gradient(135deg, #f5fafd 0%, #e8f0fe 100%)' : 'transparent',
                    color: '#2c3e50',
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: logoutHovered ? '0 6px 24px 0 rgba(44,62,80,0.18)' : '0 2px 8px rgba(44,62,80,0.08)',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'background 0.3s, box-shadow 0.3s',
                }}
                onClick={handleLogout}
                onMouseEnter={() => setLogoutHovered(true)}
                onMouseLeave={() => setLogoutHovered(false)}>
                Logout
            </button>
            <BentoGrid2 />
            {/* <BentoGrid /> */}
            {/* Existing landing page content can go below or above the grid */}
        </div>
    );
};

export default LandingPage;
