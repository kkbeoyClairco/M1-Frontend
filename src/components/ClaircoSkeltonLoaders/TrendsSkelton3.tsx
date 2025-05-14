import React from 'react';

const TrendsSkeltonIterator = () => {
    return (
        <div className="card-body">
            <h5 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
            </h5>
            <p className="card-text placeholder-glow">
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
            </p>
        </div>
    );
};
export const TrendsSkelton3 = () => {
    return (
        <>
            {Array.from({ length: 3 }).map(() => (
                <TrendsSkeltonIterator />
            ))}
            ;
        </>
    );
};
