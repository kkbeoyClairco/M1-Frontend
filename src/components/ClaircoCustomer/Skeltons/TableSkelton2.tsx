import React from 'react';

const TableSkelton2 = () => {
    return (
        <div>
            <div>
                <div className="" aria-hidden="true">
                    {/* <img src="..." className="card-img-top" alt="..." /> */}
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-12"></span>
                            {/* <span className="placeholder col-4"></span> */}
                        </h5>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-8"></span>
                        </p>
                        {/* <a href="#" tabIndex="-1" class="btn btn-primary disabled placeholder col-6"></a> */}
                    </div>
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-12"></span>
                            {/* <span className="placeholder col-4"></span> */}
                        </h5>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-8"></span>
                        </p>
                        {/* <a href="#" tabIndex="-1" class="btn btn-primary disabled placeholder col-6"></a> */}
                    </div>
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-12"></span>
                            {/* <span className="placeholder col-4"></span> */}
                        </h5>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-8"></span>
                        </p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-12"></span>
                            {/* <span className="placeholder col-4"></span> */}
                        </h5>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-8"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TableSkelton2);
