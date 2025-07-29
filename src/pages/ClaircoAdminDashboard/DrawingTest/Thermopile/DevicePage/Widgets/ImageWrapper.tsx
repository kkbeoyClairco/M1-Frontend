import React, { useState } from 'react';
import CameraFeeds from './CameraFeeds';
import ThermalImage from './ThermalImage';
import OfflineWidget from './OfflineWidget';

const ImageWrapper = ({ images, isStreaming }: any) => {
    const [activeTab, setActiveTab] = useState<'thermal' | 'live'>('live');

    return (
        <div>
            {/* Bootstrap Nav Tabs */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'live' ? 'active ' : ''}`}
                        onClick={() => setActiveTab('live')}>
                        Live{' '}
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'thermal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('thermal')}>
                        Thermal
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="mt-0">
                {activeTab === 'live' && (
                    <div> {isStreaming ? <CameraFeeds image={images.raw} /> : <OfflineWidget />} </div>
                )}
                {activeTab === 'thermal' && (
                    <div>{isStreaming ? <ThermalImage image={images.raw} /> : <OfflineWidget />}</div>
                )}
            </div>

            {/* Info Row */}
        </div>
    );
};

export default ImageWrapper;
