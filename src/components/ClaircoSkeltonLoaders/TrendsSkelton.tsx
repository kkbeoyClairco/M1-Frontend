import React from 'react';
const TrendsSkeltonIterator = () => {
    return (
        <div className="card-body py-0 px-1 h-60 w-100">
            <h5 className="card-title placeholder-glow h-100 ">
                <span className="placeholder col-12 my-1 "></span>
                <span className="placeholder col-10  my-1"></span>
                <span className="placeholder col-10 my-1"></span>
                <span className="placeholder col-10  my-1"></span>
                <span className="placeholder col-12 my-1"></span>
            </h5>
        </div>
    );
};
const TrendsSkelton = () => {
    return (
        <>
            {Array.from({ length: 3 }).map(() => (
                <TrendsSkeltonIterator />
            ))}
        </>
    );
};

export default TrendsSkelton;
