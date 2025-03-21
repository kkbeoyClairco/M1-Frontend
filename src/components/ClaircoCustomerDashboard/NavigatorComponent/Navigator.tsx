import React from 'react';

const Navigator = ({ color }: any) => {
    return (
        <div style={{ cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="1.1em" viewBox="0 0 512 512">
                <path fill={color ? color : '#6c757d'} d="M480 32L32 240h240v240z"></path>
            </svg>
            {/* <i className="uil-navigator"></i> */}
        </div>
    );
};

export default Navigator;
