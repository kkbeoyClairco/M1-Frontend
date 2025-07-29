import React from 'react';
import { roundToOneDecimal } from 'utils/maths';

const Slider = ({ value, setValue, min, max, parameterName }: any) => {
    return (
        <div>
            <input
                className="w-100 shadow rounded-lg h-25"
                style={{
                    transition: 'all 0.2s ease-in-out',
                }}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
            />
            <h6>
                {parameterName}: {value ? roundToOneDecimal(value / 100) : 'N/A'}
            </h6>
        </div>
    );
};

export default Slider;
