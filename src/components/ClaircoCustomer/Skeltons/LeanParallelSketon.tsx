import React from 'react';

const LeanParallelSketon = ({ rows = 2 }) => {
    return (
        <div>
            <div>
                <div className="" aria-hidden="true">
                    {/* <img src="..." className="card-img-top" alt="..." /> */}
                    {new Array(rows).fill(1).map((row) => {
                        return (
                            <div className="card-body">
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>
                                {/* <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5> */}
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>{' '}
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>{' '}
                                <h5 className="card-title placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default React.memo(LeanParallelSketon);
