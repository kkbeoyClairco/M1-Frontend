import React from 'react';

interface InfoWidgetPropsInterface {
    count: number;
    maxTemp: number;
    ambTemp: number;
    status: boolean;
}
const InfoWidget: React.FC<InfoWidgetPropsInterface> = ({ count, maxTemp, ambTemp, status }) => {
    return (
        <div className="card rounded-lg shadow-lg mb-0">
            <div className="card-body row my-3">
                <div className="col text-center">
                    <div className="fw-bold">People Count</div>
                    {status && <div>{count}</div>}
                </div>
                <div className="col text-center">
                    <div className="fw-bold">Max Temp</div>
                    {status && <div>{maxTemp}°C</div>}
                </div>
                <div className="col text-center">
                    <div className="fw-bold">Amb Temp</div>
                    {status && <div>{ambTemp}°C</div>}
                </div>
                {!status && <p className="  text-center m-0">Start Commissioning to view the live values</p>}
            </div>
        </div>
    );
};

export default InfoWidget;
