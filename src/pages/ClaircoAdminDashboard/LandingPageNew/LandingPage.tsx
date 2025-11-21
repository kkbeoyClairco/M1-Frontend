import React from 'react';
import BentoGrid from 'components/BentoGrid/BentoGrid';
import 'components/BentoGrid/BentoGrid.scss';

const LandingPage = () => {
    return (
        <div className="landing-page-root">
            <BentoGrid />
            {/* Existing landing page content can go below or above the grid */}
        </div>
    );
};

export default LandingPage;
