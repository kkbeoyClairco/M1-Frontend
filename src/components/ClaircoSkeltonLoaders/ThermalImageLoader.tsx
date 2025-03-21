import React from 'react';

const ThermalImageLoader = () => {
    return (
        <div
            style={{
                height: '216px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {' '}
            <div style={{ width: '100%' }}>
                <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                </h5>{' '}
                <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                </p>
            </div>
        </div>
    );
};

export default ThermalImageLoader;
