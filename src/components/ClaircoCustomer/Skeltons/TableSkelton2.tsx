import React from 'react';
import skelton from '../skelton';

const SkeltonBase = () => {
    return (
        <div className="card-body py-0 px-1">
            <h5 className="card-title placeholder-glow">
                <span className="placeholder col-1 mx-2 "></span>
                <span className="placeholder col-2 m-1"></span>
                <span className="placeholder col-4 m-1"></span>
                <span className="placeholder col-3 m-1"></span>

                <span className="placeholder col-1"></span>
            </h5>
        </div>
    );
};
const TableSkelton2 = () => {
    return (
        <div>
            {Array.from({ length: 10 }, (_, index) => {
                return <SkeltonBase key={index} />;
            })}
        </div>
    );
};

export default React.memo(TableSkelton2);
