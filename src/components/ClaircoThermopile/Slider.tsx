import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface SliderPropsInterface {
    startInput?: number | string;
    endInput?: number | string | null;
    thresholdControlFn: any;
    min: number;
    max: number;
}
const Slider: React.FC<SliderPropsInterface> = ({ startInput, endInput, thresholdControlFn, min, max }) => {
    // const [start1, setStart] = useState<string[]>([]);

    const start1 = useMemo(() => {
        // if (startInput) ([startInput]);

        if (startInput && endInput) return [startInput.toString(), endInput.toString()];
        else if (startInput) return [startInput.toString()];
        else return [0];
    }, [startInput, endInput]);
    // useEffect(() => {
    //     console.log('Function', thresholdControlFn);
    // }, [thresholdControlFn]);
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Nouislider
                step={0.5}
                animate
                key={start1.join('-')}
                range={{ min: min, max: max }}
                start={start1}
                tooltips={true}
                pips={{ mode: 'positions', values: [0, 25, 50, 75, 100], density: 1 }}
                // start={[startInput,  ?? '']}
                connect
                onSlide={thresholdControlFn}
            />
        </div>
    );
};
export default Slider;
